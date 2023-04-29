const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { faker } = require('@faker-js/faker');

connection.on('error', (err) => {
    console.log(`Could not seed DB due to: ${err}`);
});

connection.once('open', async () => {
    console.log('Connected to DB to seed data');

    // Dropping indexes
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Generate random Thoughts with Reactions
    const thoughts = [];
    for (let i = 0; i < 20; i++) {
        const reactions = [];
        for (let i = 0; i < 5; i++) {
            reactions.push({
                reactionBody: faker.lorem.lines(1),
                username: faker.internet.userName(),    
            });
        }

        thoughts.push({
            thoughtText: faker.lorem.lines(1),
            username: faker.internet.userName(),
            reactions: [...reactions],
        });
        
    }
    
    // Insert collection of thoughts
    await Thought.collection.insertMany(thoughts);

    console.table(thoughts);

    // Generate random Users
    const ogUsers = []
    for (let i = 0; i < 5; i++) {
        // Get random Thought ID
        const randomThough = [thoughts[i]._id];
        ogUsers.push(
            {
                username: faker.internet.userName(),
                email: faker.internet.email(),
                thought: [...randomThough],
        });
    }


    // Make first 5 users to be friends with the rest
    await User.collection.insertMany(ogUsers);

    console.table(ogUsers);


    const newUsers = [];
    for (let i = 5; i < 20; i++) {
        // Get random Thought ID
        const randomThough = [thoughts[i]._id];
        const randomFriend = [ogUsers[Math.floor(Math.random() * ogUsers.length)]._id];
        newUsers.push(
            {
                username: faker.internet.userName(),
                email: faker.internet.email(),
                thought: [...randomThough],
                friends: [...randomFriend],
        });
    }

    await User.collection.insertMany(newUsers);

    console.table(newUsers);
    console.info('Seeding complete! 🌱');
     process.exit(0);
});