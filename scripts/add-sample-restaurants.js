// Script to add sample restaurants to your MongoDB via the API
// Run this with: node scripts/add-sample-restaurants.js

const fetch = require('node-fetch');

const restaurants = [
      {
            name: "Spice Villa",
            location: "Mumbai, India",
            rating: 4.7,
            details: "Authentic Indian cuisine with a modern twist.",
            image: "/layer1.jpg"
      },
      {
            name: "Sushi World",
            location: "Delhi, India",
            rating: 4.5,
            details: "Fresh sushi and Japanese delicacies.",
            image: "/layer2.jpg"
      },
      {
            name: "Pasta Palace",
            location: "Bangalore, India",
            rating: 4.8,
            details: "Italian classics and gourmet pizzas.",
            image: "/layer3.jpg"
      },
      {
            name: "Burger Hub",
            location: "Pune, India",
            rating: 4.3,
            details: "Juicy burgers and crispy fries for all ages.",
            image: "/layer1.jpg"
      },
      {
            name: "Tandoori Nights",
            location: "Hyderabad, India",
            rating: 4.6,
            details: "Classic tandoori and North Indian specialties.",
            image: "/layer2.jpg"
      },
      {
            name: "Green Bowl",
            location: "Chennai, India",
            rating: 4.4,
            details: "Healthy salads and vegan delights.",
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
