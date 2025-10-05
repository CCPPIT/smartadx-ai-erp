#!/usr/bin/env node

/**
 * SmartAdX AI ERP - API Testing Script
 * Quick API endpoint testing
 */

const http = require('http');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testEndpoint(method, path, data = null) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body ? JSON.parse(body) : null,
        });
      });
    });

    req.on('error', (error) => {
      resolve({ error: error.message });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  log('\n🧪 SmartAdX AI ERP - API Testing\n', colors.blue);
  log(`Testing API at: ${BASE_URL}\n`);

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      path: '/api/health',
      expectedStatus: 200,
    },
    {
      name: 'Register User',
      method: 'POST',
      path: '/api/auth/register',
      data: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'TestPass123!',
      },
      expectedStatus: 201,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    process.stdout.write(`Testing: ${test.name}... `);

    const result = await testEndpoint(test.method, test.path, test.data);

    if (result.error) {
      log(`❌ FAILED (${result.error})`, colors.red);
      failed++;
      continue;
    }

    if (result.status === test.expectedStatus) {
      log(`✅ PASSED (${result.status})`, colors.green);
      passed++;
    } else {
      log(`❌ FAILED (Expected ${test.expectedStatus}, got ${result.status})`, colors.red);
      failed++;
    }
  }

  log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    log('🎉 All tests passed!\n', colors.green);
    process.exit(0);
  } else {
    log('❌ Some tests failed\n', colors.red);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}\n`, colors.red);
  process.exit(1);
});
