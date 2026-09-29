import fs from 'fs';
import path from 'path';
import https from 'https';

const imageList = [
  {
    dest: 'images/hero/karnataka-hero.jpg',
    urls: [
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/hero/karnataka-fallback.jpg',
    urls: [
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/coorg.jpg',
    urls: [
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/mysore.jpg',
    urls: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/chikmagalur.jpg',
    urls: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/hampi.jpg',
    urls: [
      'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/gokarna.jpg',
    urls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/udupi.jpg',
    urls: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/murudeshwar.jpg',
    urls: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/bandipur.jpg',
    urls: [
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/nagarhole.jpg',
    urls: [
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/badami.jpg',
    urls: [
      'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/pattadakal.jpg',
    urls: [
      'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/belur-halebidu.jpg',
    urls: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/mangalore.jpg',
    urls: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/srirangapatna.jpg',
    urls: [
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/sringeri.jpg',
    urls: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/bengaluru.jpg',
    urls: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/dandeli.jpg',
    urls: [
      'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/jog-falls.jpg',
    urls: [
      'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/sakleshpur.jpg',
    urls: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/kudremukh.jpg',
    urls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1000&auto=format&fit=crop&q=80'
    ]
  },
  {
    dest: 'images/destinations/nandi-hills.jpg',
    urls: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80'
    ]
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with HTTP ${res.statusCode}`));
      }
      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('📥 Downloading destination images locally to images/...');
  for (const item of imageList) {
    let downloaded = false;
    for (const url of item.urls) {
      try {
        await downloadFile(url, item.dest);
        console.log(`✅ Saved ${item.dest}`);
        downloaded = true;
        break;
      } catch (err) {
        console.warn(`⚠️ URL failed for ${item.dest}: ${err.message}. Trying next...`);
      }
    }
    if (!downloaded) {
      console.error(`❌ Could not download image for ${item.dest}`);
    }
  }
  console.log('🎉 All destination images processed!');
}

run();
