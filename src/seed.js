import './env.js';
import { db } from './db/client.js';
import { users, trips, tripMembers, itineraryDays, checklists } from './db/schema/index.js';
import { hashPassword } from './auth/password.js';

const seed = async () => {
  console.log('Seeding database…');

  const passwordHash = await hashPassword('password123');

  const [alice, bob] = await db
    .insert(users)
    .values([
      { name: 'Alice Johnson', email: 'alice@example.com', passwordHash },
      { name: 'Bob Smith', email: 'bob@example.com', passwordHash },
    ])
    .returning()
    .onConflictDoNothing();

  if (!alice) {
    console.log('Users already seeded. Skipping.');
    process.exit(0);
  }

  const [trip] = await db
    .insert(trips)
    .values({
      title: 'Tokyo Summer 2026',
      startDate: '2026-07-01',
      endDate: '2026-07-05',
      travelerCount: 2,
      ownerId: alice.id,
    })
    .returning();

  await db.insert(tripMembers).values([
    { tripId: trip.id, userId: alice.id, role: 'owner' },
    { tripId: trip.id, userId: bob.id, role: 'editor' },
  ]);

  const dates = ['2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04', '2026-07-05'];

  await db
    .insert(itineraryDays)
    .values(dates.map((dayDate) => ({ tripId: trip.id, dayDate })))
    .onConflictDoNothing();

  await db.insert(checklists).values([
    { tripId: trip.id, title: 'Packing list', kind: 'packing' },
    { tripId: trip.id, title: 'Things to do', kind: 'todo' },
  ]);

  console.log('Seed complete!');
  console.log(`  alice@example.com / password123 (owner)`);
  console.log(`  bob@example.com   / password123 (editor)`);
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
