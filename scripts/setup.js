#!/usr/bin/env node

/**
 * SmartAdX AI ERP - Setup Script
 * Automated setup for development environment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    return false;
  }
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  log('\n🚀 SmartAdX AI ERP - Setup Script\n', colors.bright + colors.blue);

  // Step 1: Check Node.js version
  log('📋 Step 1: Checking Node.js version...', colors.yellow);
  const nodeVersion = process.version;
  log(`   Node.js version: ${nodeVersion}`, colors.green);

  // Step 2: Install dependencies
  log('\n📦 Step 2: Installing dependencies...', colors.yellow);
  const useNpm = await question('   Use npm or bun? (npm/bun) [npm]: ');
  const packageManager = useNpm.toLowerCase() === 'bun' ? 'bun' : 'npm';
  
  log(`   Installing with ${packageManager}...`);
  if (exec(`${packageManager} install`)) {
    log('   ✅ Dependencies installed successfully', colors.green);
  } else {
    log('   ❌ Failed to install dependencies', colors.red);
    process.exit(1);
  }

  // Step 3: Setup environment variables
  log('\n⚙️  Step 3: Setting up environment variables...', colors.yellow);
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('   ✅ Created .env.local from .env.example', colors.green);
      log('   ⚠️  Please edit .env.local with your actual values', colors.yellow);
    } else {
      log('   ⚠️  .env.example not found, skipping...', colors.yellow);
    }
  } else {
    log('   ℹ️  .env.local already exists', colors.blue);
  }

  // Step 4: Generate Prisma Client
  log('\n🗄️  Step 4: Generating Prisma Client...', colors.yellow);
  if (exec('npx prisma generate')) {
    log('   ✅ Prisma Client generated successfully', colors.green);
  } else {
    log('   ❌ Failed to generate Prisma Client', colors.red);
    process.exit(1);
  }

  // Step 5: Run database migrations
  log('\n🔄 Step 5: Running database migrations...', colors.yellow);
  const runMigrations = await question('   Run migrations? (y/n) [y]: ');
  
  if (runMigrations.toLowerCase() !== 'n') {
    if (exec('npx prisma migrate dev --name init')) {
      log('   ✅ Migrations completed successfully', colors.green);
    } else {
      log('   ⚠️  Migrations failed or already applied', colors.yellow);
    }
  }

  // Step 6: Seed database
  log('\n🌱 Step 6: Seeding database...', colors.yellow);
  const seedDb = await question('   Seed database with sample data? (y/n) [y]: ');
  
  if (seedDb.toLowerCase() !== 'n') {
    if (exec('npm run seed')) {
      log('   ✅ Database seeded successfully', colors.green);
    } else {
      log('   ⚠️  Seeding failed', colors.yellow);
    }
  }

  // Step 7: Summary
  log('\n✨ Setup Complete!', colors.bright + colors.green);
  log('\n📝 Next Steps:', colors.bright);
  log('   1. Edit .env.local with your API keys');
  log('   2. Run: npm run dev');
  log('   3. Open: http://localhost:3000');
  log('\n📚 Documentation:', colors.bright);
  log('   - Installation Guide: INSTALLATION_GUIDE.md');
  log('   - API Documentation: API_DOCUMENTATION.md');
  log('   - Docker Guide: DOCKER_GUIDE.md');
  log('\n🎉 Happy Coding!\n', colors.bright + colors.blue);

  rl.close();
}

// Run setup
setup().catch(error => {
  log(`\n❌ Setup failed: ${error.message}`, colors.red);
  process.exit(1);
});
