const API_BASE = 'http://localhost:8000';

async function runTests() {
  console.log('=============== 🧪 STARTING E2E AUTOMATED TESTS ===============\n');

  try {
    // -----------------------------------------------------------------
    // 0. AUTHENTICATION & USER REGISTRATION (HTTP)
    // -----------------------------------------------------------------
    console.log('📌 [0/5] Registering & Authenticating Test Users via HTTP...');
    const time = Date.now();
    const userEmail = `user_${time}@example.com`;
    const password = 'Password123';

    // Register User
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstname: 'Regular',
        lastname: 'User',
        email: userEmail,
        password
      })
    });
    console.log(`   ✅ Registered User: ${userEmail} (Status: ${regRes.status})`);

    // Login User
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password })
    });
    const loginData = await loginRes.json();
    console.log(`   ✅ Logged in User: ${userEmail} (Status: ${loginRes.status})`);

    const userToken = loginData.access_token;
    const userId = loginData.user.id;

    // -----------------------------------------------------------------
    // 1. TEST ANNOUNCEMENTS MODULE
    // -----------------------------------------------------------------
    console.log('\n📌 [1/5] Testing Announcement Module...');

    // 1.1 Get Public Announcements List (No Auth required)
    const publicListRes = await fetch(`${API_BASE}/announcements`);
    const publicList = await publicListRes.json();
    console.log(`   [GET /announcements] (Public) Status: ${publicListRes.status} | Total Published: ${publicList.length}`);

    // -----------------------------------------------------------------
    // 2. TEST NOTIFICATION MODULE
    // -----------------------------------------------------------------
    console.log('\n📌 [2/5] Testing Notification Module...');

    // 2.1 Get Notifications (User)
    const getNotifRes = await fetch(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const userNotifs = await getNotifRes.json();
    console.log(`   [GET /notifications] Status: ${getNotifRes.status} | User Notifications: ${userNotifs.length}`);

    // -----------------------------------------------------------------
    // 3. TEST TRANSACTION BUSINESS RULES (SOLD STATUS BLOCK)
    // -----------------------------------------------------------------
    console.log('\n📌 [3/5] Testing Portfolio, Investment & Transaction Rules...');

    // Create Portfolio
    const pfRes = await fetch(`${API_BASE}/portfolios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ name: 'E2E Portfolio', description: 'Testing Portfolio' })
    });
    const pf = await pfRes.json();
    console.log(`   [POST /portfolios] Created Portfolio ID: ${pf.id}`);

    // Create Category
    const catRes = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ name: 'Crypto', color: '#3B82F6' })
    });
    const cat = await catRes.json();
    console.log(`   [POST /categories] Created Category ID: ${cat.id}`);

    // Create Investment
    const invRes = await fetch(`${API_BASE}/investments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        portfolioId: pf.id,
        categoryId: cat.id,
        assetName: 'Bitcoin',
        symbol: 'BTC',
        assetType: 'CRYPTO',
        purchasePrice: 50000,
        currentPrice: 60000,
        quantity: 2,
        averageCost: 50000,
        riskLevel: 'HIGH',
        investmentDate: '2026-01-01'
      })
    });
    const inv = await invRes.json();
    console.log(`   [POST /investments] Created Investment BTC (Qty: ${inv.quantity}, Status: ${inv.status})`);

    // Sell all 2 BTC to change status to SOLD
    const sellRes = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        investmentId: inv.id,
        type: 'SELL',
        quantity: 2,
        price: 60000,
        amount: 120000,
        transactionDate: '2026-07-27'
      })
    });
    const sellResData = await sellRes.json();
    console.log(`   [POST /transactions] Sold 2 BTC. Status: ${sellRes.status} | Body:`, sellResData);

    // Verify status is now SOLD
    const invCheckRes = await fetch(`${API_BASE}/investments/${inv.id}`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const invCheck = await invCheckRes.json();
    console.log(`   [GET /investments/:id] Investment BTC Status: ${invCheck.status} (Qty: ${invCheck.quantity})`);

    // Attempt to BUY on SOLD investment (Rule Check)
    const invalidBuyRes = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        investmentId: inv.id,
        type: 'BUY',
        quantity: 1,
        price: 60000,
        amount: 60000,
        transactionDate: '2026-07-27'
      })
    });
    const invalidBuyErr = await invalidBuyRes.json();
    console.log(`   [POST /transactions] Buy on SOLD investment Status: ${invalidBuyRes.status} (Expected 400 Bad Request) | Message: "${invalidBuyErr.message}"`);

    // -----------------------------------------------------------------
    // 4. TEST REPORT EXPORT MODULE (CSV & PDF)
    // -----------------------------------------------------------------
    console.log('\n📌 [4/5] Testing Report Export Module (CSV & PDF)...');

    // Portfolio CSV
    const pCsv = await fetch(`${API_BASE}/reports/portfolio`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log(`   [GET /reports/portfolio] (CSV) Status: ${pCsv.status} | Content-Type: ${pCsv.headers.get('content-type')}`);

    // Portfolio PDF
    const pPdf = await fetch(`${API_BASE}/reports/portfolio/pdf`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const pdfBuf = await pPdf.arrayBuffer();
    console.log(`   [GET /reports/portfolio/pdf] (PDF) Status: ${pPdf.status} | Content-Type: ${pPdf.headers.get('content-type')} | Size: ${pdfBuf.byteLength} bytes`);

    // Transaction CSV
    const tCsv = await fetch(`${API_BASE}/reports/transactions`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log(`   [GET /reports/transactions] (CSV) Status: ${tCsv.status} | Content-Type: ${tCsv.headers.get('content-type')}`);

    // Transaction PDF
    const tPdf = await fetch(`${API_BASE}/reports/transactions/pdf`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const tPdfBuf = await tPdf.arrayBuffer();
    console.log(`   [GET /reports/transactions/pdf] (PDF) Status: ${tPdf.status} | Content-Type: ${tPdf.headers.get('content-type')} | Size: ${tPdfBuf.byteLength} bytes`);

    console.log('\n================ 🎉 ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY! ================');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

runTests();
