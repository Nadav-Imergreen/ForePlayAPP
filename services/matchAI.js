<<<<<<< HEAD
// import OpenAI from "openai";
// import axios from 'axios';

// export const matchAI = async (message) => {
//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/chat/completions',
//             {
//                 model: 'gpt-3.5-turbo',
//                 messages: [
//                     { role: 'system', content: 'You are a helpful assistant.' },
//                     { role: 'user', content: message },
//                 ],
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer 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`,
//                 },
//             }
//         );
//
//         // Handle the response here
//         console.log(response.data.choices[0].message.content);
//     } catch (error) {
//         console.error('Error sending chat request:', error.message);
//     }
// };



import OpenAI from "openai";

// Function to match two individuals based on provided information
export async function matchAI(user, userSuggestions) {
    try {
        // Initialize the OpenAI API client with your API key and correct url
        const openai = new OpenAI({ apiKey: 'OPEN_AI_KEY' });
=======
import OpenAI from "openai";
import {getCurrentUser} from "./firebaseDatabase";

// Function to match two individuals based on provided information
export async function matchAI(userSuggestions) {
    try {
        // Initialize the OpenAI API client with your API key and correct URL
        const openai = new OpenAI({ apiKey: 'openAI key' });
>>>>>>> 9ee796d (Merge branch 'main' of origin into your-branch)
        const path = '/chat/completions';
        openai.baseURL = 'https://api.openai.com/v1';
        openai.buildURL = () => `${openai.baseURL}${path}`;

<<<<<<< HEAD
        // Construct the conversation prompt
        const firstUser = user; // Assuming user is the first user object
        const secondUserDoc = userSuggestions.docs[0].data(); // Assuming userSuggestions.docs contains documents
        const prompt = `first user: ${firstUser.firstName}, ${firstUser.age}, ${firstUser.occupation}, about me: ${firstUser.aboutMe}, desire match: ${firstUser.desireMatch}. second user: ${secondUserDoc.firstName}, ${secondUserDoc.age}, ${secondUserDoc.occupation}, about me: ${secondUserDoc.aboutMe}, desire match: ${secondUserDoc.desireMatch}`;

        // Send a request to the OpenAI API to generate completions for the conversation prompt
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'Please rate these two people\'s dating match on a scale from 1 to 10.'},
                { role: 'user', content: prompt },
                { role: "assistant", content: "those tow people match rate is 7.5"},
            ],
            model: "gpt-3.5-turbo",
        });

        if (!completion) {
            throw new Error('Failed to fetch response from OpenAI API');
        }
        return completion.choices[0].message.content

    } catch (error) {
        // Handle any errors that occur during the API request
        console.error("WARNING: An error occurred while processing the matchAI request:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}
=======
        // Get the current user
        const firstUser = await getCurrentUser();

        // Prepare a list of promises for parallel execution
        const matchPromises = userSuggestions.map(async (secondUserDoc) => {

            // Construct the conversation prompt
            const prompt = `
                first user: ${firstUser.firstName}, ${firstUser.age}, ${firstUser.occupation}, about me: ${firstUser.aboutMe}, desire match: ${firstUser.desireMatch}.
                second user: ${secondUserDoc.firstName}, ${secondUserDoc.age}, ${secondUserDoc.occupation}
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
                    aiMassage: messageContent,
                    userId: secondUserDoc.id,
                    firstName: secondUserDoc.firstName,
                    images:secondUserDoc.images,
                    age:secondUserDoc.age,
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
        console.error('Error in matchAI function:', error);
        return []; // Return an empty array to indicate failure gracefully
    }
}
>>>>>>> 9ee796d (Merge branch 'main' of origin into your-branch)
