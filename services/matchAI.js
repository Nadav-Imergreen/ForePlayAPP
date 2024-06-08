import OpenAI from "openai";
import {getCurrentUser, getUser, getUserMessages, saveAiProfile} from "./firebaseDatabase";
import {auth} from "./config";


export const buildOpenaiURL = (path) => {
    // Initialize the OpenAI API client with your API key and correct URL
    const openai = new OpenAI({apiKey: 'API_KEY'});
    openai.baseURL = 'https://api.openai.com/v1';
    openai.buildURL = () => `${openai.baseURL}${path}`;
    return openai;
}

// Function to match two individuals based on provided information
export async function matchAI(userSuggestions) {
    // Initialize the OpenAI API client with your API key and correct URL
    const openai = buildOpenaiURL('/chat/completions');

    try {
        // Get the current user
        const currentUser = await getCurrentUser();
        const profileBuilt1 = currentUser.aiProfile ? currentUser.aiProfile : await buildProfileFromMessages(currentUser, openai);

        // Prepare a list of promises for parallel execution
        const matchPromises = userSuggestions.map(async (secondUserDoc) => {
            const profileBuilt2 = secondUserDoc.aiProfile ? secondUserDoc.aiProfile : await buildProfileFromMessages(secondUserDoc, openai);
            const {matchRate, messageContent} = await get_matching_rate(profileBuilt1, profileBuilt2, openai);
            console.log( `res - matchRate between ${currentUser.firstName} & ${secondUserDoc.firstName} is: ${matchRate}`);
            return {
                usersNames: `${currentUser.firstName} & ${secondUserDoc.firstName}`,
                matchRate: matchRate,
                messageContent: messageContent,
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

const get_matching_rate = async (profile1, profile2) => {
    try {
        const openai = buildOpenaiURL('/chat/completions');
        // Send a request to the OpenAI API to generate completions for the conversation prompt
        const completion = await openai.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "Answer in a consistent style"},
                {
                    role: "system",
                    content: "You are a helpful assistant that knows how to compare dating profiles and calculate a matching rate. When asked to rate two profiles' match, you will reply with one paragraph about the couple's compatibility, including a percentage rating from 1% to 100%."
                },
                {
                    role: "user",
                    content: "Based on the profiles I will give you - user1 and user2, calculate a matching rate between 1% and 100% and explain why in a short but informative message."
                },
                {role: "user", content: `user 1: ${JSON.stringify(profile1)}`},
                {role: "user", content: `user 2: ${JSON.stringify(profile2)}`},
                {
                    role: "assistant",
                    content: "Nataly loves painting and spending time in nature, often meeting up with large groups of friends. This suggests she is a creative and outgoing person who enjoys outdoor activities. In contrast, Josef prefers indoor activities, such as reading books and watching TV, indicating he is a quiet and introspective individual. Both Nataly and Josef are looking for a long-term relationship, although they have an age gap. Despite their different lifestyles, they both share a love for enamels. Based on their interests and personalities, I rate their compatibility at 67%."
                }
            ]
        });

        if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
            console.error('Invalid response from OpenAI API');
            return null;
        }

        const messageContent = completion.choices[0].message.content;

        // Attempt to extract the match rate from the completion response
        const matchRateMatch = messageContent.match(/\d+(\.\d+)?%/);
        const matchRate = matchRateMatch ? parseFloat(matchRateMatch[0]) : 0;

        return {matchRate, messageContent};

    } catch (error) {
        console.error('Error in get_matching_rate function:', error);
        return null; // Return null to indicate failure gracefully
    }
};

const buildProfileFromMessages = async (profile) => {
    try {
        const openai = buildOpenaiURL('/chat/completions');
        const basicProfile = `${profile.firstName}, ${profile.age}. A paragraph about myself: ${profile.aboutMe}. What I'm looking for: ${profile.desireMatch}`;
        const userMessages = await getUserMessages(profile.userId);
        console.log("CHECK:in buildProfileFromMessages -  userMessages", userMessages);
        // Send a request to the OpenAI API to generate completions for the conversation prompt
        const completion = await openai.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that can build a person's profile and analyze their nature using data from their text messages in a dating app conversation and their basic profile that they wrote themselves."
                },
                {
                    role: "user",
                    content: "Based on this data, build a user profile that describes this person's nature and can help you later determine if another user profile is a good dating match for this person."
                },
                {role: "user", content: `Person's basic profile: ${JSON.stringify(basicProfile)}`},
                {role: "user", content: `Person's text messages: ${JSON.stringify(userMessages)}`}
            ]
        });

        if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
            console.error('Invalid response from OpenAI API');
            return null;
        }
        const messageContent = completion.choices[0].message.content;
        console.log('res - buildProfileFromMessages: ', messageContent);
        await saveAiProfile(profile.userId, messageContent);
        return messageContent;

    } catch (error) {
        console.error('Error in buildProfileFromMessages function:', error);
        return null; // Return null to indicate failure gracefully
    }
}

export const aiMessageGenerator = async (usersId1, usersId2, messages) => {

    const firstUser = auth.currentUser.uid;
    const secondUser = usersId1 === firstUser ?  usersId2 : usersId1;

    console.log("usersId1, usersId2, messages", firstUser, secondUser, messages);

    const openai = buildOpenaiURL('/chat/completions');

    const user1 = await getUser(firstUser);
    const user2 = await getUser(secondUser);

    try {
        const profile1 = user1.aiProfile ? user1.aiProfile : await buildProfileFromMessages(user1, openai);
        const profile2 = user2.aiProfile ? user2.aiProfile : await buildProfileFromMessages(user2, openai);

        // Send a request to the OpenAI API to generate completions for the conversation prompt
        const completion = await openai.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "Answer should be a user message to send to is conversation partner base on chat history content and user profiles. the massage should be formated as a message begins or continue the conversation depend on conversation history"},
                {role: "system", content: "You are a cheerful assistant specializing in helping users on dating apps craft engaging messages. Your suggestions range from witty banter to charming compliments and playful flirtation, tailored to the context of the conversation. When you asked to generate a message, you will reply with a message connecting to the conversation and to the users profile and maximum 3 sentences long"},

                {role:"assistant",content:"Hi Sara"},{role:"user",content:"Hi Jon, hoe are you?"},{role:"assistant",content:"Excellent! I'm just brewing myself a new cup of coffee after promising myself one if I finished a project I was working on this morning. How about you?"},{role:"user",content:"Shh, can't indulge in the meantime?"},{role:"user",content:"I'm fine, just wandered around a bit. The sun was nice."},{role: "assistant",content:"Indulging in the meantime is already a smooth ride. You seem like a summer girl haha, nice how you make use of the rare sunny moments."},{role:"assistant",content:"What's your favorite winter pastime?"},{role:"assistant",content:"Yeah, definitely prefer summer haha. And you?"},{role:"user",content:"Going out with an umbrella in the rain and smelling the rain"},{role:"assistant",content:"Nothing like the smell of rain haha why isn't there a perfume like that. Did you know it's actually the smell of bacteria and microbes spreading with the rain? Haha Anyway, I prefer being under the umbrella in the rain and smelling it."},{role:"user",content:"Hahaha why ignore this information  Hahaha we're in January with a lot of sunshine."},{role:"assistant",content:"Remember when we had a water crisis in the country? Today everything's fine from this perspective but I miss those being our troubles 😂"},{role:"assistant",content:"How did your week start?"},{role:"user",content:"Hahaha right I had a sign in the showers in the kibbutz 'there's a water shortage in the country, use wisely every drop '"},{role:"user",content:"Ended it, started it again."},{"role":"user","content":"It was a fun weekend, how about you?"},{role:"assistant",content:"Mine was fun too."},{role:"assistant",content:"And here's another week starting. The wheel of life."},{role:"assistant",content:"Let's hope good things happen in it."},{role:"user",content:"Hahaha like what for example?"},{role:"assistant",content:"Don't know, maybe sitting in a coffee shop with a cute guy and falling in love at first sight haha."},{role:"user",content:"Hahaha maybe."},{role:"assistant",content:"And what needs to happen for that to happen? You can start by telling me when you're free this week."},{role:"user",content:"Good start haha I'm free on Wednesday."},{role:"assistant",content:"Wednesday sounds great. I know a great place we can sit in. I promise you'll have a cool conversation, lots of humor, and some flirting."},{role:"user",content:"Sounds fun. Where did you have in mind?"},{role:"assistant",content:"A cocktail bar in Florentin. They have great cocktails and a hot atmosphere."},{role:"assistant",content:"Want to exchange phone numbers to coordinate the details on WhatsApp?"},{role:"user",content:"Sure, my number is 058-4834215"},

                { role: "assistant", content: "Hey Lily :)" },
                { role: "user", content: "Hey Max, how are you?" },
                { role: "assistant", content: "I'm good! Just finished reading a great book. Do you like reading?" },
                { role: "user", content: "Yes, I love it! What book did you read?" },
                { role: "assistant", content: "It's called 'The Night Circus'. It's a magical story, really captivating. What about you? What's the last book you read?" },
                { role: "user", content: "I just finished 'The Alchemist'. Such an inspiring story. Have you read it?" },
                { role: "assistant", content: "Yes, it's one of my favorites! It has such a powerful message about following your dreams. Do you have a favorite genre?" },
                { role: "user", content: "I love fantasy and historical fiction. What about you?" },
                { role: "assistant", content: "Fantasy for sure. There's something about escaping into a different world that's just amazing. Do you have a favorite author?" },
                { role: "user", content: "Probably J.K. Rowling. The Harry Potter series will always have a special place in my heart. What about you?" },
                { role: "assistant", content: "I'm a huge Tolkien fan. The Lord of the Rings is a classic. Have you ever been to any book fairs or literary festivals?" },
                { role: "user", content: "Yes, I went to one in London last year. It was incredible! Have you been to any?" },
                { role: "assistant", content: "Not yet, but it's definitely on my list. Maybe we can check one out together sometime. What do you think?" },
                { role: "user", content: "That sounds like a lot of fun! I'd love to." },
                { role: "assistant", content: "Great! In the meantime, how about we grab a coffee and chat more about our favorite books?" },
                { role: "user", content: "I'd like that. When are you free?" },
                { role: "assistant", content: "How about this Saturday afternoon?" },
                { role: "user", content: "Saturday works for me!" },
                { role: "assistant", content: "Perfect! Let's exchange numbers to coordinate. Mine is 058-1234567." },
                { role: "user", content: "Sure, mine is 058-7654321. Looking forward to it!" },
                { role: "assistant", content: "Me too, Lily. See you on Saturday!" },

                { role: "assistant", content: "Hey Emma :)" },
                { role: "user", content: "Hey Alex, how's it going?" },
                { role: "assistant", content: "I'm doing well, just finished cooking a new recipe. Do you enjoy cooking?" },
                { role: "user", content: "Yes, I love cooking! What did you make?" },
                { role: "assistant", content: "I tried my hand at homemade pasta. It turned out pretty good! What's your favorite dish to cook?" },
                { role: "user", content: "Wow, that sounds delicious! I love making stir-fry. It's quick and you can be creative with it. Do you cook often?" },
                { role: "assistant", content: "I try to cook at least a few times a week. It's a nice way to unwind. Do you have a go-to recipe for when you want to impress someone?" },
                { role: "user", content: "Definitely! My go-to is a classic chicken parmesan. It never fails to impress. How about you?" },
                { role: "assistant", content: "Homemade pizza is my secret weapon. Everyone loves it. Do you enjoy baking as well?" },
                { role: "user", content: "Yes, I love baking! I make a mean chocolate cake. What's your favorite thing to bake?" },
                { role: "assistant", content: "Cookies, for sure. There's nothing like the smell of fresh cookies. Do you have any baking tips?" },
                { role: "user", content: "Always use room temperature ingredients. It makes a big difference. Have you ever taken a cooking or baking class?" },
                { role: "assistant", content: "Not yet, but I'd love to. It sounds like a lot of fun. Maybe we could take a class together sometime?" },
                { role: "user", content: "That would be awesome! I'd love to do that." },
                { role: "assistant", content: "In the meantime, how about we grab dinner and share some of our favorite recipes?" },
                { role: "user", content: "I'd really like that. When are you free?" },
                { role: "assistant", content: "How about Friday evening?" },
                { role: "user", content: "Friday works for me!" },
                { role: "assistant", content: "Great! Let's exchange numbers to finalize the details. Mine is 058-1234567." },
                { role: "user", content: "Sure, mine is 058-7654321. Looking forward to it!" },
                { role: "assistant", content: "Me too, Emma. See you on Friday!" },


                {role: "user", content: `Based on the profiles and conversation context I will give you - generate 1 message for firstUser to write to second user that will continue the conversation in the most fluent (could be sarcastic or flirting or getting information) way and leave a room for the conversation to continue.`},
                {role: "user", content: `firstUser: ${JSON.stringify(profile1)}`},
                {role: "user", content: `secondUser: ${JSON.stringify(profile2)}`},
                {role: "user", content: `conversation history: ${JSON.stringify(messages)}`},
            ]
        });

        if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
            console.error('Invalid response from OpenAI API');
            return null;
        }

        const messageContent = completion.choices[0].message.content;
        console.log('res - aiMessageGenerator: ', messageContent);
        return {messageContent};

    } catch (error) {
        console.error('Error in get_matching_rate function:', error);
        return null; // Return null to indicate failure gracefully
    }
}
