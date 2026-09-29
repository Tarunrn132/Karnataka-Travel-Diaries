import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageMapping = {
  'coorg': 'images/destinations/coorg.jpg',
  'mysore': 'images/destinations/mysore.jpg',
  'chikmagalur': 'images/destinations/chikmagalur.jpg',
  'hampi': 'images/destinations/hampi.jpg',
  'gokarna': 'images/destinations/gokarna.jpg',
  'udupi': 'images/destinations/udupi.jpg',
  'murudeshwar': 'images/destinations/murudeshwar.jpg',
  'bandipur': 'images/destinations/bandipur.jpg',
  'nagarhole': 'images/destinations/nagarhole.jpg',
  'badami': 'images/destinations/badami.jpg',
  'pattadakal': 'images/destinations/pattadakal.jpg',
  'belur-halebidu': 'images/destinations/belur-halebidu.jpg',
  'mangalore': 'images/destinations/mangalore.jpg',
  'srirangapatna': 'images/destinations/srirangapatna.jpg',
  'sringeri': 'images/destinations/sringeri.jpg',
  'bengaluru': 'images/destinations/bengaluru.jpg',
  'dandeli': 'images/destinations/dandeli.jpg',
  'jog-falls': 'images/destinations/jog-falls.jpg',
  'sakleshpur': 'images/destinations/sakleshpur.jpg',
  'kudremukh': 'images/destinations/kudremukh.jpg',
  'nandi-hills': 'images/destinations/nandi-hills.jpg'
};

async function main() {
  const dests = await prisma.destination.findMany();
  for (const dest of dests) {
    const localImg = imageMapping[dest.slug] || `images/destinations/${dest.slug}.jpg`;
    await prisma.destination.update({
      where: { id: dest.id },
      data: { image: localImg }
    });
    console.log(`Updated ${dest.name} -> ${localImg}`);
  }
  console.log('All destination images updated to local paths in dev.db!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
