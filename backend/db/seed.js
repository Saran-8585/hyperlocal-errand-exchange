import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';
import User from '../models/User.js';
import Errand from '../models/Errand.js';
import Review from '../models/Review.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hyperlocal_errand';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for seeding');

  await Review.deleteMany({});
  await Errand.deleteMany({});
  await User.deleteMany({});

  const password = bcryptjs.hashSync('password123', 10);

  const userData = [
    { name: 'Akash Kumar', email: 'akash@local.com', neighbourhood: 'Kuniyamuthur', phone: '9876543210' },
    { name: 'Bhavana R', email: 'bhavana@local.com', neighbourhood: 'Sugunapuram', phone: '9876543211' },
    { name: 'Charu Devi', email: 'charu@local.com', neighbourhood: 'Vadavalli', phone: '9876543212' },
    { name: 'Dinesh S', email: 'dinesh@local.com', neighbourhood: 'Kovaipudur', phone: '9876543213' },
    { name: 'Esha Mahesh', email: 'esha@local.com', neighbourhood: 'Saibaba Colony', phone: '9876543214' },
    { name: 'Gowtham K', email: 'gowtham@local.com', neighbourhood: 'Gandhipuram', phone: '9876543215' },
    { name: 'Harini V', email: 'harini@local.com', neighbourhood: 'R.S. Puram', phone: '9876543216' },
    { name: 'Irfan M', email: 'irfan@local.com', neighbourhood: 'Peelamedu', phone: '9876543217' },
    { name: 'Janani S', email: 'janani@local.com', neighbourhood: 'Singanallur', phone: '9876543218' },
    { name: 'Karthik R', email: 'karthik@local.com', neighbourhood: 'Ganapathy', phone: '9876543219' },
  ];

  const users = await User.create(
    userData.map(u => ({
      ...u,
      password,
      avatar_initial: u.name.charAt(0),
    }))
  );

  console.log(`  - ${users.length} users`);

  const errandData = [
    { title: 'Pick up groceries from Reliance Fresh', description: 'Need someone to pick up my weekly grocery order from Reliance Fresh in Kuniyamuthur. List will be shared. Near SKASC campus.', category: 'Grocery Run', reward: 100, urgency: 'Medium', location: 'Kuniyamuthur', lat: 10.8760, lng: 76.9550, deadline: '2026-07-16 18:00:00', status: 'Open', posted_by: 0 },
    { title: 'Deliver a parcel to Gandhipuram', description: 'Need a small parcel delivered to Gandhipuram bus stand. Weight is under 500g. Pickup near SKASC.', category: 'Parcel Drop', reward: 80, urgency: 'Low', location: 'Gandhipuram', lat: 11.0160, lng: 76.9580, deadline: '2026-07-18 12:00:00', status: 'Open', posted_by: 1 },
    { title: 'Walk my dog in Vadavalli park', description: 'Need someone to walk my beagle for 30 mins in Vadavalli park. Friendly dog! Near the college area.', category: 'Pet Care', reward: 150, urgency: 'High', location: 'Vadavalli', lat: 10.9000, lng: 76.9400, deadline: '2026-07-15 08:00:00', status: 'Open', posted_by: 2 },
    { title: 'Fix my laptop charger port', description: 'Laptop charging port is loose. Need someone who can solder it back. I live near Kovaipudur.', category: 'Tech Help', reward: 300, urgency: 'High', location: 'Kovaipudur', lat: 10.9200, lng: 76.9300, deadline: '2026-07-15 20:00:00', status: 'Open', posted_by: 3 },
    { title: 'Help assemble IKEA bookshelf', description: 'I have an IKEA KALLAX shelf that needs assembly. Tools provided. Near Saibaba Colony signal.', category: 'Home Help', reward: 200, urgency: 'Low', location: 'Saibaba Colony', lat: 11.0000, lng: 76.9700, deadline: '2026-07-20 14:00:00', status: 'Open', posted_by: 4 },
    { title: 'Buy medicines from Apollo Pharmacy', description: 'Need someone to pick up prescribed medicines from Apollo Pharmacy near Gandhipuram. Urgent!', category: 'Grocery Run', reward: 50, urgency: 'High', location: 'Gandhipuram', lat: 11.0160, lng: 76.9580, deadline: '2026-07-15 10:00:00', status: 'Claimed', posted_by: 5, claimed_by: 0 },
    { title: 'Drop keys to my friend in R.S. Puram', description: 'I locked myself out and need my spare keys picked up from SKASC campus and brought to R.S. Puram.', category: 'Parcel Drop', reward: 120, urgency: 'High', location: 'R.S. Puram', lat: 10.9920, lng: 76.9540, deadline: '2026-07-15 09:00:00', status: 'Claimed', posted_by: 6, claimed_by: 1 },
    { title: 'Cat sitting for 2 days', description: 'Need someone to feed and play with my Persian cat for 2 days while I am out of town. Near Peelamedu.', category: 'Pet Care', reward: 400, urgency: 'Medium', location: 'Peelamedu', lat: 11.0220, lng: 77.0090, deadline: '2026-07-17 09:00:00', status: 'Open', posted_by: 7 },
    { title: 'Install ceiling fan', description: 'Need a ceiling fan installed in my living room. I have the fan ready. Near Singanallur bus stop.', category: 'Home Help', reward: 250, urgency: 'Medium', location: 'Singanallur', lat: 10.9960, lng: 77.0300, deadline: '2026-07-19 16:00:00', status: 'Open', posted_by: 8 },
    { title: 'Set up home WiFi router', description: 'Need help configuring a new TP-Link WiFi router and extending network to 2 rooms. Near Ganapathy.', category: 'Tech Help', reward: 180, urgency: 'Low', location: 'Ganapathy', lat: 11.0370, lng: 76.9890, deadline: '2026-07-22 18:00:00', status: 'Open', posted_by: 9 },
    { title: 'Pick up dry cleaning from laundry', description: 'Need someone to pick up dry cleaning from the laundry on Kuniyamuthur main road, near SKASC.', category: 'Grocery Run', reward: 60, urgency: 'Low', location: 'Kuniyamuthur', lat: 10.8760, lng: 76.9550, deadline: '2026-07-21 12:00:00', status: 'Open', posted_by: 0 },
    { title: 'Delicate cake delivery to Saibaba Colony', description: 'Need a cake delivered to my friend in Saibaba Colony for her birthday. Handle with care! Pickup from SKASC.', category: 'Parcel Drop', reward: 100, urgency: 'Medium', location: 'Saibaba Colony', lat: 11.0000, lng: 76.9700, deadline: '2026-07-16 15:00:00', status: 'Open', posted_by: 1 },
    { title: 'Water my plants', description: 'Need someone to water 8 potted plants on my balcony near Vadavalli for 3 days. Walking distance from SKASC.', category: 'Pet Care', reward: 200, urgency: 'Medium', location: 'Vadavalli', lat: 10.9085, lng: 76.9475, deadline: '2026-07-18 10:00:00', status: 'Open', posted_by: 2 },
    { title: 'Fix leaking kitchen tap', description: 'Kitchen sink tap is leaking continuously. Need a plumber or someone handy. Near Kovaipudur.', category: 'Home Help', reward: 350, urgency: 'High', location: 'Kovaipudur', lat: 10.9125, lng: 76.9392, deadline: '2026-07-15 14:00:00', status: 'Open', posted_by: 3 },
    { title: 'Retrieve phone from auto', description: 'Left my phone in an auto near Gandhipuram. Need help tracking and retrieving it. Reward assured!', category: 'Other', reward: 500, urgency: 'High', location: 'Gandhipuram', lat: 11.0160, lng: 76.9580, deadline: '2026-07-15 12:00:00', status: 'Open', posted_by: 4 },
    { title: 'Buy birthday cake and balloons', description: 'Need someone to buy a chocolate cake and helium balloons for a surprise party near R.S. Puram.', category: 'Grocery Run', reward: 150, urgency: 'High', location: 'R.S. Puram', lat: 10.9920, lng: 76.9540, deadline: '2026-07-15 17:00:00', status: 'Completed', posted_by: 5, claimed_by: 2 },
    { title: 'Return Amazon package', description: 'Need someone to drop off an Amazon return package at the pickup point near Singanallur.', category: 'Parcel Drop', reward: 70, urgency: 'Low', location: 'Singanallur', lat: 10.9960, lng: 77.0300, deadline: '2026-07-20 20:00:00', status: 'Completed', posted_by: 6, claimed_by: 3 },
    { title: 'Help with moving boxes', description: 'Need help moving 5 heavy boxes from my apartment near Peelamedu to a moving truck.', category: 'Home Help', reward: 300, urgency: 'Medium', location: 'Peelamedu', lat: 11.0220, lng: 77.0090, deadline: '2026-07-22 10:00:00', status: 'Open', posted_by: 7 },
    { title: 'Printer cartridge replacement', description: 'Need help replacing the toner cartridge on an HP LaserJet printer. Near Ganapathy.', category: 'Tech Help', reward: 100, urgency: 'Low', location: 'Ganapathy', lat: 11.0456, lng: 76.9890, deadline: '2026-07-25 14:00:00', status: 'Open', posted_by: 8 },
    { title: 'Queue for concert tickets', description: 'Need someone to stand in line at CODISSIA trade fair ground to book concert tickets. I will pay for the ticket.', category: 'Other', reward: 250, urgency: 'Medium', location: 'Gandhipuram', lat: 11.0160, lng: 76.9580, deadline: '2026-07-19 08:00:00', status: 'Cancelled', posted_by: 9 },
  ];

  const errands = [];
  for (const e of errandData) {
    const rewardType = e.reward > 0 ? '₹' : 'Favour';
    const errand = await Errand.create({
      title: e.title,
      description: e.description,
      category: e.category,
      reward: e.reward,
      reward_type: rewardType,
      urgency: e.urgency,
      location_name: e.location,
      latitude: e.lat,
      longitude: e.lng,
      deadline: new Date(e.deadline),
      status: e.status,
      posted_by: users[e.posted_by]._id,
      claimed_by: e.claimed_by !== undefined ? users[e.claimed_by]._id : null,
    });
    errands.push(errand);
  }

  console.log(`  - ${errands.length} errands`);

  const reviewData = [
    { errand_idx: 15, reviewer_idx: 5, reviewee_idx: 2, rating: 5, comment: 'Excellent! Got the cake and balloons on time. The surprise party was a hit!' },
    { errand_idx: 15, reviewer_idx: 5, reviewee_idx: 2, rating: 4, comment: 'Very prompt and friendly service. Would recommend.' },
    { errand_idx: 16, reviewer_idx: 6, reviewee_idx: 3, rating: 5, comment: 'Quick and easy. Dropped the package without any issues.' },
    { errand_idx: 16, reviewer_idx: 6, reviewee_idx: 3, rating: 4, comment: 'Reliable and professional. Thanks for the help!' },
    { errand_idx: 5, reviewer_idx: 5, reviewee_idx: 0, rating: 5, comment: 'Picked up the exact medicines from Apollo Pharmacy. Very careful with the prescription.' },
    { errand_idx: 5, reviewer_idx: 5, reviewee_idx: 0, rating: 3, comment: 'Good service but was a bit late. Otherwise fine.' },
    { errand_idx: 6, reviewer_idx: 6, reviewee_idx: 1, rating: 5, comment: 'Lifesaver! Got my keys to me in 20 minutes from SKASC.' },
    { errand_idx: 6, reviewer_idx: 6, reviewee_idx: 1, rating: 4, comment: 'Fast delivery. Very helpful in an emergency.' },
  ];

  for (const r of reviewData) {
    await Review.create({
      errand_id: errands[r.errand_idx]._id,
      reviewer_id: users[r.reviewer_idx]._id,
      reviewee_id: users[r.reviewee_idx]._id,
      rating: r.rating,
      comment: r.comment,
    });
  }

  console.log(`  - ${reviewData.length} reviews`);
  console.log();
  console.log('Database seeded successfully!');
  console.log('Test credentials:');
  console.log('  akash@local.com / password123');
  console.log('  bhavana@local.com / password123');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
