// Run this script with: node scripts/seed-restaurants.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const restaurants = [
      {
            name: "Spice Villa",
            location: "Mumbai, India",
            rating: 4.7,
            details: "Authentic Indian cuisine with a modern twist.",
            image: "/layer1.jpg",
      },
      {
            name: "Sushi World",
            location: "Delhi, India",
            rating: 4.5,
            details: "Fresh sushi and Japanese delicacies.",
            image: "/layer2.jpg",
      },
      {
            name: "Pasta Palace",
            location: "Bangalore, India",
            rating: 4.8,
            details: "Italian classics and gourmet pizzas.",
            image: "/layer3.jpg",
      },
];

async function seed() {
      try {
            await client.connect();
            const db = client.db();
            await db.collection('restaurants').insertMany(restaurants);
            console.log('Seeded restaurants!');
      } finally {
            await client.close();
      }
}

seed();
