import bcryptjs from 'bcryptjs';
import db from './database.js';

function seed() {
  db.exec('DELETE FROM reviews');
  db.exec('DELETE FROM errands');
  db.exec('DELETE FROM users');
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('users','errands','reviews')");

  const users = [
    { name: 'Alice Sharma', email: 'alice@local.com', neighbourhood: 'Koramangala', phone: '9876543210' },
    { name: 'Bob Patel', email: 'bob@local.com', neighbourhood: 'Indiranagar', phone: '9876543211' },
    { name: 'Priya Reddy', email: 'priya@local.com', neighbourhood: 'HSR Layout', phone: '9876543212' },
    { name: 'Rahul Verma', email: 'rahul@local.com', neighbourhood: 'JP Nagar', phone: '9876543213' },
    { name: 'Sneha Kapoor', email: 'sneha@local.com', neighbourhood: 'Whitefield', phone: '9876543214' },
    { name: 'Vikram Singh', email: 'vikram@local.com', neighbourhood: 'MG Road', phone: '9876543215' },
    { name: 'Ananya Iyer', email: 'ananya@local.com', neighbourhood: 'Jayanagar', phone: '9876543216' },
    { name: 'Rohan Desai', email: 'rohan@local.com', neighbourhood: 'BTM Layout', phone: '9876543217' },
    { name: 'Kavita Nair', email: 'kavita@local.com', neighbourhood: 'Electronic City', phone: '9876543218' },
    { name: 'Arun Joshi', email: 'arun@local.com', neighbourhood: 'Malleshwaram', phone: '9876543219' },
  ];

  const password = bcryptjs.hashSync('password123', 10);
  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password, neighbourhood, phone, avatar_initial) VALUES (?, ?, ?, ?, ?, ?)'
  );

  for (const u of users) {
    insertUser.run(u.name, u.email, password, u.neighbourhood, u.phone, u.name.charAt(0));
  }

  const errands = [
    { title: 'Pick up groceries from D-Mart', description: 'Need someone to pick up my weekly grocery order from D-Mart in Koramangala. List will be shared.', category: 'Grocery Run', reward: 100, urgency: 'Medium', location: 'Koramangala', lat: 12.9352, lng: 77.6245, deadline: '2026-05-16 18:00:00', status: 'Open', posted_by: 1 },
    { title: 'Deliver a parcel to Indiranagar', description: 'Need a small parcel delivered to Indiranagar 4th Cross. Weight is under 500g.', category: 'Parcel Drop', reward: 80, urgency: 'Low', location: 'Indiranagar', lat: 12.9783, lng: 77.6408, deadline: '2026-05-18 12:00:00', status: 'Open', posted_by: 2 },
    { title: 'Walk my dog for 30 mins', description: 'Need someone to walk my golden retriever in HSR Layout park. Friendly dog!', category: 'Pet Care', reward: 150, urgency: 'High', location: 'HSR Layout', lat: 12.9116, lng: 77.6389, deadline: '2026-05-15 08:00:00', status: 'Open', posted_by: 3 },
    { title: 'Fix my laptop charger port', description: 'Laptop charging port is loose. Need someone who can solder it back.', category: 'Tech Help', reward: 300, urgency: 'High', location: 'JP Nagar', lat: 12.9063, lng: 77.5857, deadline: '2026-05-15 20:00:00', status: 'Open', posted_by: 4 },
    { title: 'Help assemble IKEA bookshelf', description: 'I have an IKEA KALLAX shelf that needs assembly. Tools provided.', category: 'Home Help', reward: 200, urgency: 'Low', location: 'Whitefield', lat: 12.9698, lng: 77.7500, deadline: '2026-05-20 14:00:00', status: 'Open', posted_by: 5 },
    { title: 'Buy medicines from Apollo Pharmacy', description: 'Need someone to pick up prescribed medicines from Apollo Pharmacy near MG Road.', category: 'Grocery Run', reward: 50, urgency: 'High', location: 'MG Road', lat: 12.9756, lng: 77.6066, deadline: '2026-05-15 10:00:00', status: 'Claimed', posted_by: 6, claimed_by: 1 },
    { title: 'Drop keys to my friend in Jayanagar', description: 'I locked myself out and need my spare keys picked up and brought from my office.', category: 'Parcel Drop', reward: 120, urgency: 'High', location: 'Jayanagar', lat: 12.9250, lng: 77.5938, deadline: '2026-05-15 09:00:00', status: 'Claimed', posted_by: 7, claimed_by: 2 },
    { title: 'Cat sitting for 2 days', description: 'Need someone to feed and play with my cat for 2 days while I am out of town.', category: 'Pet Care', reward: 400, urgency: 'Medium', location: 'BTM Layout', lat: 12.9166, lng: 77.6101, deadline: '2026-05-17 09:00:00', status: 'Open', posted_by: 8 },
    { title: 'Install ceiling fan', description: 'Need a ceiling fan installed in my living room. I have the fan ready.', category: 'Home Help', reward: 250, urgency: 'Medium', location: 'Electronic City', lat: 12.8399, lng: 77.6770, deadline: '2026-05-19 16:00:00', status: 'Open', posted_by: 9 },
    { title: 'Set up home WiFi router', description: 'Need help configuring a new TP-Link WiFi router and extending network to 2 rooms.', category: 'Tech Help', reward: 180, urgency: 'Low', location: 'Malleshwaram', lat: 12.9872, lng: 77.5696, deadline: '2026-05-22 18:00:00', status: 'Open', posted_by: 10 },
    { title: 'Pick up dry cleaning', description: 'Need someone to pick up dry cleaning from the laundry on Double Road.', category: 'Grocery Run', reward: 60, urgency: 'Low', location: 'Koramangala', lat: 12.9279, lng: 77.6271, deadline: '2026-05-21 12:00:00', status: 'Open', posted_by: 1 },
    { title: 'Delicate cake delivery', description: 'Need a cake delivered to Indiranagar for my mom birthday. Handle with care!', category: 'Parcel Drop', reward: 100, urgency: 'Medium', location: 'Indiranagar', lat: 12.9719, lng: 77.6412, deadline: '2026-05-16 15:00:00', status: 'Open', posted_by: 2 },
    { title: 'Water my plants', description: 'Need someone to water 8 potted plants on my balcony for 3 days.', category: 'Pet Care', reward: 200, urgency: 'Medium', location: 'HSR Layout', lat: 12.9085, lng: 77.6475, deadline: '2026-05-18 10:00:00', status: 'Open', posted_by: 3 },
    { title: 'Fix leaking kitchen tap', description: 'Kitchen sink tap is leaking continuously. Need a plumber or someone handy.', category: 'Home Help', reward: 350, urgency: 'High', location: 'JP Nagar', lat: 12.9125, lng: 77.5892, deadline: '2026-05-15 14:00:00', status: 'Open', posted_by: 4 },
    { title: 'Retrieve phone from cab', description: 'Left my phone in an Ola cab. Need help tracking and retrieving it.', category: 'Other', reward: 500, urgency: 'High', location: 'Whitefield', lat: 12.9634, lng: 77.7455, deadline: '2026-05-15 12:00:00', status: 'Open', posted_by: 5 },
    { title: 'Buy birthday cake and balloons', description: 'Need someone to buy a chocolate cake and helium balloons for a surprise party.', category: 'Grocery Run', reward: 150, urgency: 'High', location: 'MG Road', lat: 12.9782, lng: 77.6034, deadline: '2026-05-15 17:00:00', status: 'Completed', posted_by: 6, claimed_by: 3 },
    { title: 'Return Amazon package', description: 'Need someone to drop off an Amazon return package at the pickup point near Jayanagar.', category: 'Parcel Drop', reward: 70, urgency: 'Low', location: 'Jayanagar', lat: 12.9308, lng: 77.5878, deadline: '2026-05-20 20:00:00', status: 'Completed', posted_by: 7, claimed_by: 4 },
    { title: 'Help with moving boxes', description: 'Need help moving 5 heavy boxes from my apartment to a moving truck.', category: 'Home Help', reward: 300, urgency: 'Medium', location: 'BTM Layout', lat: 12.9204, lng: 77.6081, deadline: '2026-05-22 10:00:00', status: 'Open', posted_by: 8 },
    { title: 'Printer cartridge replacement', description: 'Need help replacing the toner cartridge on an HP LaserJet printer.', category: 'Tech Help', reward: 100, urgency: 'Low', location: 'Electronic City', lat: 12.8456, lng: 77.6716, deadline: '2026-05-25 14:00:00', status: 'Open', posted_by: 9 },
    { title: 'Queue for concert tickets', description: 'Need someone to stand in line at the venue to book concert tickets. I will pay for the ticket.', category: 'Other', reward: 250, urgency: 'Medium', location: 'Malleshwaram', lat: 12.9828, lng: 77.5719, deadline: '2026-05-19 08:00:00', status: 'Cancelled', posted_by: 10 },
  ];

  const insertErrand = db.prepare(`
    INSERT INTO errands (title, description, category, reward, urgency, location_name, latitude, longitude, deadline, status, posted_by, claimed_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const e of errands) {
    const rewardType = e.reward > 0 ? '₹' : 'Favour';
    insertErrand.run(e.title, e.description, e.category, e.reward, e.urgency, e.location, e.lat, e.lng, e.deadline, e.status, e.posted_by, e.claimed_by || null);
  }

  const reviews = [
    { errand_id: 16, reviewer_id: 6, reviewee_id: 3, rating: 5, comment: 'Excellent! Got the cake and balloons on time. The surprise party was a hit!' },
    { errand_id: 16, reviewer_id: 6, reviewee_id: 3, rating: 4, comment: 'Very prompt and friendly service. Would recommend.' },
    { errand_id: 17, reviewer_id: 7, reviewee_id: 4, rating: 5, comment: 'Quick and easy. Dropped the package without any issues.' },
    { errand_id: 17, reviewer_id: 7, reviewee_id: 4, rating: 4, comment: 'Reliable and professional. Thanks for the help!' },
    { errand_id: 6, reviewer_id: 6, reviewee_id: 1, rating: 5, comment: 'Picked up the exact medicines. Very careful with the prescription.' },
    { errand_id: 6, reviewer_id: 6, reviewee_id: 1, rating: 3, comment: 'Good service but was a bit late. Otherwise fine.' },
    { errand_id: 7, reviewer_id: 7, reviewee_id: 2, rating: 5, comment: 'Lifesaver! Got my keys to me in 20 minutes.' },
    { errand_id: 7, reviewer_id: 7, reviewee_id: 2, rating: 4, comment: 'Fast delivery. Very helpful in an emergency.' },
  ];

  const insertReview = db.prepare(
    'INSERT INTO reviews (errand_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)'
  );

  for (const r of reviews) {
    insertReview.run(r.errand_id, r.reviewer_id, r.reviewee_id, r.rating, r.comment);
  }

  console.log('Database seeded successfully with:');
  console.log('  - 10 users');
  console.log('  - 20 errands');
  console.log('  - 8 reviews');
  console.log('\nTest credentials:');
  console.log('  alice@local.com / password123');
  console.log('  bob@local.com / password123');
}

seed();
