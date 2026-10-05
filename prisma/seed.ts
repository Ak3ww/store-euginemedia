import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial products into EugineStore database...');

  const products = [
    {
      id: 'prod-rb750gr3',
      name: 'MikroTik RouterBOARD RB750Gr3 (hEX)',
      description:
        'Router 5 port Gigabit Ethernet hemat daya, 880MHz dual-core CPU, 256MB RAM. Sangat ideal untuk gateway ISP RT-RW Net, PPPoE server, bandwidth limiter queue, dan load balance.',
      price: 920000,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      category: 'Network Gear',
      isFeatured: true,
    },
    {
      id: 'prod-ont-xpon',
      name: 'Optical Network Terminal (ONT) XPON Gigabit Dual Band AC1200',
      description:
        'ONT XPON kompatibel EPON & GPON, 4 port LAN Gigabit, WiFi 2.4GHz & 5GHz AC1200, 2 antena gain 5dBi, support TR-069 GenieACS auto remote management.',
      price: 285000,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=800&q=80',
      category: 'Network Gear',
      isFeatured: true,
    },
    {
      id: 'prod-smart-cctv',
      name: 'Smart WiFi IP Camera 2K 360° PTZ Night Vision',
      description:
        'Kamera pengawas pintar resolusi 2K 3MP, rotasi 360 derajat, sensor gerak AI manusia, two-way audio, slot MicroSD up to 256GB.',
      price: 345000,
      stock: 22,
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      category: 'Smart Home',
      isFeatured: true,
    },
    {
      id: 'prod-switch-8p',
      name: 'Gigabit Switch 8-Port Metal Case Unmanaged',
      description:
        'Switch jaringan 8 port 10/100/1000Mbps full duplex, bodi metal kokoh anti interferensi, plug and play tanpa konfigurasi.',
      price: 215000,
      stock: 18,
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      category: 'Network Gear',
      isFeatured: false,
    },
    {
      id: 'prod-fo-patchcord',
      name: 'Patchcord Fiber Optic SC/UPC-SC/UPC Simplex 3 Meter',
      description:
        'Kabel patch cord single mode 9/125um LSZH diameter 3.0mm, insertion loss sangat rendah <0.2dB untuk koneksi OTB ke ONT.',
      price: 18000,
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      category: 'Aksesoris FTTH',
      isFeatured: false,
    },
    {
      id: 'prod-smart-socket',
      name: 'Smart WiFi Plug Socket 16A with Power Monitoring',
      description:
        'Stop kontak pintar WiFi dengan fitur pemantau konsumsi listrik real-time, timer otomatis, kontrol via aplikasi & Google Assistant.',
      price: 125000,
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
      category: 'Smart Home',
      isFeatured: false,
    },
  ];

  for (const item of products) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log(`✅ Seeded ${products.length} products successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
