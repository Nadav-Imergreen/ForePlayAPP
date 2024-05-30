import OpenAI from "openai";
import { getCurrentUser, getUserMessages } from "./firebaseDatabase";
import { auth } from "./config";

// Function to match two individuals based on provided information
export async function matchAI(userSuggestions) {
    // Initialize the OpenAI API client with your API key and correct URL
    const openai = new OpenAI({ apiKey: 'api_key' });
    const path = '/chat/completions';
    openai.baseURL = 'https://api.openai.com/v1';
    openai.buildURL = () => `${openai.baseURL}${path}`;

    try {
        // Get the current user
        const currentUser = await getCurrentUser();

        const profileBuilt1 = await buildProfileFromMessages(currentUser, openai);

        // Prepare a list of promises for parallel execution
        const matchPromises = userSuggestions.map(async (secondUserDoc) => {
            const profileBuilt2 = await buildProfileFromMessages(secondUserDoc, openai);
            const { matchRate, messageContent } = await get_matching_rate(profileBuilt1, profileBuilt2, openai);
            return {
                usersNames: `${currentUser.name} & ${secondUserDoc.name}`,
                matchRate: matchRate,
                aiMessage: messageContent,
                userId: secondUserDoc.id,
                firstName: secondUserDoc.firstName,
                images: secondUserDoc.images,
                age: secondUserDoc.age,
            };
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

const get_matching_rate = async (profile1, profile2, openai) => {
    try {
        // Send a request to the OpenAI API to generate completions for the conversation prompt
        const completion = await openai.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Answer in a consistent style" },
                { role: "system", content: "You are a helpful assistant that knows how to compare dating profiles and calculate a matching rate. When asked to rate two profiles' match, you will reply with one paragraph about the couple's compatibility, including a percentage rating from 1% to 100%." },
                { role: "user", content: "Based on the profiles I will give you - user1 and user2, calculate a matching rate between 1% and 100% and explain why in a short but informative message. To help you with more data on user profiling, I built a profile for every user based on their chat messages in my dating app. I will give this profile as 'profile built from user messages'" },
                { role: "user", content: `user 1: ${JSON.stringify(profile1)}` },
                { role: "user", content: `user 2: ${JSON.stringify(profile2)}` },
                { role: "assistant", content: "Nataly loves painting and spending time in nature, often meeting up with large groups of friends. This suggests she is a creative and outgoing person who enjoys outdoor activities. In contrast, Nadav prefers indoor activities, such as reading books and watching TV, indicating he is a quiet and introspective individual. Both Nataly and Nadav are looking for a long-term relationship, although they have an age gap. Despite their different lifestyles, they both share a love for enamels. Based on their interests and personalities, I rate their compatibility at 67%." }
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
        return { matchRate: matchRate, aiMessage: messageContent };

    } catch (error) {
        console.error('Error in get_matching_rate function:', error);
        return null; // Return null to indicate failure gracefully
    }
};

const buildProfileFromMessages = async (profile, openai) => {
    try {
        const basicProfile = `${profile.firstName}, ${profile.age}. A paragraph about myself: ${profile.aboutMe}. What I'm looking for: ${profile.desireMatch}`;
        const userMessages = await getUserMessages(profile.userId);

        // Send a request to the OpenAI API to generate completions for the conversation prompt
        const completion = await openai.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant that can build a person's profile and analyze their nature using data from their text messages in a dating app conversation and their basic profile that they wrote themselves." },
                { role: "user", content: "Based on this data, build a user profile that describes this person's nature and can help you later determine if another user profile is a good dating match for this person." },
                { role: "user", content: `Person's basic profile: ${JSON.stringify(basicProfile)}` },
                { role: "user", content: `Person's text messages: ${JSON.stringify(userMessages)}` }
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
        console.error('Error in buildProfileFromMessages function:', error);
        return null; // Return null to indicate failure gracefully
    }
}
