import OpenAI from "openai";
import { getCurrentUser } from "./firebaseDatabase";

// Function to match two individuals based on provided information
export async function matchAI(userSuggestions) {
    try {
        // Initialize the OpenAI API client with your API key and correct URL
        const openai = new OpenAI({ apiKey: 'openAI key' });
        const path = '/chat/completions';
        openai.baseURL = 'https://api.openai.com/v1';
        openai.buildURL = () => `${openai.baseURL}${path}`;

        // Get the current user
        const firstUser = user || await getCurrentUser();

        // Prepare a list of promises for parallel execution
        const matchPromises = userSuggestions.map(async (secondUserDoc) => {

            // Construct the conversation prompt
            const prompt = `
                first user: ${firstUser.firstName}, ${firstUser.age}, ${firstUser.occupation}, about me: ${firstUser.aboutMe}, desire match: ${firstUser.desireMatch}.
                second user: ${secondUserDoc.firstName}, ${secondUserDoc.age}, ${secondUserDoc.occupation}, about me: ${secondUserDoc.aboutMe}, desire match: ${secondUserDoc.desireMatch}
            `;

            try {
                // Send a request to the OpenAI API to generate completions for the conversation prompt
                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: 'system', content: 'Please rate these two people\'s dating match on a percentage rate from 1% to 100%' },
                        { role: 'user', content: prompt },
                    ],
                    model: "gpt-3.5-turbo",
                });

                if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
                    console.error('Invalid response from OpenAI API');
                    return null;
                }

                const messageContent = completion.choices[0].message.content;
                console.log('res - message : ', messageContent);

                // Attempt to extract the match rate from the completion response
                const matchRateMatch = messageContent.match(/\d+(\.\d+)?%/);

                const matchRate = parseFloat(matchRateMatch ? matchRateMatch : '0');
                console.log('res - matchRate : ', matchRate);

                return {
                    usersNames: `${firstUser.firstName} & ${secondUserDoc.firstName}`,
                    matchRate: matchRate,
                    aiMessage: messageContent,
                    userId: secondUserDoc.id,
                    firstName: secondUserDoc.firstName,
                    images: secondUserDoc.images,
                    age: secondUserDoc.age,
                };
            } catch (error) {
                console.error(`Error processing match for ${secondUserDoc.firstName}:`, error);
                return null; // Return null for errors to maintain array length
            }
        });

        // Wait for all match promises to resolve
        const matchResults = await Promise.all(matchPromises);

        // Filter out null results and sort by match rate in descending order
        // Return the sorted match results
        return matchResults.filter(result => result !== null).sort((a, b) => b.matchRate - a.matchRate);

    } catch (error) {
        console.error("WARNING: An error occurred while processing the matchAI request:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}