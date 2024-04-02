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
        const path = '/chat/completions';
        openai.baseURL = 'https://api.openai.com/v1';
        openai.buildURL = () => `${openai.baseURL}${path}`;

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
