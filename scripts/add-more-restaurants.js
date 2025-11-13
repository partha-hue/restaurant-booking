// Script to bulk insert more realistic restaurant data into your API
// Run with: node scripts/add-more-restaurants.js

const fetch = require('node-fetch');

const restaurants = [
      {
            name: "The Bombay Canteen",
            location: "Mumbai, India",
            rating: 4.8,
            details: "Modern Indian eatery with creative cocktails and a vibrant atmosphere.",
            image: "/layer1.jpg"
      },
      {
            name: "Bukhara",
            location: "New Delhi, India",
            rating: 4.7,
            details: "Legendary North Indian restaurant famous for its dal and kebabs.",
            image: "/layer2.jpg"
      },
      {
            name: "Karavalli",
            location: "Bangalore, India",
            rating: 4.6,
            details: "Award-winning South Indian coastal cuisine in a heritage setting.",
            image: "/layer3.jpg"
      },
      {
            name: "Oh! Calcutta",
            location: "Kolkata, India",
            rating: 4.5,
            details: "Classic Bengali dishes and seafood specialties in an elegant space.",
            image: "/layer1.jpg"
      },
      {
            name: "Barbeque Nation",
            location: "Chennai, India",
            rating: 4.4,
            details: "Popular buffet chain with live grills and a wide variety of dishes.",
            image: "/layer2.jpg"
      },
      {
            name: "Paradise Biryani",
            location: "Hyderabad, India",
            rating: 4.3,
            details: "Iconic spot for authentic Hyderabadi biryani and kebabs.",
            image: "/layer3.jpg"
      }
];

async function addRestaurants() {
      for (const r of restaurants) {
            try {
                  const res = await fetch('http://localhost:3001/api/restaurants', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(r)
                  });
                  const text = await res.text();
                  let data;
                  try {
                        data = JSON.parse(text);
                  } catch {
                        data = text;
                  }
                  if (!res.ok) {
                        console.error(`Failed to add: ${r.name} | Status: ${res.status} | Response:`, data);
                  } else {
                        console.log('Added:', r.name, data);
                  }
            } catch (err) {
                  console.error(`Error adding: ${r.name}`, err);
            }
      }
}

addRestaurants();
