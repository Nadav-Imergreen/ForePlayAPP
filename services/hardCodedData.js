//
// export const userProfiles = [
//     {
//         firstName: "Sarah",
//         lastName: "Johnson",
//         age: "27",
//         sex: "Female",
//         hometown: "San Francisco",
//         occupation: "Software Engineer",
//         desireMatch: "Someone adventurous and creative",
//         aboutMe: "Hey there! I'm Sarah, a 27-year-old software engineer working in Silicon Valley. When I'm not coding, you can find me exploring the great outdoors – hiking, camping, or simply soaking up the sun at the beach. I'm a foodie at heart and love trying out new restaurants, especially ones that serve exotic cuisines. In my free time, I enjoy playing guitar, painting, and practicing yoga to keep my mind and body balanced. Looking to meet someone who shares my passion for adventure and creativity.",
//         email: "sarah.johnson@gmail.com",
//         password: "sarah123",
//         partner_gender: "Male",
//         preferredAgeRange: [25, 35],
//         radius: 50,
//         location: { latitude: 37.7749, longitude: -122.4194 } // Example coordinates in San Francisco
//     },
//     {
//         firstName: "Alex",
//         lastName: "Smith",
//         age: "30",
//         sex: "Male",
//         hometown: "New York City",
//         occupation: "Entrepreneur",
//         desireMatch: "Someone ambitious and intellectually curious",
//         aboutMe: "Hi, I'm Alex, a 30-year-old entrepreneur and avid traveler. I run my own tech startup and have a passion for innovation and problem-solving. Outside of work, I enjoy immersing myself in different cultures by traveling to remote destinations and experiencing local cuisines. I'm a fitness enthusiast and love staying active through activities like running, rock climbing, and yoga. In my downtime, you'll find me reading sci-fi novels or watching documentaries. Excited to meet someone who shares my love for adventure and intellectual conversations.",
//         email: "alex.smith@gmail.com",
//         password: "alex123",
//         partner_gender: "Female",
//         preferredAgeRange: [28, 35],
//         radius: 40,
//         location: { latitude: 40.7128, longitude: -74.0060 } // Example coordinates in New York City
//     },
//     {
//         firstName: "Max",
//         lastName: "Williams",
//         age: "25",
//         sex: "Male",
//         hometown: "Los Angeles",
//         occupation: "Aspiring Chef",
//         desireMatch: "Someone who shares a love for food and culinary adventures",
//         aboutMe: "Hey, I'm Max, a 25-year-old aspiring chef and food enthusiast. I'm currently honing my culinary skills at a prestigious culinary school while working part-time at a local restaurant. Cooking is my passion, and there's nothing I love more than experimenting with new recipes and flavors in the kitchen. When I'm not cooking up a storm, you'll find me exploring farmers' markets, attending food festivals, or hosting dinner parties for friends and family. I believe that good food brings people together and creates lasting memories.",
//         email: "max.williams@gmail.com",
//         password: "max123",
//         partner_gender: "Female",
//         preferredAgeRange: [22, 30],
//         radius: 45,
//         location: { latitude: 34.0522, longitude: -118.2437 } // Example coordinates in Los Angeles
//     },
//     {
//         firstName: "Olivia",
//         lastName: "Brown",
//         age: "29",
//         sex: "Female",
//         hometown: "Chicago",
//         occupation: "Marketing Manager",
//         desireMatch: "Someone with a good sense of humor and a love for live music",
//         aboutMe: "Hey, I'm Olivia, a 29-year-old marketing manager with a passion for creativity and storytelling. I thrive in fast-paced environments and love coming up with innovative marketing campaigns that captivate audiences. When I'm not working, you'll find me exploring the city's vibrant music scene, attending concerts, or checking out local art exhibitions. I'm a social butterfly and enjoy spending time with friends over cocktails or hosting game nights. Looking for someone who shares my zest for life and can make me laugh till my cheeks hurt!",
//         email: "olivia.brown@gmail.com",
//         password: "olivia123",
//         partner_gender: "Male",
//         preferredAgeRange: [27, 35],
//         radius: 60,
//         location: { latitude: 41.8781, longitude: -87.6298 } // Example coordinates in Chicago
//     },
//     {
//         firstName: "Ethan",
//         lastName: "Garcia",
//         age: "32",
//         sex: "Male",
//         hometown: "Miami",
//         occupation: "Travel Blogger",
//         desireMatch: "Someone spontaneous and adventurous",
//         aboutMe: "Hi there, I'm Ethan, a 32-year-old travel blogger with a passion for exploring the world and sharing my adventures through storytelling and photography. My job allows me to travel to exotic destinations, immerse myself in different cultures, and discover hidden gems off the beaten path. When I'm not jet-setting, you'll find me surfing at sunrise, hiking through lush rainforests, or sipping cocktails by the beach. I'm a free spirit who thrives on spontaneity and loves meeting new people from all walks of life. Seeking a travel buddy who's up for spontaneous road trips, epic hikes, and unforgettable experiences!",
//         email: "ethan.garcia@gmail.com",
//         password: "ethan123",
//         partner_gender: "Female",
//         preferredAgeRange: [25, 35],
//         radius: 70,
//         location: { latitude: 25.7617, longitude: -80.1918 } // Example coordinates in Miami
//     },
//     {
//         firstName: "Ava",
//         lastName: "Martinez",
//         age: "26",
//         sex: "Female",
//         hometown: "Seattle",
//         occupation: "Software Developer",
//         desireMatch: "Someone who enjoys deep conversations and outdoor adventures",
//         aboutMe: "Hey, I'm Ava, a 26-year-old software developer with a passion for coding, hiking, and exploring the great outdoors. By day, I'm immersed in lines of code, building innovative solutions to real-world problems. But when I'm not glued to my computer screen, you'll find me hitting the trails, chasing waterfalls, or camping under the stars. I'm a curious soul who loves delving into deep conversations about life, philosophy, and the universe. Seeking a like-minded soul who's not afraid to ponder life's big questions and embark on spontaneous adventures.",
//         email: "ava.martinez@gmail.com",
//         password: "ava123",
//         partner_gender: "Male",
//         preferredAgeRange: [25, 30],
//         radius: 50,
//         location: { latitude: 47.6062, longitude: -122.3321 } // Example coordinates in Seattle
//     },
//     {
//         firstName: "Noah",
//         lastName: "Rodriguez",
//         age: "28",
//         sex: "Male",
//         hometown: "Austin",
//         occupation: "Musician",
//         desireMatch: "Someone who appreciates music and loves to dance",
//         aboutMe: "What's up, I'm Noah, a 28-year-old musician and music enthusiast based in Austin, the live music capital of the world. I live and breathe music – whether I'm strumming my guitar, jamming with my bandmates, or dancing the night away at local music venues. I'm a laid-back guy with a passion for creativity and self-expression. When I'm not making music, I enjoy exploring the city's vibrant food scene, practicing yoga, or indulging in late-night taco runs. Seeking a music lover who's down to catch live shows, groove to funky beats, and share unforgettable musical experiences.",
//         email: "noah.rodriguez@gmail.com",
//         password: "noah123",
//         partner_gender: "Female",
//         preferredAgeRange: [25, 32],
//         radius: 55,
//         location: { latitude: 30.2672, longitude: -97.7431 } // Example coordinates in Austin
//     },
//     {
//         firstName: "Mia",
//         lastName: "Lopez",
//         age: "31",
//         sex: "Female",
//         hometown: "San Diego",
//         occupation: "Art Therapist",
//         desireMatch: "Someone compassionate and emotionally intelligent",
//         aboutMe: "Hola, I'm Mia, a 31-year-old art therapist with a passion for healing and self-expression through art. I believe in the transformative power of creativity and use art as a medium to help others explore their emotions, overcome challenges, and discover their inner strengths. When I'm not in my studio, you'll find me soaking up the sun at the beach, practicing yoga, or volunteering at local animal shelters. I'm a compassionate soul who values empathy, kindness, and authentic connections. Seeking a soulful companion who shares my love for art, animals, and meaningful conversations.",
//         email: "mia.lopez@gmail.com",
//         password: "mia123",
//         partner_gender: "Male",
//         preferredAgeRange: [28, 35],
//         radius: 65,
//         location: { latitude: 32.7157, longitude: -117.1611 } // Example coordinates in San Diego
//     },
//
// ];
//
//
// export const hardCodedConversations = [
//     {
//         createdAt: new Date("June 7, 2024 14:56:48 UTC+3"),
//         members: ["WwbrC6veITf94wGwCIWCGuPlrxu2", "AvWCGsZ13mcDlUgkEu8UoNNumJF3"],
//     },
//     {
//         createdAt: new Date("June 7, 2024 15:00:00 UTC+3"),
//         members: ["0RzTJbo1BQWtr6iGbdxE0dJxonb2", "1KyIeb7yhaSweA0m4W9ezR57K2D2"],
//     },
//     {
//         createdAt: new Date("June 7, 2024 15:05:10 UTC+3"),
//         members: ["3UYsDqSt4TSTTajBbwRMd3siy242", "40r5rbpKmTS03LxS28Ms4fSNiuS2"],
//     },
//     {
//         createdAt: new Date("June 7, 2024 15:10:15 UTC+3"),
//         members: ["57epyqe9VKNnOXZisdoCdVtmOXj2", "ASbQ3mUBnggisLRxM1tBH4E2rwK2"],
//     },
//     {
//         createdAt: new Date("June 7, 2024 15:15:20 UTC+3"),
//         members: ["ChacoZRw3sePcCkG8YFM9K87ytx2", "G99FX6CsINT8hN59Q44uRsAEcck1"],
//     },
//     {
//         createdAt: new Date("June 7, 2024 15:20:25 UTC+3"),
//         members: ["PV2vyMbnZLbd7hzEWau4ZNm0hrF3", "TCOfgzXW71fUeWEIZGrAU0BtIZy2"],
//     },
//     {
//         createdAt: new Date("June 7, 2024 15:25:30 UTC+3"),
//         members: ["YCqqWgvjRrWlwvwBnuqDAHMeXiC3", "jf9L83uIJBMfzITEn4ZPosURAad2"],
//     },
//     {
//         createdAt: new Date("June 7, 2024 15:35:40 UTC+3"),
//         members: ["qQVCNRm1YdXnQO3NqrtPHVVPhAs1", "svm75Mmn4ieEuluiX9zzXrUfAyh2"],
//     },
//     {
//         createdAt: new Date("June 7, 2024 15:40:45 UTC+3"),
//         members: ["uFOnqMU5jlVYkXGCSezMfUXZFn82", "unDuqKYrL7T4azxVO3Y3wYOn2My2"],
//     }
// ];
//
// export const hardCodedMessages = [
//     {
//         conversationId: "25Ash5KNAjOFTMXFpn9a",
//         createdAt: new Date(),
//         id: "a1b2c3d4e5f6g7h8i9j0",
//         text: "Hey! How's your day going?",
//         user: {
//             _id: "WwbrC6veITf94wGwCIWCGuPlrxu2",
//             avatar: "https://randomuser.me/api/portraits/men/5.jpg",
//             name: "max.williams@gmail.com"
//         }
//     },
//     {
//         conversationId: "25Ash5KNAjOFTMXFpn9a",
//         createdAt:  new Date(),
//         id: "b2c3d4e5f6g7h8i9j0a1",
//         text: "I'm doing great, thanks for asking!",
//         user: {
//             _id: "ASbQ3mUBnggisLRxM1tBH4E2rwK2",
//             avatar: "https://randomuser.me/api/portraits/women/7.jpg",
//             name: "sara.johnson@gmail.com"
//         }
//     },
//     {
//         conversationId: "9zSAsrIPeqe2L4nEqeWm",
//         createdAt: new Date(),
//         id: "d4e5f6g7h8i9j0a1b2c3",
//         text: "Hi! How was your weekend?",
//         user: {
//             _id: "uFOnqMU5jlVYkXGCSezMfUXZFn82",
//             avatar: "https://randomuser.me/api/portraits/men/8.jpg",
//             name: "john.doe@gmail.com"
//         }
//     },
//     {
//         conversationId: "9zSAsrIPeqe2L4nEqeWm",
//         createdAt: new Date(),
//         id: "e5f6g7h8i9j0a1b2c3d4",
//         text: "It was pretty relaxing, how about yours?",
//         user: {
//             _id: "oRcoWULl4bPROqhxs6nwewLNqE63",
//             avatar: "https://randomuser.me/api/portraits/women/9.jpg",
//             name: "emma.stone@gmail.com"
//         }
//     },
//     {
//         conversationId: "9zSAsrIPeqe2L4nEqeWm",
//         createdAt: new Date(),
//         id: "f6g7h8i9j0a1b2c3d4e5",
//         text: "Mine was great! Spent time with family.",
//         user: {
//             _id: "uFOnqMU5jlVYkXGCSezMfUXZFn82",
//             avatar: "https://randomuser.me/api/portraits/men/8.jpg",
//             name: "john.doe@gmail.com"
//         }
//     },
//     {
//         conversationId: "OWVQfPW95orGei30VZlt",
//         createdAt: new Date(),
//         id: "j0a1b2c3d4e5f6g7h8i9",
//         text: "Hello! Long time no chat!",
//         user: {
//             _id: "oB0zVHTGMggR8WKnfQpdbH1rqoj2",
//             avatar: "https://randomuser.me/api/portraits/men/12.jpg",
//             name: "dwight.schrute@gmail.com"
//         }
//     },
//     {
//         conversationId: "OWVQfPW95orGei30VZlt",
//         createdAt: new Date(),
//         id: "k1b2c3d4e5f6g7h8i9j0",
//         text: "Hey! Yes, it has been a while. How have you been?",
//         user: {
//             _id: "uFOnqMU5jlVYkXGCSezMfUXZFn82",
//             avatar: "https://randomuser.me/api/portraits/women/12.jpg",
//             name: "angela.martin@gmail.com"
//         }
//     },
//     {
//         conversationId: "OWVQfPW95orGei30VZlt",
//         createdAt: new Date(),
//         id: "l2c3d4e5f6g7h8i9j0k1",
//         text: "I've been good, just busy with work. How about you?",
//         user: {
//             _id: "oB0zVHTGMggR8WKnfQpdbH1rqoj2",
//             avatar: "https://randomuser.me/api/portraits/men/12.jpg",
//             name: "dwight.schrute@gmail.com"
//         }
//     },
// ]

export const userProfiles = [
    {
        firstName: "Sarah",
        lastName: "Johnson",
        age: "27",
        sex: "Female",
        hometown: "San Francisco",
        occupation: "Software Engineer",
        desireMatch: "Someone adventurous and creative",
        aboutMe: "Hey there! I'm Sarah, a 27-year-old software engineer working in Silicon Valley. When I'm not coding, you can find me exploring the great outdoors – hiking, camping, or simply soaking up the sun at the beach. I'm a foodie at heart and love trying out new restaurants, especially ones that serve exotic cuisines. In my free time, I enjoy playing guitar, painting, and practicing yoga to keep my mind and body balanced. Looking to meet someone who shares my passion for adventure and creativity.",
        email: "sarah.johnson@gmail.com",
        password: "sarah123",
        partner_gender: "Male",
        preferredAgeRange: [25, 35],
        radius: 50,
        location: { latitude: 37.7749, longitude: -122.4194 } // Example coordinates in San Francisco
    },
    {
        firstName: "Alex",
        lastName: "Smith",
        age: "30",
        sex: "Male",
        hometown: "New York City",
        occupation: "Entrepreneur",
        desireMatch: "Someone ambitious and intellectually curious",
        aboutMe: "Hi, I'm Alex, a 30-year-old entrepreneur and avid traveler. I run my own tech startup and have a passion for innovation and problem-solving. Outside of work, I enjoy immersing myself in different cultures by traveling to remote destinations and experiencing local cuisines. I'm a fitness enthusiast and love staying active through activities like running, rock climbing, and yoga. In my downtime, you'll find me reading sci-fi novels or watching documentaries. Excited to meet someone who shares my love for adventure and intellectual conversations.",
        email: "alex.smith@gmail.com",
        password: "alex123",
        partner_gender: "Female",
        preferredAgeRange: [28, 35],
        radius: 40,
        location: { latitude: 40.7128, longitude: -74.0060 } // Example coordinates in New York City
    },
    {
        firstName: "Sophia",
        lastName: "Taylor",
        age: "28",
        sex: "Female",
        hometown: "Boston",
        occupation: "Graphic Designer",
        desireMatch: "Someone who is creative and loves art",
        aboutMe: "Hello! I'm Sophia, a 28-year-old graphic designer living in Boston. I have a passion for all things creative, from designing logos to painting murals. In my free time, I enjoy visiting art galleries, attending design workshops, and working on personal art projects. I'm also a big fan of outdoor activities like cycling and kayaking. I'm looking for someone who appreciates creativity and is open to exploring new artistic experiences together.",
        email: "sophia.taylor@gmail.com",
        password: "sophia123",
        partner_gender: "Male",
        preferredAgeRange: [27, 35],
        radius: 60,
        location: { latitude: 42.3601, longitude: -71.0589 } // Example coordinates in Boston
    },
    {
        firstName: "Liam",
        lastName: "Walker",
        age: "29",
        sex: "Male",
        hometown: "Denver",
        occupation: "Financial Analyst",
        desireMatch: "Someone who is career-oriented and enjoys the outdoors",
        aboutMe: "Hi there! I'm Liam, a 29-year-old financial analyst based in Denver. I enjoy the balance of working with numbers and spending my weekends in the mountains hiking or skiing. I'm passionate about personal finance and helping others manage their investments. When I'm not working or exploring the great outdoors, I like to unwind by cooking, reading, or catching up with friends over coffee. I'm looking for someone who is driven in their career and loves to explore nature.",
        email: "liam.walker@gmail.com",
        password: "liam123",
        partner_gender: "Female",
        preferredAgeRange: [27, 33],
        radius: 45,
        location: { latitude: 39.7392, longitude: -104.9903 } // Example coordinates in Denver
    }
];

export const hardCodedConversations = [
    {
        createdAt: new Date("June 7, 2024 14:56:48 UTC+3"),
        members: ["sarah.johnson@gmail.com", "max.williams@gmail.com"],
    },
    {
        createdAt: new Date("June 7, 2024 15:00:00 UTC+3"),
        members: ["sarah.johnson@gmail.com", "liam.walker@gmail.com"],
    },
    {
        createdAt: new Date("June 7, 2024 15:05:10 UTC+3"),
        members: ["sarah.johnson@gmail.com", "alex.smith@gmail.com"],
    },
    {
        createdAt: new Date("June 7, 2024 15:10:15 UTC+3"),
        members: ["sarah.johnson@gmail.com", "sophia.taylor@gmail.com"],
    },
    {
        createdAt: new Date("June 7, 2024 15:15:20 UTC+3"),
        members: ["sarah.johnson@gmail.com", "daniel.miller@gmail.com"],
    }
];

export const hardCodedMessages = [
    // Conversation 1: Sarah and Max
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "B9hQzPZxTPzbcRj51RqY",
        text: "Hey Max! How's your day going?",
        user: {
            _id: "sarah.johnson@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/7.jpg",
            name: "Sarah Johnson"
        }
    },
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "BIXYUd2LPYnLmhoWbM41",
        text: "Hey Sarah! It's going well, just busy with work. How about you?",
        user: {
            _id: "max.williams@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
            name: "Max Williams"
        }
    },
    // More messages between Sarah and Max...
    // Conversation 2: Sarah and Liam
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "BYxsubB2IPpU63HdW7l2",
        text: "Hey Liam! How's it going?",
        user: {
            _id: "sarah.johnson@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/7.jpg",
            name: "Sarah Johnson"
        }
    },
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "CL5z9diD9DOd2FR7ww33",
        text: "Hey Sarah! I'm doing great, thanks. Just got back from a hike. How about you?",
        user: {
            _id: "liam.walker@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/17.jpg",
            name: "Liam Walker"
        }
    },
    // More messages between Sarah and Liam...
    // Conversation 3: Sarah and Alex
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "JmQBMZnF5XPw2foMklNg",
        text: "Hi Alex! Do you have any favorite travel destinations?",
        user: {
            _id: "sarah.johnson@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/7.jpg",
            name: "Sarah Johnson"
        }
    },
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "LthKNv8t5aqNEch5E08C",
        text: "Absolutely! I love traveling to Europe, especially Italy. How about you?",
        user: {
            _id: "alex.smith@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/9.jpg",
            name: "Alex Smith"
        }
    },
    // More messages between Sarah and Alex...
    // Conversation 4: Sarah and Sophia
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "OLiRzVOnHTamRbk62cJK",
        text: "Hi Sophia! Do you have any favorite art styles?",
        user: {
            _id: "sarah.johnson@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/7.jpg",
            name: "Sarah Johnson"
        }
    },
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "Qi3gmnWMEVrtMFpE3mIW",
        text: "Hi Sarah! I absolutely love abstract art. How about you?",
        user: {
            _id: "sophia.taylor@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/15.jpg",
            name: "Sophia Taylor"
        }
    },
    // More messages between Sarah and Sophia...
    // Conversation 5: Sarah and Daniel
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "RNgEPCJEpa3fk20MrveM",
        text: "What's your favorite type of music?",
        user: {
            _id: "sarah.johnson@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/7.jpg",
            name: "Sarah Johnson"
        }
    },
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "U0UXwNPT3qOpTuYR2qVe",
        text: "I'm a huge fan of jazz. How about you?",
        user: {
            _id: "daniel.miller@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/28.jpg",
            name: "Daniel Miller"
        }
    },
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "Zim5Od4L2xXSO8RE3AAY",
        text: "Hey Emily! Do you enjoy outdoor activities?",
        user: {
            _id: "sarah.johnson@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/7.jpg",
            name: "Sarah Johnson"
        }
    },
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "bD0jOgXwPNYRS0d7kjZS",
        text: "Absolutely! I love hiking and camping. How about you?",
        user: {
            _id: "emily.wilson@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/22.jpg",
            name: "Emily Wilson"
        }
    },
    // More messages between Sarah and Emily...
    // Conversation 7: Sarah and Michael
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "ihLli4Gcy5FX2UJzKGrk",
        text: "Hey Michael! Do you enjoy trying out new restaurants?",
        user: {
            _id: "sarah.johnson@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/7.jpg",
            name: "Sarah Johnson"
        }
    },
    {
        conversationId: "2sQuqsdkVqiTYdMnfyri",
        createdAt: new Date(),
        id: "WjKml3GyM45LpfPZn1iD",
        text: "Definitely! I'm a foodie at heart. How about you?",
        user: {
            _id: "michael.jackson@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            name: "Michael Jackson"
        }
    },
    {
        conversationId: "OWVQfPW95orGei30VZlt",
        createdAt: new Date(),
        id: "mPnK9BGEWVMRcZ3XWb1x",
        text: "Hey Olivia! What's your favorite book genre?",
        user: {
            _id: "alex.smith@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
            name: "Alex Smith"
        }
    },
    {
        conversationId: "OWVQfPW95orGei30VZlt",
        createdAt: new Date(),
        id: "sHdVZpAeNzumwC7io5lt",
        text: "Hi Alex! I love mystery novels. How about you?",
        user: {
            _id: "olivia.brown@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/11.jpg",
            name: "Olivia Brown"
        }
    },
    // Conversation 9: Ethan and Ava
    {
        conversationId: "bD0jOgXwPNYRS0d7kjZS",
        createdAt: new Date(),
        id: "Fgh4TlMpo3ZdRkl2eRnS",
        text: "Hey Ava! Have you ever been to South America?",
        user: {
            _id: "ethan.garcia@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/18.jpg",
            name: "Ethan Garcia"
        }
    },
    {
        conversationId: "bD0jOgXwPNYRS0d7kjZS",
        createdAt: new Date(),
        id: "XcVh7JkNu5aWfGm4pQeD",
        text: "Hi Ethan! Not yet, but it's on my bucket list. How about you?",
        user: {
            _id: "ava.martinez@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/10.jpg",
            name: "Ava Martinez"
        }
    },
    // Conversation 10: Noah and Mia
    {
        conversationId: "ihLli4Gcy5FX2UJzKGrk",
        createdAt: new Date(),
        id: "Jpl3FeCk2nDvRmP7RtqL",
        text: "Hey Mia! What's your favorite movie genre?",
        user: {
            _id: "noah.rodriguez@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/20.jpg",
            name: "Noah Rodriguez"
        }
    },
    {
        conversationId: "ihLli4Gcy5FX2UJzKGrk",
        createdAt: new Date(),
        id: "ZvJmLoKpN3hGdXc4QwEo",
        text: "Hi Noah! I enjoy watching romantic comedies. How about you?",
        user: {
            _id: "mia.lopez@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/21.jpg",
            name: "Mia Lopez"
        }
    },
    {
        conversationId: "25Ash5KNAjOFTMXFpn9a",
        createdAt: new Date(),
        id: "YfSleRoPbPqgWtN3RrEo",
        text: "Hey Ava! Have you tried any new coding languages recently?",
        user: {
            _id: "max.williams@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
            name: "Max Williams"
        }
    },
    {
        conversationId: "25Ash5KNAjOFTMXFpn9a",
        createdAt: new Date(),
        id: "GhTrxZiKmNlJhFp2QaWs",
        text: "Hi Max! Yes, I've been learning Rust. It's quite fascinating. How about you?",
        user: {
            _id: "ava.martinez@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/10.jpg",
            name: "Ava Martinez"
        }
    },
    // Conversation 12: Olivia and Ethan
    {
        conversationId: "OWVQfPW95orGei30VZlt",
        createdAt: new Date(),
        id: "WsXnKoEpZrGtHqP3OjLm",
        text: "Hey Ethan! Do you enjoy cooking as much as traveling?",
        user: {
            _id: "olivia.brown@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/11.jpg",
            name: "Olivia Brown"
        }
    },
    {
        conversationId: "OWVQfPW95orGei30VZlt",
        createdAt: new Date(),
        id: "QwErTyUiOpAsDfGhJkL",
        text: "Hi Olivia! Absolutely, I find it therapeutic. Trying out new recipes is always exciting. How about you?",
        user: {
            _id: "ethan.garcia@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/18.jpg",
            name: "Ethan Garcia"
        }
    },
    // Conversation 13: Mia and Noah
    {
        conversationId: "ihLli4Gcy5FX2UJzKGrk",
        createdAt: new Date(),
        id: "MnBvCxZlPoKiUtReGhYn",
        text: "Hey Noah! Do you have any favorite musical instruments?",
        user: {
            _id: "mia.lopez@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/21.jpg",
            name: "Mia Lopez"
        }
    },
    {
        conversationId: "ihLli4Gcy5FX2UJzKGrk",
        createdAt: new Date(),
        id: "XoLpZmGhYnReSuBvCxDl",
        text: "Hi Mia! I'm quite fond of the piano. How about you?",
        user: {
            _id: "noah.rodriguez@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/20.jpg",
            name: "Noah Rodriguez"
        }
    },
    // Conversation 14: Daniel and Sarah
    {
        conversationId: "OWVQfPW95orGei30VZlt",
        createdAt: new Date(),
        id: "UcXvZbNmPlOkImJhYgTf",
        text: "Hey Sarah! What's your favorite outdoor activity?",
        user: {
            _id: "daniel.miller@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/28.jpg",
            name: "Daniel Miller"
        }
    },
    {
        conversationId: "OWVQfPW95orGei30VZlt",
        createdAt: new Date(),
        id: "LkMjNhBgTvFcXdSzErQw",
        text: "Hi Daniel! I love hiking in the mountains. How about you?",
        user: {
            _id: "sarah.johnson@gmail.com",
            avatar: "https://randomuser.me/api/portraits/women/7.jpg",
            name: "Sarah Johnson"
        }
    },
    // Conversation 15: Liam and Olivia
    {
        conversationId: "bD0jOgXwPNYRS0d7kjZS",
        createdAt: new Date(),
        id: "PbFtVgRhSmUlOkJnHbFd",
        text: "Hey Olivia! Do you prefer coffee or tea?",
        user: {
            _id: "liam.walker@gmail.com",
            avatar: "https://randomuser.me/api/portraits/men/17.jpg",
            name: "Liam Walker"
        }
    },
];