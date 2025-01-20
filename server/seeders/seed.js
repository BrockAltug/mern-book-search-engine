const db = require('../config/connection');
const { User } = require('../models');
const userSeeds = require('./userSeeds.json');
const bookSeeds = require('./bookSeeds.json');

db.once('open', async () => {
  try {
    console.log('Starting database cleanup...');
    // Clean the User collection
    await User.deleteMany({});
    console.log('User collection cleared.');

    // Seed users
    console.log('Seeding users...');
    const users = await User.create(userSeeds);
    console.log('Users seeded successfully.');

    // Seed books for users
    console.log('Seeding books...');
    for (const bookSeed of bookSeeds) {
      const { username, books } = bookSeed;

      const user = await User.findOne({ username });
      if (!user) {
        throw new Error(`User "${username}" not found. Check your bookSeeds.json.`);
      }

      await User.findByIdAndUpdate(
        user._id,
        {
          $addToSet: { savedBooks: books },
        },
        { new: true, runValidators: true }
      );
    }
    console.log('Books seeded successfully.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }

  console.log('All done!');
  process.exit(0);
});