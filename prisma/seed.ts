 
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const lookingForOptions = ['long-term', 'short-term'];
  const sampleKeywords = [  "Poetry","Music","Traveling","Hiking","Photography",
  "Dancing",
  "Cooking",
  "Reading",
  "Movies",
  "Fitness",
  "Yoga",
  "Gaming",
  "Drawing",
  "Writing",
  "Painting",
  "Cycling",
  "Camping",
  "Swimming",
  "Running",
  "Tech",
  "Fashion",
  "Meditation",
  "Crafting",
  "Board Games",
  "Volunteering",
  "Gardening",
  "Sports",
  "Skiing",
  "Snowboarding",
  "Skateboarding",
  "Animals",
  "Astrology",
  "Karaoke",
  "Podcasts",
  "Comedy",
  "Theater",
  "Languages",
  "Wine Tasting",
  "Coffee Lover",
  "Foodie",
  "Live Music"];
  const samplePhotos = [];

  for (let i = 1; i <= 20; i++) {
    const gender = i % 2 === 0 ? 'women' : 'men';
    samplePhotos.push(`https://randomuser.me/api/portraits/${gender}/${i}.jpg`);
  }

  for (let i = 0; i < 20; i++) {
    const keywordNames = faker.helpers.arrayElements(sampleKeywords, faker.number.int({ min: 2, max: 4 }));
    const keywordRecords = [];

    for (const keyword of keywordNames) {
      const keywordEntry = await prisma.keyword.upsert({
        where: { name: keyword },
        update: {},
        create: { name: keyword },
      });
      keywordRecords.push(keywordEntry);
    }

    const user = await prisma.user.create({
      data: {
        name: `${faker.person.firstName()}_${i}`,
        email: faker.internet.email(),
        image: samplePhotos[i],
        photos: {
            create: faker.helpers
              .arrayElements(samplePhotos, 4)
              .map(url => ({ url })),
          },
        profile: {
          create: {
            bio: faker.lorem.sentence(),
            age: faker.number.int({ min: 18, max: 45 }),
            lookingFor: faker.helpers.arrayElement(lookingForOptions),
            height: faker.number.int({ min: 150, max: 200 }),
            location: faker.location.city(),
            gender: faker.person.sexType(),
            languages: faker.helpers.arrayElement(['English', 'Spanish', 'French', 'German']),
            job: faker.person.jobTitle(),
            livingIn: faker.location.city(),
            batch: faker.helpers.arrayElement(['btech', 'mca', 'bba', 'bca']),
            keywords: {
              connect: keywordRecords.map(k => ({ id: k.id })),
            },
          },
        },
      },
    });

    console.log(`Created user: ${user.name}`);
  }
}

main()
  .then(() => {
    console.log('Seeding complete!');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Error while seeding:', e);
    return prisma.$disconnect();
  });

 

  // const samplePhotos = [
  //   'https://randomuser.me/api/portraits/men/1.jpg',
  //   'https://randomuser.me/api/portraits/women/2.jpg',
  //   'https://randomuser.me/api/portraits/men/3.jpg',
  //   'https://randomuser.me/api/portraits/women/4.jpg',
  //   'https://randomuser.me/api/portraits/men/5.jpg',
  //   'https://randomuser.me/api/portraits/women/6.jpg',
  //   'https://randomuser.me/api/portraits/men/7.jpg',
  //   'https://randomuser.me/api/portraits/women/8.jpg',
  //   'https://randomuser.me/api/portraits/men/9.jpg',
  //   'https://randomuser.me/api/portraits/women/10.jpg',
  //   'https://randomuser.me/api/portraits/men/11.jpg',
  //   'https://randomuser.me/api/portraits/women/12.jpg',
  //   'https://randomuser.me/api/portraits/men/13.jpg',
  //   'https://randomuser.me/api/portraits/women/14.jpg',
  //   'https://randomuser.me/api/portraits/men/15.jpg',
  //   'https://randomuser.me/api/portraits/women/16.jpg',
  //   'https://randomuser.me/api/portraits/men/17.jpg',
  //   'https://randomuser.me/api/portraits/women/18.jpg',
  //   'https://randomuser.me/api/portraits/men/19.jpg',
  //   'https://randomuser.me/api/portraits/women/20.jpg',
  // ];

   // for (let i = 0; i < 20; i++) {
  //   const user = await prisma.user.create({
  //     data: {
  //       name: faker .person.fullName(),
  //       email: faker.internet.email(),
  //       bio: faker.lorem.sentence(),
  //       age: faker.number.int({ min: 18, max: 45 }),
  //       lookingFor: faker.helpers.arrayElement(lookingForOptions),
  //       height: faker.number.int({ min: 150, max: 200 }),
  //       relationshipStatus: faker.helpers.arrayElement(relationshipStatuses),
  //       emailVerified: faker.date.past(),
  //       image: samplePhotos[i],
  //       location: faker.location.city(),
  //       createdAt: faker.date.past(),
  //       gender: faker.person.gender(),
  //       keywords: {
  //         create: faker.helpers
  //           .arrayElements(sampleKeywords, faker.number.int({ min: 2, max: 4 }))
  //           .map((keyword) => ({ name: keyword })),
  //       },

  //       photos: {
  //         create: [
  //           {
  //             url: samplePhotos[i],
  //           },
  //         ],
  //       },
  //     },
  //   });