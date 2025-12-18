// src/assets/data/famousSpots.js

const famousSpots = [
  {
    name: "Gateway of India",
    location: "Colaba, Mumbai",
    images: ["/images/gateway.jpg"],
    rating: 4.8,
    totalRatings: 3210,
    entryFee: 0,
    openingTime: "24 Hours",
    closingTime: "—",
  },
  {
    name: "Marine Drive",
    location: "South Mumbai",
    images: ["/images/marine.jpg"],
    rating: 4.7,
    totalRatings: 2780,
    entryFee: 0,
    openingTime: "24 Hours",
    closingTime: "—",
  },
  {
    name: "Siddhivinayak Temple",
    location: "Prabhadevi, Mumbai",
    images: ["/images/siddhivinayak.jpg"],
    rating: 4.9,
    totalRatings: 4120,
    entryFee: 0,
    openingTime: "5:30 AM",
    closingTime: "10:00 PM",
  },
];

const famousFoods = [
  {
    name: "Vada Pav",
    category: "Snack",
    averagePrice: 40,
    rating: 4.7,
    totalReviews: 2300,
    speciality: "Crispy potato fritter between soft pavs",
    place: "Ashok Vada Pav, Dadar",
    images: [
      "/images/vadapav1.jpg",
      "/images/vadapav2.jpg",
      "/images/vadapav3.jpg",
    ],
  },
  {
    name: "Cutting Chai",
    category: "Beverage",
    averagePrice: 15,
    rating: 4.8,
    totalReviews: 4100,
    speciality: "Strong & sweet – Mumbai’s favorite sip",
    place: "Any street tapri near CST",
    images: ["/images/tea1.jpg", "/images/tea2.jpg"],
  },
];

const famousHistory = [
  {
    name: "Chhatrapati Shivaji Terminus",
    address: "Fort, Mumbai",
    category: "Colonial Railway Terminus",
    era: "Built in 1887",
    rating: 4.8,
    totalReviews: 5231,
    images: ["/images/cst1.jpg", "/images/cst2.jpg"],
  },
  {
    name: "Elephanta Caves",
    address: "Gharapuri Island, Mumbai Harbour",
    category: "Rock-Cut Cave Temple",
    era: "5th–8th Century CE",
    rating: 4.7,
    totalReviews: 3120,
    images: ["/images/elephanta1.jpg", "/images/elephanta2.jpg"],
  },
  {
    name: "Siddhivinayak Temple",
    address: "Prabhadevi, Mumbai",
    category: "Hindu Temple",
    era: "Constructed in 1801",
    rating: 4.9,
    totalReviews: 10120,
    images: ["/images/siddhivinayak1.jpg", "/images/siddhivinayak2.jpg"],
  },
];

const famousHandicrafts = [
  {
    name: "Worli Art Paintings",
    shops: ["Crawford Market", "Colaba Causeway"],
    priceRange: "₹500 – ₹2,000",
    rating: 4.7,
    totalReviews: 1250,
    images: ["/images/worli1.jpg", "/images/worli2.jpg"],
  },
  {
    name: "Leather Handcrafted Bags",
    shops: ["Hill Road Market"],
    priceRange: "₹800 – ₹2,500",
    rating: 4.5,
    totalReviews: 860,
    images: ["/images/bags1.jpg", "/images/bags2.jpg"],
  },
  {
    name: "Handwoven Jute Baskets",
    shops: ["Colaba Market", "Bandra Fair Stalls"],
    priceRange: "₹300 – ₹1,200",
    rating: 4.6,
    totalReviews: 970,
    images: ["/images/jute1.jpg", "/images/jute2.jpg"],
  },
];

const famousPeople = [
  {
    name: "Ravi Sharma",
    role: "Local Resident",
    contactMethod: "WhatsApp: +91 9876543210",
    rating: 4.8,
    totalReviews: 230,
    image: "/images/ravi.jpg",
  },
  {
    name: "Ayesha Khan",
    role: "Certified Guide",
    contactMethod: "Email: ayesha.mumbai@gmail.com",
    rating: 4.9,
    totalReviews: 310,
    image: "/images/ayesha.jpg",
  },
  {
    name: "Sameer Patel",
    role: "Resident",
    contactMethod: "Instagram: @sameerexplores",
    rating: 4.7,
    totalReviews: 185,
    image: "/images/sameer.jpg",
  },
];



export default { famousSpots, famousFoods, famousHistory, famousHandicrafts, famousPeople };