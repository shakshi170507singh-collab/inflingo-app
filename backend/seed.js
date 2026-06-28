const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'College Admin',
      email: 'admin@inflingo.com',
      password: adminPassword,
      role: 'admin',
      course: 'ALL',
      department: 'ALL',
      year: 0
    }
  });

  // Create a CR user
  const crPassword = await bcrypt.hash('cr123', 10);
  const cr = await prisma.user.create({
    data: {
      name: 'BSc CR',
      email: 'cr@inflingo.com',
      password: crPassword,
      role: 'cr',
      course: 'BSc',
      department: 'Computer Science',
      year: 2
    }
  });

  // Create notices
  await prisma.notice.createMany({
    data: [
      {
        title: 'Welcome to Inflingo!',
        content: 'College notice board is now live.',
        category: 'general',
        targetCourse: 'ALL',
        targetDepartment: 'ALL',
        targetYear: 'ALL',
        authorId: admin.id
      },
      {
        title: 'BSc 2nd Year Exam Schedule',
        content: 'Exams start from July 10. Check timetable.',
        category: 'academic',
        targetCourse: 'BSc',
        targetDepartment: 'ALL',
        targetYear: '2',
        authorId: cr.id
      },
      {
        title: 'Placement Drive - TCS',
        content: 'TCS visiting campus on July 15. Register by July 12.',
        category: 'placement',
        targetCourse: 'ALL',
        targetDepartment: 'ALL',
        targetYear: 'ALL',
        authorId: admin.id
      },
      {
        title: 'Annual College Fest',
        content: 'Inflingo Fest 2024 on July 20. All students welcome!',
        category: 'event',
        targetCourse: 'ALL',
        targetDepartment: 'ALL',
        targetYear: 'ALL',
        authorId: admin.id
      }
    ]
  });

  console.log('✅ Seed data added successfully!');
}

main()
  .catch(console.error)
  .finally(() => process.exit());