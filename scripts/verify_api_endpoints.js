const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function verifyEndpoints() {
  console.log('--- 1. Testing /api/track-order for Cherukuri Nagarjun (KG-20261123-7454) ---');
  const trackRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/track-order?code=KG-20261123-7454',
    method: 'GET'
  });
  console.log('Track Status:', trackRes.status);
  console.log('Track Orders Count:', trackRes.data.orders ? trackRes.data.orders.length : 0);
  if (trackRes.data.orders && trackRes.data.orders[0]) {
    console.log('Found Order:', trackRes.data.orders[0].order_code, trackRes.data.orders[0].customer_name, trackRes.data.orders[0].status);
  }

  console.log('\n--- 2. Testing /api/list-orders (Admin) ---');
  const listRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/list-orders',
    method: 'GET',
    headers: {
      'x-admin-password': 'changeme'
    }
  });
  console.log('Admin List Status:', listRes.status);
  console.log('Admin Total Orders:', listRes.data.total);
  if (listRes.data.orders && listRes.data.orders.length > 0) {
    console.log('Admin Orders in Ledger:', listRes.data.orders.map(o => `${o.order_code} (${o.customer_name}) - ₹${o.amount}`));
  }

  console.log('\n--- 3. Testing /api/create-order ---');
  const createRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/create-order',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'వెంకటేశ్వర రావు',
    phone: '9848123456',
    address: 'శ్రీకాకుళం టౌన్, PIN: 532001',
    amount: 2500,
    payment_ref: 'UTR998877665544',
    items: [{ name: 'కూర్మగ్రామ దేశీ బియ్యం', quantity: 1, price: 2500, unit: '25kg', subtotal: 2500 }]
  });
  console.log('Create Status:', createRes.status);
  console.log('Created Order:', createRes.data.order_code, createRes.data.name, 'Amount: ₹' + createRes.data.amount);

  console.log('\n--- 4. Retesting Admin List to confirm new order count ---');
  const listRes2 = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/list-orders',
    method: 'GET',
    headers: {
      'x-admin-password': 'changeme'
    }
  });
  console.log('Updated Admin Total Orders:', listRes2.data.total);
  console.log('All Orders:', listRes2.data.orders.map(o => `${o.order_code} (${o.customer_name})`));
}

module.exports = { verifyEndpoints };
if (require.main === module) {
  verifyEndpoints().catch(console.error);
}
