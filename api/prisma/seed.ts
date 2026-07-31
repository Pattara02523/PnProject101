import * as $Class from '../src/database/generated/prisma/internal/class';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:Popozx@123@localhost:5432/Invest_Project101',
});

const PrismaClient = $Class.getPrismaClientClass();
const prisma = new PrismaClient({ adapter });

async function seedUserData(userId: string, userIndex: number) {
  // 1. Categories
  const catEnergy = await prisma.category.create({
    data: {
      userId,
      name: 'พลังงาน',
      icon: 'Zap',
      color: '#f59e0b',
      description: 'หุ้นกลุ่มพลังงานและปิโตรเคมี',
    },
  });

  const catFinance = await prisma.category.create({
    data: {
      userId,
      name: 'การเงิน',
      icon: 'Building2',
      color: '#6366f1',
      description: 'หุ้นกลุ่มธนาคารและการเงิน',
    },
  });

  const catTech = await prisma.category.create({
    data: {
      userId,
      name: 'เทคโนโลยี',
      icon: 'Cpu',
      color: '#10b981',
      description: 'หุ้นกลุ่มเทคโนโลยี',
    },
  });

  const catCrypto = await prisma.category.create({
    data: {
      userId,
      name: 'สินทรัพย์ดิจิทัล',
      icon: 'Bitcoin',
      color: '#f97316',
      description: 'คริปโตเคอเรนซี่',
    },
  });

  // 2. Portfolios
  const portThai = await prisma.portfolio.create({
    data: {
      userId,
      name: 'หุ้นไทย',
      description: 'พอร์ตหุ้นในตลาดหลักทรัพย์ไทย',
      color: '#10b981',
      icon: 'briefcase',
      isFavorite: true,
      isDefault: true,
    },
  });

  const portForeign = await prisma.portfolio.create({
    data: {
      userId,
      name: 'หุ้นต่างประเทศ',
      description: 'ETF และหุ้นสหรัฐอเมริกา',
      color: '#6366f1',
      icon: 'globe',
    },
  });

  const portCrypto = await prisma.portfolio.create({
    data: {
      userId,
      name: 'คริปโต',
      description: 'สินทรัพย์ดิจิทัล',
      color: '#f59e0b',
      icon: 'bitcoin',
    },
  });

  // 3. Investments (dates spread across 2026 for progressive growth from Jan -> Jul)
  const invPTT = await prisma.investment.create({
    data: {
      portfolioId: portThai.id,
      categoryId: catEnergy.id,
      assetName: 'PTT Public Company',
      symbol: 'PTT',
      assetType: 'STOCK',
      purchasePrice: 32.5,
      currentPrice: 38.0,
      quantity: 2000,
      averageCost: 32.5,
      riskLevel: 'MEDIUM',
      status: 'ACTIVE',
      investmentDate: new Date('2026-01-15'),
      note: 'สะสม ม.ค.',
    },
  });

  const invKBANK = await prisma.investment.create({
    data: {
      portfolioId: portThai.id,
      categoryId: catFinance.id,
      assetName: 'Kasikorn Bank',
      symbol: 'KBANK',
      assetType: 'STOCK',
      purchasePrice: 135.0,
      currentPrice: 155.0,
      quantity: 600,
      averageCost: 135.0,
      riskLevel: 'LOW',
      status: 'ACTIVE',
      investmentDate: new Date('2026-02-10'),
      note: 'สะสม ก.พ.',
    },
  });

  const invAAPL = await prisma.investment.create({
    data: {
      portfolioId: portForeign.id,
      categoryId: catTech.id,
      assetName: 'Apple Inc.',
      symbol: 'AAPL',
      assetType: 'STOCK',
      purchasePrice: 180.0,
      currentPrice: 225.0,
      quantity: 50,
      averageCost: 180.0,
      riskLevel: 'LOW',
      status: 'ACTIVE',
      investmentDate: new Date('2026-03-15'),
      note: 'สะสม มี.ค.',
    },
  });

  const invNVDA = await prisma.investment.create({
    data: {
      portfolioId: portForeign.id,
      categoryId: catTech.id,
      assetName: 'NVIDIA Corporation',
      symbol: 'NVDA',
      assetType: 'STOCK',
      purchasePrice: 110.0,
      currentPrice: 142.0,
      quantity: 100,
      averageCost: 110.0,
      riskLevel: 'HIGH',
      status: 'ACTIVE',
      investmentDate: new Date('2026-04-12'),
      note: 'สะสม เม.ย.',
    },
  });

  const invBTC = await prisma.investment.create({
    data: {
      portfolioId: portCrypto.id,
      categoryId: catCrypto.id,
      assetName: 'Bitcoin',
      symbol: 'BTC',
      assetType: 'CRYPTO',
      purchasePrice: 2100000,
      currentPrice: 2480000,
      quantity: 0.12,
      averageCost: 2100000,
      riskLevel: 'HIGH',
      status: 'ACTIVE',
      investmentDate: new Date('2026-05-18'),
      note: 'สะสม พ.ค.',
    },
  });

  const invETH = await prisma.investment.create({
    data: {
      portfolioId: portCrypto.id,
      categoryId: catCrypto.id,
      assetName: 'Ethereum',
      symbol: 'ETH',
      assetType: 'CRYPTO',
      purchasePrice: 105000,
      currentPrice: 132000,
      quantity: 2.0,
      averageCost: 105000,
      riskLevel: 'HIGH',
      status: 'ACTIVE',
      investmentDate: new Date('2026-06-20'),
      note: 'สะสม มิ.ย.',
    },
  });

  // 4. Transactions (spread across 2026)
  await prisma.transaction.createMany({
    data: [
      {
        investmentId: invPTT.id,
        type: 'BUY',
        quantity: 2000,
        price: 32.5,
        amount: 65000,
        transactionDate: new Date('2026-01-15'),
        note: 'ซื้อเก็บเข้าพอร์ต ม.ค.',
      },
      {
        investmentId: invKBANK.id,
        type: 'BUY',
        quantity: 600,
        price: 135.0,
        amount: 81000,
        transactionDate: new Date('2026-02-10'),
        note: 'ซื้อ ก.พ.',
      },
      {
        investmentId: invAAPL.id,
        type: 'BUY',
        quantity: 50,
        price: 180.0,
        amount: 9000,
        transactionDate: new Date('2026-03-15'),
        note: 'ซื้อ มี.ค.',
      },
      {
        investmentId: invNVDA.id,
        type: 'BUY',
        quantity: 100,
        price: 110.0,
        amount: 11000,
        transactionDate: new Date('2026-04-12'),
        note: 'ซื้อ เม.ย.',
      },
      {
        investmentId: invBTC.id,
        type: 'BUY',
        quantity: 0.12,
        price: 2100000,
        amount: 252000,
        transactionDate: new Date('2026-05-18'),
        note: 'ซื้อ พ.ค.',
      },
      {
        investmentId: invETH.id,
        type: 'BUY',
        quantity: 2.0,
        price: 105000,
        amount: 210000,
        transactionDate: new Date('2026-06-20'),
        note: 'ซื้อ มิ.ย.',
      },
      {
        investmentId: invPTT.id,
        type: 'DIVIDEND',
        quantity: 2000,
        price: 1.5,
        amount: 3000,
        transactionDate: new Date('2026-07-10'),
        note: 'รับปันผล ก.ค.',
      },
    ],
  });

  // 5. Goals
  await prisma.goal.createMany({
    data: [
      {
        userId,
        title: `เป้าหมายการออม ${userIndex > 0 ? `#${userIndex}` : 'หลัก'}`,
        description: 'เป้าหมายเงินออมฉุกเฉิน 6 เดือน',
        targetAmount: 500000,
        currentAmount: 285000,
        deadline: new Date('2026-12-31'),
        status: 'IN_PROGRESS',
      },
      {
        userId,
        title: 'กองทุนเกษียณอายุ',
        description: 'สะสมเงินเกษียณในระยะยาว',
        targetAmount: 5000000,
        currentAmount: 1200000,
        deadline: new Date('2040-01-01'),
        status: 'IN_PROGRESS',
      },
      {
        userId,
        title: 'ดาวน์บ้านใหม่',
        description: 'เป้าหมายเงินดาวน์บ้านเดี่ยว',
        targetAmount: 1200000,
        currentAmount: 950000,
        deadline: new Date('2027-06-30'),
        status: 'IN_PROGRESS',
      },
    ],
  });

  // 6. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId,
        title: 'NVDA พุ่งขึ้น 8%',
        message: 'ราคา NVIDIA ปรับตัวขึ้น 8% ในคืนนี้ สู่ระดับ $142.00',
        type: 'INVESTMENT',
        isRead: false,
      },
      {
        userId,
        title: 'เป้าหมายดาวน์บ้านบรรลุ 79%',
        message: 'คุณออมเงินได้ 79% ของเป้าหมายดาวน์บ้านแล้ว',
        type: 'GOAL',
        isRead: false,
      },
      {
        userId,
        title: 'ทบทวนสัดส่วนพอร์ต',
        message: 'ครบรอบ 1 เดือน ควรเข้ามารีวิวสัดส่วนการลงทุน',
        type: 'REMINDER',
        isRead: true,
      },
    ],
  });

  // 7. Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId,
        action: 'LOGIN',
        module: 'auth',
        description: 'เข้าสู่ระบบสำเร็จ',
        ipAddress: `192.168.1.${100 + userIndex}`,
      },
      {
        userId,
        action: 'CREATE',
        module: 'investment',
        description: 'เพิ่มการลงทุน NVDA',
        ipAddress: `192.168.1.${100 + userIndex}`,
      },
    ],
  });
}

async function main() {
  console.log('🧹 Cleaning existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.category.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Seeding database with 2026 progressive timeline...');

  const hashedPassword = await bcrypt.hash('12345678', 10);

  // ─── 1. Primary Test User (test@mail.com) ───────────────────────────
  const testUser = await prisma.user.create({
    data: {
      firstname: 'Pattara',
      lastname: 'Naksakul',
      email: 'test@mail.com',
      phone: '0912345678',
      password: hashedPassword,
      role: 'USER',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Created primary user: test@mail.com`);
  await seedUserData(testUser.id, 0);

  // ─── 2. Admin User (admin@mail.com) ─────────────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      firstname: 'Admin',
      lastname: 'System',
      email: 'admin@mail.com',
      phone: '0800000000',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Created admin user: admin@mail.com`);

  // ─── 3. Multiple Test Users (test01@mail.com to test10@mail.com) ───
  const userNames = [
    { first: 'Somsak', last: 'Jaiyut' },
    { first: 'Wipa', last: 'Sukree' },
    { first: 'Kittisak', last: 'Kaewkla' },
    { first: 'Narumon', last: 'Srinuan' },
    { first: 'Prasert', last: 'Thongon' },
    { first: 'Apinya', last: 'Wongsuwan' },
    { first: 'Chaiwat', last: 'Rungruang' },
    { first: 'Malee', last: 'Boonmee' },
    { first: 'Thanakorn', last: 'Sirisopon' },
    { first: 'Sudarat', last: 'Phomjan' },
  ];

  for (let i = 1; i <= 10; i++) {
    const numStr = i < 10 ? `0${i}` : `${i}`;
    const email = `test${numStr}@mail.com`;
    const nameInfo = userNames[i - 1];

    const u = await prisma.user.create({
      data: {
        firstname: nameInfo.first,
        lastname: nameInfo.last,
        email,
        phone: `08${i.toString().padStart(8, '0')}`,
        password: hashedPassword,
        role: 'USER',
        status: i === 9 ? 'SUSPENDED' : 'ACTIVE',
      },
    });

    await seedUserData(u.id, i);
    console.log(`✅ Created test user ${i}/10: ${email}`);
  }

  // ─── 4. Announcements ───────────────────────────────────────────────
  await prisma.announcement.createMany({
    data: [
      {
        title: 'ปรับปรุงระบบประมวลผล',
        message: 'ระบบจะปิดปรับปรุงในวันอาทิตย์นี้ เวลา 02:00 - 04:00 น.',
        type: 'MAINTENANCE',
        isPublished: true,
      },
      {
        title: 'ตลาดหุ้นทำนิวไฮ',
        message: 'ดัชนีหุ้นเทคโนโลยีสหรัฐฯ ปรับตัวขึ้นสูงสุดในรอบปี',
        type: 'MARKET',
        isPublished: true,
      },
      {
        title: 'อัปเดตระบบ Analytics ใหม่',
        message: 'พบกับกราฟสรุปสัดส่วนการลงทุนและเป้าหมายการเงินรูปแบบใหม่ในหน้า Analytics',
        type: 'NEWS',
        isPublished: true,
      },
    ],
  });
  console.log('✅ Created announcements');

  console.log('');
  console.log('🎉 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
