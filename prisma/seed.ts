import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting EugineStore Database Seeding...");

  // 1. Seed Admin User
  const adminPasswordHash = await bcrypt.hash("EugineStore2026!", 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@euginemediagroup.com" },
    update: { passwordHash: adminPasswordHash },
    create: {
      username: "admin",
      email: "admin@euginemediagroup.com",
      name: "SuperAdmin EugineStore",
      passwordHash: adminPasswordHash,
      role: "SUPERADMIN",
    },
  });
  console.log(`[+] Admin User ready: ${admin.email}`);

  // 2. Seed Categories
  const categoriesData = [
    { name: "Router MikroTik", slug: "router", sortOrder: 1 },
    { name: "OLT FTTH", slug: "ftth", sortOrder: 2 },
    { name: "Modem ONT", slug: "ont", sortOrder: 3 },
    { name: "Kabel Fiber Optic", slug: "kabel", sortOrder: 4 },
    { name: "Alat & Tools", slug: "alat", sortOrder: 5 },
    { name: "Aksesoris", slug: "aksesoris", sortOrder: 6 },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });
    categories[cat.slug] = record;
  }
  console.log(`[+] ${Object.keys(categories).length} Categories seeded.`);

  // 3. Seed 12 Realistic Network Products
  const products = [
    {
      name: "MikroTik RB750Gr3 (hEX) Gigabit Router",
      slug: "mikrotik-rb750gr3-hex",
      sku: "MK-HEX-750",
      price: 875000,
      originalPrice: 950000,
      weight: 400,
      stock: 50,
      categoryId: categories["router"].id,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      shopeeUrl: "https://shopee.co.id",
      tokopediaUrl: "https://tokopedia.com",
      description:
        "Routerboard 5 Port Gigabit Ethernet 10/100/1000, CPU Dual-Core 880MHz, RAM 256MB. Sangat cocok dan stabil untuk gateway internet, PPPoE Server RT-RW Net, load balancing 2-4 ISP, dan hotspot voucher.",
      specifications: {
        cpu: "MediaTek MT7621A Dual-Core 880MHz",
        ram: "256 MB DDR3",
        ports: "5x Gigabit Ethernet 10/100/1000",
        storage: "16 MB Flash + microSD slot",
        power: "Passive PoE in / DC Jack 8-30V",
        os: "RouterOS Level 4",
      },
    },
    {
      name: "MikroTik RB4011iGS+RM Enterprise Router",
      slug: "mikrotik-rb4011igs-rm",
      sku: "MK-RB4011-RM",
      price: 3450000,
      originalPrice: 3800000,
      weight: 1500,
      stock: 25,
      categoryId: categories["router"].id,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      shopeeUrl: "https://shopee.co.id",
      tokopediaUrl: "https://tokopedia.com",
      description:
        "Routerboard rackmount 1U enterprise dengan 10 Port Gigabit Ethernet dan 1 Port SFP+ 10Gbps. Ditenagai prosesor Quad-Core 1.4GHz dengan akselerasi hardware IPsec, handal untuk throughput ISP besar.",
      specifications: {
        cpu: "AL21400 Quad-Core 1.4GHz",
        ram: "1 GB RAM",
        ports: "10x Gigabit Ethernet, 1x 10G SFP+",
        formFactor: "Rackmount 1U Casing Metal",
        os: "RouterOS Level 5",
      },
    },
    {
      name: "MikroTik hAP ac2 Dual-Band WiFi Gigabit",
      slug: "mikrotik-hap-ac2",
      sku: "MK-HAPAC2",
      price: 1150000,
      originalPrice: 1250000,
      weight: 500,
      stock: 40,
      categoryId: categories["router"].id,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      shopeeUrl: "https://shopee.co.id",
      tokopediaUrl: "https://tokopedia.com",
      description:
        "Dual-Band concurrent WiFi Access Point & Router (2.4GHz & 5GHz 802.11ac) dengan 5 Port Gigabit Ethernet. Sangat bertenaga dengan CPU Quad-Core 716MHz.",
      specifications: {
        wifi: "2.4GHz 802.11b/g/n & 5GHz 802.11a/n/ac",
        ports: "5x Gigabit Ethernet",
        cpu: "IPQ-4018 Quad-Core 716MHz",
        ram: "128 MB RAM",
      },
    },
    {
      name: "MikroTik Cloud Router Switch CRS326-24G-2S+RM",
      slug: "mikrotik-crs326-24g-2s-rm",
      sku: "MK-CRS326",
      price: 2950000,
      originalPrice: 3200000,
      weight: 2200,
      stock: 15,
      categoryId: categories["router"].id,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      description:
        "Switch distribusi manageable 24 Port Gigabit Ethernet dengan 2 Port SFP+ 10Gbps cage. Dual Boot RouterOS dan SwOS.",
      specifications: {
        ports: "24x Gigabit Ethernet, 2x 10G SFP+",
        switchingCapacity: "88 Gbps",
        os: "Dual-Boot RouterOS / SwOS",
      },
    },
    {
      name: "VSOL V1600GS EPON/GPON OLT 1-Port SFP+",
      slug: "vsol-v1600gs-olt-1port",
      sku: "VSOL-1600GS",
      price: 2850000,
      originalPrice: 3100000,
      weight: 2000,
      stock: 20,
      categoryId: categories["ftth"].id,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      shopeeUrl: "https://shopee.co.id",
      tokopediaUrl: "https://tokopedia.com",
      description:
        "Mini OLT 1 Port PON kapasitas hingga 128 ONT pelanggan, Dual Uplink (1G SFP / 10G SFP+ dan 1GE RJ45). Sangat hemat listrik & stabil untuk ekspansi RT-RW Net fiber optic.",
      specifications: {
        ponPort: "1x PON (GPON / EPON Combo)",
        kapasitas: "Max 128 ONT / ONU",
        uplink: "1x 10GE SFP+ & 1x GE RJ45",
        daya: "Max 20 Watt",
      },
    },
    {
      name: "VSOL V1600D4 EPON OLT 4-Port Standalone",
      slug: "vsol-v1600d4-epon-olt",
      sku: "VSOL-1600D4",
      price: 4750000,
      originalPrice: 5200000,
      weight: 3100,
      stock: 10,
      categoryId: categories["ftth"].id,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      description:
        "OLT 4 Port PON kapasitas hingga 256 ONT, Dual Power Supply AC + DC, 4 Port Uplink Gigabit GE RJ45 dan 4 Port SFP.",
      specifications: {
        ponPort: "4x EPON Port",
        kapasitas: "Max 256 ONT",
        uplink: "4x GE RJ45 + 4x SFP",
      },
    },
    {
      name: "Modem ONT ZTE F670L Dual Band XPON Gigabit",
      slug: "modem-ont-zte-f670l-xpon",
      sku: "ZTE-F670L",
      price: 245000,
      originalPrice: 285000,
      weight: 450,
      stock: 120,
      categoryId: categories["ont"].id,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      shopeeUrl: "https://shopee.co.id",
      tokopediaUrl: "https://tokopedia.com",
      description:
        "Modem ONT XPON (EPON & GPON auto-detect) dengan WiFi Dual-Band AC1200 (2.4G 300Mbps + 5G 867Mbps), 4 Port LAN Gigabit (1GE + 3FE), 1 Port POTS Telp, dan antena eksternal 5dBi.",
      specifications: {
        optik: "SC/UPC XPON (EPON/GPON)",
        lan: "1x GE + 3x FE RJ45",
        wifi: "Dual-Band 2.4GHz & 5GHz AC1200",
        tr069: "Support GenieACS / TR-069 Auto Config",
      },
    },
    {
      name: "Modem ONT VSOL V2801SG Mini Stick Gigabit",
      slug: "modem-ont-vsol-v2801sg",
      sku: "VSOL-V2801SG",
      price: 165000,
      originalPrice: 190000,
      weight: 250,
      stock: 90,
      categoryId: categories["ont"].id,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      description:
        "Modem ONT mini 1 Port Gigabit LAN dengan Chipset Cortina / Realtek. Sangat stabil untuk mode Bridge ke router indoor pelanggan.",
      specifications: {
        optik: "SC/UPC GPON & EPON",
        lan: "1x 10/100/1000Mbps Gigabit",
        mode: "Bridge / Routing / PPPoE",
      },
    },
    {
      name: "Kabel Dropcore 1 Core 3 Seling Preconn 100M",
      slug: "kabel-dropcore-1-core-preconn-100m",
      sku: "FO-DC-100M",
      price: 95000,
      originalPrice: 110000,
      weight: 1800,
      stock: 60,
      categoryId: categories["kabel"].id,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      description:
        "Kabel fiber optik outdoor 1 core 3 kawat seling baja tebal, konektor SC-UPC pabrikan presisi redaman rendah (< 0.25 dB) siap pakai panjang 100 meter.",
      specifications: {
        core: "1 Core G.657A1 Singlemode",
        seling: "3 Kawat Seling Baja Galvanis Outdoor",
        konektor: "SC-UPC to SC-UPC Pabrikan",
        panjang: "100 Meter",
      },
    },
    {
      name: "Kabel Dropcore 1 Core Preconn SC-UPC 150M",
      slug: "kabel-dropcore-1-core-preconn-150m",
      sku: "FO-DC-150M",
      price: 135000,
      originalPrice: 155000,
      weight: 2600,
      stock: 50,
      categoryId: categories["kabel"].id,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      description:
        "Kabel dropcore 1 core preconn 150 meter dengan konektor SC-UPC tahan cuaca dan tarik beban tiang kabel.",
      specifications: {
        panjang: "150 Meter",
        konektor: "SC-UPC to SC-UPC",
      },
    },
    {
      name: "Optical Power Meter (OPM) + Laser VFL 10mW",
      slug: "optical-power-meter-opm-vfl",
      sku: "TOOL-OPM-VFL",
      price: 185000,
      originalPrice: 220000,
      weight: 350,
      stock: 40,
      categoryId: categories["alat"].id,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      description:
        "Alat ukur redaman dBm fiber optik (rentang -70 s/d +10 dBm) komplit dengan senter visual fault locator (VFL 10mW jangkauan 10km) dan lampu senter LED.",
      specifications: {
        rentang: "-70 dBm s/d +10 dBm",
        panjangGelombang: "850, 1300, 1310, 1490, 1550, 1625 nm",
        vfl: "10 mW Laser Merah (10 km)",
      },
    },
    {
      name: "Kotak ODP 8 Port Pole / Wall Mount Komplit",
      slug: "kotak-odp-8-port-komplit",
      sku: "ODP-8P-BOX",
      price: 125000,
      originalPrice: 145000,
      weight: 900,
      stock: 35,
      categoryId: categories["aksesoris"].id,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      description:
        "Optical Distribution Point (ODP) kapasitas 8 adapter SC lengkap dengan klem tiang stainless, kunci, protection sleeve, dan pelindung air outdoor IP65.",
      specifications: {
        kapasitas: "8 Port SC Adapter",
        proteksi: "IP65 Tahan Air & Panas UV",
        aksesoris: "Klem Tiang + Kunci ODP",
      },
    },
  ];

  for (const item of products) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
    console.log(`   • [+] Seeded: ${item.name} (Rp ${item.price.toLocaleString("id-ID")})`);
  }

  // 4. Seed Default Store Settings
  await prisma.storeSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "EugineStore",
      phone: "6281548727257",
      address: "Cibinong, Bogor, Jawa Barat",
      defaultOriginCity: "Bogor",
      qrinApiKey: process.env.QRIN_TOKEN || "",
      bankAccounts: [
        { bank: "BCA", number: "1234567890", holder: "PT Eugine Media Group" },
        { bank: "Mandiri", number: "1330012345678", holder: "PT Eugine Media Group" },
      ],
    },
  });

  console.log("🎉 Seeding complete! All products and admin user initialized.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
