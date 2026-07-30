import { PrismaClient } from '../src/database/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:Popozx@123@localhost:5432/Invest_Project101',
});

const prisma = new PrismaClient({ adapter });

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

  console.log('🌱 Seeding database...');

  // ─── Users ─────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('12345678', 10);

  const testUser = await prisma.user.create({
    data: {
      firstname: 'Pattara',
      lastname: 'Naksakul',
      email: 'test@mail.com',
      phone: '0912345678',
      password: hashedPassword,
      role: 'USER',
      status: 'ACTIVE'
    }
  });
  console.log(`✅ Created user: ${testUser.email}`);

  const adminUser = await prisma.user.create({
    data: {
      firstname: 'Admin',
      lastname: 'System',
      email: 'admin@mail.com',
      phone: '0800000000',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });
  console.log(`✅ Created admin: ${adminUser.email}`);

  // Extra users for admin dashboard
  const user2 = await prisma.user.create({
    data: {
      firstname: 'Siriporn',
      lastname: 'Mala',
      email: 'siriporn@mail.com',
      phone: '0823456789',
      password: hashedPassword,
      role: 'USER',
      status: 'ACTIVE'
    }
  });
  const user3 = await prisma.user.create({
    data: {
      firstname: 'Wichai',
      lastname: 'Boonma',
      email: 'wichai@mail.com',
      phone: '0834567890',
      password: hashedPassword,
      role: 'USER',
      status: 'ACTIVE'
    }
  });
  const user4 = await prisma.user.create({
    data: {
      firstname: 'Nattaporn',
      lastname: 'Kham',
      email: 'nattaporn@mail.com',
      phone: '0845678901',
      password: hashedPassword,
      role: 'USER',
      status: 'SUSPENDED'
    }
  });

  // ─── Categories ────────────────────────────────────────────────────
  const catEnergy = await prisma.category.create({
    data: {
      userId: testUser.id,
      name: 'พลังงาน',
      icon: 'Zap',
      color: '#f59e0b',
      description: 'หุ้นกลุ่มพลังงานและปิโตรเคมี'
    }
  });
  const catFinance = await prisma.category.create({
    data: {
      userId: testUser.id,
      name: 'การเงิน',
      icon: 'Building2',
      color: '#6366f1',
      description: 'หุ้นกลุ่มธนาคารและการเงิน'
    }
  });
  const catTech = await prisma.category.create({
    data: {
      userId: testUser.id,
      name: 'เทคโนโลยี',
      icon: 'Cpu',
      color: '#10b981',
      description: 'หุ้นกลุ่มเทคโนโลยี'
    }
  });
  const catCrypto = await prisma.category.create({
    data: {
      userId: testUser.id,
      name: 'สินทรัพย์ดิจิทัล',
      icon: 'Bitcoin',
      color: '#f97316',
      description: 'คริปโตเคอเรนซี่'
    }
  });
  const catIndex = await prisma.category.create({
    data: {
      userId: testUser.id,
      name: 'ดัชนี',
      icon: 'TrendingUp',
      color: '#8b5cf6',
      description: 'กองทุนดัชนี ETF'
    }
  });
  const catRealEstate = await prisma.category.create({
    data: {
      userId: testUser.id,
      name: 'อสังหาริมทรัพย์',
      icon: 'Home',
      color: '#ec4899',
      description: 'กองทุนอสังหาริมทรัพย์'
    }
  });
  console.log('✅ Created 6 categories');

  // ─── Portfolios ────────────────────────────────────────────────────
  const portThai = await prisma.portfolio.create({
    data: {
      userId: testUser.id,
      name: 'หุ้นไทย',
      description: 'พอร์ตหุ้นในตลาดหลักทรัพย์ไทย',
      color: '#10b981',
      icon: 'briefcase',
      isFavorite: true,
      isDefault: true
    }
  });
  const portForeign = await prisma.portfolio.create({
    data: {
      userId: testUser.id,
      name: 'หุ้นต่างประเทศ',
      description: 'ETF และหุ้นสหรัฐอเมริกา',
      color: '#6366f1',
      icon: 'globe'
    }
  });
  const portCrypto = await prisma.portfolio.create({
    data: {
      userId: testUser.id,
      name: 'คริปโต',
      description: 'สินทรัพย์ดิจิทัล',
      color: '#f59e0b',
      icon: 'bitcoin'
    }
  });
  console.log('✅ Created 3 portfolios');

  // ─── Investments ───────────────────────────────────────────────────
  const invPTTGC = await prisma.investment.create({
    data: {
      portfolioId: portThai.id,
      categoryId: catEnergy.id,
      assetName: 'PTT Global Chemical',
      symbol: 'PTTGC',
      assetType: 'STOCK',
      purchasePrice: 65.5,
      currentPrice: 78.25,
      quantity: 1000,
      averageCost: 65.5,
      riskLevel: 'MEDIUM',
      status: 'ACTIVE',
      investmentDate: new Date('2024-01-25'),
      note: 'เข้าซื้อในจังหวะย่อ'
    }
  });
  const invKBANK = await prisma.investment.create({
    data: {
      portfolioId: portThai.id,
      categoryId: catFinance.id,
      assetName: 'Kasikorn Bank',
      symbol: 'KBANK',
      assetType: 'STOCK',
      purchasePrice: 138.0,
      currentPrice: 155.5,
      quantity: 500,
      averageCost: 138.0,
      riskLevel: 'LOW',
      status: 'ACTIVE',
      investmentDate: new Date('2024-02-01')
    }
  });
  const invSCB = await prisma.investment.create({
    data: {
      portfolioId: portThai.id,
      categoryId: catFinance.id,
      assetName: 'SCB X',
      symbol: 'SCB',
      assetType: 'STOCK',
      purchasePrice: 120.0,
      currentPrice: 132.5,
      quantity: 300,
      averageCost: 120.0,
      riskLevel: 'LOW',
      status: 'ACTIVE',
      investmentDate: new Date('2024-02-10')
    }
  });
  const invGULF = await prisma.investment.create({
    data: {
      portfolioId: portThai.id,
      categoryId: catEnergy.id,
      assetName: 'Gulf Energy',
      symbol: 'GULF',
      assetType: 'STOCK',
      purchasePrice: 42.75,
      currentPrice: 48.0,
      quantity: 2000,
      averageCost: 42.75,
      riskLevel: 'MEDIUM',
      status: 'ACTIVE',
      investmentDate: new Date('2024-03-01'),
      note: 'หุ้นพลังงานทางเลือก'
    }
  });
  const invAAPL = await prisma.investment.create({
    data: {
      portfolioId: portForeign.id,
      categoryId: catTech.id,
      assetName: 'Apple Inc.',
      symbol: 'AAPL',
      assetType: 'STOCK',
      purchasePrice: 182.0,
      currentPrice: 205.5,
      quantity: 50,
      averageCost: 182.0,
      riskLevel: 'LOW',
      status: 'ACTIVE',
      investmentDate: new Date('2024-02-15')
    }
  });
  const invSPY = await prisma.investment.create({
    data: {
      portfolioId: portForeign.id,
      categoryId: catIndex.id,
      assetName: 'S&P 500 ETF',
      symbol: 'SPY',
      assetType: 'ETF',
      purchasePrice: 450.0,
      currentPrice: 512.0,
      quantity: 20,
      averageCost: 450.0,
      riskLevel: 'MEDIUM',
      status: 'ACTIVE',
      investmentDate: new Date('2024-02-20')
    }
  });
  const invADVANC = await prisma.investment.create({
    data: {
      portfolioId: portThai.id,
      categoryId: catTech.id,
      assetName: 'Advanced Info Service',
      symbol: 'ADVANC',
      assetType: 'STOCK',
      purchasePrice: 210.0,
      currentPrice: 235.0,
      quantity: 200,
      averageCost: 210.0,
      riskLevel: 'LOW',
      status: 'ACTIVE',
      investmentDate: new Date('2024-04-01'),
      note: 'หุ้นเทเลคอม'
    }
  });
  const invBTC = await prisma.investment.create({
    data: {
      portfolioId: portCrypto.id,
      categoryId: catCrypto.id,
      assetName: 'Bitcoin',
      symbol: 'BTC',
      assetType: 'CRYPTO',
      purchasePrice: 1800000,
      currentPrice: 2350000,
      quantity: 0.1,
      averageCost: 1800000,
      riskLevel: 'HIGH',
      status: 'ACTIVE',
      investmentDate: new Date('2024-03-10')
    }
  });
  const invETH = await prisma.investment.create({
    data: {
      portfolioId: portCrypto.id,
      categoryId: catCrypto.id,
      assetName: 'Ethereum',
      symbol: 'ETH',
      assetType: 'CRYPTO',
      purchasePrice: 95000,
      currentPrice: 125000,
      quantity: 2,
      averageCost: 95000,
      riskLevel: 'HIGH',
      status: 'ACTIVE',
      investmentDate: new Date('2024-03-15')
    }
  });
  const invSOL = await prisma.investment.create({
    data: {
      portfolioId: portCrypto.id,
      categoryId: catCrypto.id,
      assetName: 'Solana',
      symbol: 'SOL',
      assetType: 'CRYPTO',
      purchasePrice: 5200,
      currentPrice: 6800,
      quantity: 50,
      averageCost: 5200,
      riskLevel: 'HIGH',
      status: 'ACTIVE',
      investmentDate: new Date('2024-05-01'),
      note: 'Layer 1 blockchain'
    }
  });
  console.log('✅ Created 10 investments');

  // ─── Transactions ──────────────────────────────────────────────────
  const txns = [
    {
      investmentId: invPTTGC.id,
      type: 'BUY' as const,
      quantity: 1000,
      price: 65.5,
      amount: 65500,
      transactionDate: new Date('2024-01-25'),
      note: 'เข้าซื้อในจังหวะย่อ'
    },
    {
      investmentId: invKBANK.id,
      type: 'BUY' as const,
      quantity: 500,
      price: 138.0,
      amount: 69000,
      transactionDate: new Date('2024-02-01')
    },
    {
      investmentId: invSCB.id,
      type: 'BUY' as const,
      quantity: 300,
      price: 120.0,
      amount: 36000,
      transactionDate: new Date('2024-02-10')
    },
    {
      investmentId: invAAPL.id,
      type: 'BUY' as const,
      quantity: 50,
      price: 182.0,
      amount: 9100,
      transactionDate: new Date('2024-02-15')
    },
    {
      investmentId: invSPY.id,
      type: 'BUY' as const,
      quantity: 20,
      price: 450.0,
      amount: 9000,
      transactionDate: new Date('2024-02-20')
    },
    {
      investmentId: invPTTGC.id,
      type: 'DIVIDEND' as const,
      quantity: 1000,
      price: 2.5,
      amount: 2500,
      transactionDate: new Date('2024-02-28'),
      note: 'เงินปันผลประจำปี'
    },
    {
      investmentId: invGULF.id,
      type: 'BUY' as const,
      quantity: 2000,
      price: 42.75,
      amount: 85500,
      transactionDate: new Date('2024-03-01'),
      note: 'หุ้นพลังงานทางเลือก'
    },
    {
      investmentId: invBTC.id,
      type: 'BUY' as const,
      quantity: 0.1,
      price: 1800000,
      amount: 180000,
      transactionDate: new Date('2024-03-10')
    },
    {
      investmentId: invETH.id,
      type: 'BUY' as const,
      quantity: 2,
      price: 95000,
      amount: 190000,
      transactionDate: new Date('2024-03-15')
    },
    {
      investmentId: invADVANC.id,
      type: 'BUY' as const,
      quantity: 200,
      price: 210.0,
      amount: 42000,
      transactionDate: new Date('2024-04-01'),
      note: 'หุ้นเทเลคอม'
    },
    {
      investmentId: invKBANK.id,
      type: 'SELL' as const,
      quantity: 100,
      price: 155.0,
      amount: 15500,
      fee: 31,
      transactionDate: new Date('2024-05-10'),
      note: 'ทำกำไรบางส่วน'
    },
    {
      investmentId: invSOL.id,
      type: 'BUY' as const,
      quantity: 50,
      price: 5200,
      amount: 260000,
      transactionDate: new Date('2024-05-01'),
      note: 'Layer 1 blockchain'
    },
    {
      investmentId: invKBANK.id,
      type: 'DIVIDEND' as const,
      quantity: 400,
      price: 4.5,
      amount: 1800,
      transactionDate: new Date('2024-06-15'),
      note: 'เงินปันผลระหว่างกาล'
    },
    {
      investmentId: invPTTGC.id,
      type: 'BUY' as const,
      quantity: 500,
      price: 70.0,
      amount: 35000,
      transactionDate: new Date('2024-06-20'),
      note: 'เพิ่มสัดส่วน'
    },
    {
      investmentId: invSCB.id,
      type: 'DIVIDEND' as const,
      quantity: 300,
      price: 3.2,
      amount: 960,
      transactionDate: new Date('2024-07-01'),
      note: 'เงินปันผล SCB'
    }
  ];
  for (const tx of txns) {
    await prisma.transaction.create({ data: tx });
  }
  console.log(`✅ Created ${txns.length} transactions`);

  // ─── Goals ─────────────────────────────────────────────────────────
  await prisma.goal.createMany({
    data: [
      {
        userId: testUser.id,
        title: 'ซื้อบ้าน',
        description: 'บ้านเดี่ยวชานเมือง พร้อมที่ดิน 50 ตร.ว.',
        targetAmount: 3000000,
        currentAmount: 1465000,
        deadline: new Date('2027-12-31'),
        status: 'IN_PROGRESS'
      },
      {
        userId: testUser.id,
        title: 'เกษียณอายุ',
        description: 'กองทุนเกษียณ เป้า 10 ล้านบาท',
        targetAmount: 10000000,
        currentAmount: 1465000,
        deadline: new Date('2045-01-01'),
        status: 'IN_PROGRESS'
      },
      {
        userId: testUser.id,
        title: 'ซื้อรถยนต์ไฟฟ้า',
        description: 'รถ EV สำหรับใช้งานประจำวัน',
        targetAmount: 1500000,
        currentAmount: 850000,
        deadline: new Date('2025-06-30'),
        status: 'IN_PROGRESS'
      }
    ]
  });
  console.log('✅ Created 3 goals');

  // ─── Notifications ─────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: testUser.id,
        title: 'PTTGC ขึ้น 5%',
        message: 'ราคาหุ้น PTTGC ปรับตัวขึ้น 5% วันนี้ ปิดที่ 78.25 บาท',
        type: 'INVESTMENT',
        isRead: false
      },
      {
        userId: testUser.id,
        title: 'เป้าหมายซื้อรถ 56%',
        message: 'คุณบรรลุ 56% ของเป้าหมายซื้อรถแล้ว ยังขาดอีก 650,000 บาท',
        type: 'GOAL',
        isRead: false
      },
      {
        userId: testUser.id,
        title: 'ตรวจสอบพอร์ตรายสัปดาห์',
        message: 'ครบกำหนดตรวจสอบพอร์ตการลงทุนประจำสัปดาห์แล้ว',
        type: 'REMINDER',
        isRead: true
      },
      {
        userId: testUser.id,
        title: 'BTC ทะลุ 2.3 ล้าน',
        message: 'Bitcoin ราคาพุ่งทะลุ 2.3 ล้านบาทแล้ว กำไร 30%+',
        type: 'INVESTMENT',
        isRead: true
      },
      {
        userId: testUser.id,
        title: 'ปันผล KBANK เข้าแล้ว',
        message: 'เงินปันผลจาก KBANK จำนวน 1,800 บาท เข้าบัญชีแล้ว',
        type: 'INVESTMENT',
        isRead: false
      }
    ]
  });
  console.log('✅ Created 5 notifications');

  // ─── Announcements ─────────────────────────────────────────────────
  await prisma.announcement.createMany({
    data: [
      {
        title: 'ปรับปรุงระบบ 1 ส.ค. 2026',
        message:
          'ระบบจะมีการปรับปรุงในวันที่ 1 สิงหาคม 2026 เวลา 02:00-04:00 น. อาจจะมีการหยุดให้บริการชั่วคราว กรุณาวางแผนการใช้งานล่วงหน้า',
        type: 'MAINTENANCE',
        isPublished: true
      },
      {
        title: 'SET Index ทำ New High',
        message:
          'ตลาดหลักทรัพย์ไทย SET Index ทำจุดสูงสุดใหม่ที่ 1,750 จุด หุ้นกลุ่มธนาคารและพลังงานนำตลาด',
        type: 'MARKET',
        isPublished: true
      },
      {
        title: 'เปิดตัว Feature ใหม่: Goal Tracking',
        message:
          'ตอนนี้คุณสามารถตั้งเป้าหมายทางการเงินและติดตามความคืบหน้าได้แล้วจากหน้า Goals ในเมนูหลัก',
        type: 'NEWS',
        isPublished: true
      }
    ]
  });
  console.log('✅ Created 3 announcements');

  // ─── Activity Logs ─────────────────────────────────────────────────
  await prisma.activityLog.createMany({
    data: [
      {
        userId: testUser.id,
        action: 'LOGIN',
        module: 'auth',
        description: 'เข้าสู่ระบบสำเร็จ',
        ipAddress: '192.168.1.100'
      },
      {
        userId: testUser.id,
        action: 'CREATE',
        module: 'portfolio',
        description: 'สร้าง Portfolio หุ้นไทย',
        ipAddress: '192.168.1.100',
        browser: 'Chrome 126'
      },
      {
        userId: testUser.id,
        action: 'CREATE',
        module: 'investment',
        description: 'เพิ่มการลงทุน PTTGC 1000 หุ้น',
        ipAddress: '192.168.1.100'
      },
      {
        userId: adminUser.id,
        action: 'LOGIN',
        module: 'auth',
        description: 'Admin เข้าสู่ระบบ',
        ipAddress: '127.0.0.1'
      },
      {
        userId: adminUser.id,
        action: 'CREATE',
        module: 'announcement',
        description: 'สร้างประกาศ: ปรับปรุงระบบ',
        ipAddress: '127.0.0.1'
      },
      {
        userId: user2.id,
        action: 'REGISTER',
        module: 'auth',
        description: 'สมัครสมาชิกใหม่',
        ipAddress: '10.0.0.5'
      },
      {
        userId: user3.id,
        action: 'REGISTER',
        module: 'auth',
        description: 'สมัครสมาชิกใหม่',
        ipAddress: '172.16.0.10'
      },
      {
        userId: testUser.id,
        action: 'CREATE',
        module: 'goal',
        description: 'สร้างเป้าหมาย: ซื้อบ้าน',
        ipAddress: '192.168.1.100'
      },
      {
        userId: testUser.id,
        action: 'UPDATE',
        module: 'investment',
        description: 'อัปเดตราคา PTTGC',
        ipAddress: '192.168.1.100'
      },
      {
        userId: user2.id,
        action: 'LOGIN',
        module: 'auth',
        description: 'เข้าสู่ระบบสำเร็จ',
        ipAddress: '10.0.0.5'
      }
    ]
  });
  console.log('✅ Created 10 activity logs');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log(`   📧 Test user: test@mail.com / 12345678`);
  console.log(`   🔑 Admin user: admin@mail.com / 12345678`);
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
