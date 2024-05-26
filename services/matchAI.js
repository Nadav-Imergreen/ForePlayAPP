import OpenAI from "openai";
import {getCurrentUser, getUserMessages} from "./firebaseDatabase";
import {auth} from "./config";

// Function to match two individuals based on provided information
export async function matchAI(userSuggestions) {
    try {
        // Get the current user
        const currentUser = await getCurrentUser();

        // Prepare a list of promises for parallel execution
        const matchPromises = userSuggestions.map(async (secondUserDoc) => {
            return await get_matching_rate(currentUser, secondUserDoc);
        });

        // Wait for all match promises to resolve
        const matchResults = await Promise.all(matchPromises);

        // Filter out null results and sort by match rate in descending order and return the sorted match results
        return matchResults.filter(result => result !== null).sort((a, b) => b.matchRate - a.matchRate);

    } catch (error) {
        console.error('Error in matchAI function:', error);
        return []; // Return an empty array to indicate failure gracefully
    }
}

const get_matching_rate = async (profile1, profile2) => {

    // Initialize the OpenAI API client with your API key and correct URL
    const openai = new OpenAI({ apiKey: 'api-key' });
    const path = '/chat/completions';
    openai.baseURL = 'https://api.openai.com/v1';
    openai.buildURL = () => `${openai.baseURL}${path}`;

    try {
        const profileBuilt1 = await buildProfileFromMessages(profile1, openai);
        const profileBuilt2 = await buildProfileFromMessages(profile2, openai);

        // Send a request to the OpenAI API to generate completions for the conversation prompt
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant that compares dating profiles and calculates a matching rate." },
                { role: "user", content: `Profile 1: ${JSON.stringify(profile1)}` },
                { role: "user", content: `Profile 1: profile built from user1 messages: ${JSON.stringify(profileBuilt1)}` },
                { role: "user", content: `Profile 2: ${JSON.stringify(profile2)}` },
                { role: "user", content: `Profile 2: profile built from user2 messages: ${JSON.stringify(profileBuilt2)}` },
                { role: "user", content: "Based on these profiles, calculate a matching rate between 0% and 100% and explain why in a short but informative message ." }
            ]
        });

        if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
            console.error('Invalid response from OpenAI API');
            return null;
        }

        const messageContent = completion.choices[0].message.content;
        console.log('res - message: ', messageContent);

        // Attempt to extract the match rate from the completion response
        const matchRateMatch = messageContent.match(/\d+(\.\d+)?%/);
        const matchRate = matchRateMatch ? parseFloat(matchRateMatch[0]) : 0;

        console.log('res - matchRate: ', matchRate);

        return {
            usersNames: `${profile1.name} & ${profile2.name}`,
            matchRate: matchRate,
            aiMessage: messageContent,
            userId: profile2.id,
            firstName: profile2.firstName,
            images: profile2.images,
            age: profile2.age,
        };
    } catch (error) {
        console.error('Error in get_matching_rate function:', error);
        return null; // Return null to indicate failure gracefully
    }
};

const buildProfileFromMessages = async (profile, openai) => {
    try {
        const userMessages = await getUserMessages(profile.userId);
        // Send a request to the OpenAI API to generate completions for the conversation prompt
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant that build a person profile using data from is text messages in a dating app conversations." },
                { role: "user", content: `person text messages:: ${JSON.stringify(userMessages)}` },
                { role: "user", content: "Based on these messages, build a profile that describe this person nature, and can help you letter fit a good match for this person."}
            ]
        });

        if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
            console.error('Invalid response from OpenAI API');
            return null;
        }
        const messageContent = completion.choices[0].message.content;
        console.log('res - buildProfileFromMessages: ', messageContent);
        return messageContent;

    } catch (error) {
        console.error('Error in get_matching_rate function:', error);
        return null; // Return null to indicate failure gracefully
    }
}
