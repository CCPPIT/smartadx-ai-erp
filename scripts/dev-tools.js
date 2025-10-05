#!/usr/bin/env node

/**
 * SmartAdX AI ERP - Development Tools
 * Useful commands for development
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const commands = {
  'db:reset': {
    description: 'Reset database and reseed',
    command: 'npx prisma migrate reset --force && npm run seed'
  },
  'db:studio': {
    description: 'Open Prisma Studio',
    command: 'npx prisma studio'
  },
  'db:migrate': {
    description: 'Create and run migration',
    command: 'npx prisma migrate dev'
  },
  'db:generate': {
    description: 'Generate Prisma Client',
    command: 'npx prisma generate'
  },
  'clean': {
    description: 'Clean build artifacts',
    command: 'rm -rf .next node_modules/.cache'
  },
  'clean:all': {
    description: 'Clean everything (including node_modules)',
    command: 'rm -rf .next node_modules package-lock.json bun.lock'
  },
  'docker:dev': {
    description: 'Start Docker development environment',
    command: 'docker-compose -f docker-compose.dev.yml up'
  },
  'docker:prod': {
    description: 'Start Docker production environment',
    command: 'docker-compose up -d'
  },
  'docker:stop': {
    description: 'Stop Docker containers',
    command: 'docker-compose down'
  },
  'docker:logs': {
    description: 'View Docker logs',
    command: 'docker-compose logs -f'
  },
  'test:api': {
    description: 'Test API endpoints',
    command: 'node scripts/test-api.js'
  },
  'check': {
    description: 'Run type check and lint',
    command: 'npm run lint'
  },
  'format': {
    description: 'Format code',
    command: 'npm run format'
  }
};

function showHelp() {
  console.log('\n🛠️  SmartAdX AI ERP - Development Tools\n');
  console.log('Usage: node scripts/dev-tools.js <command>\n');
  console.log('Available commands:\n');
  
  Object.entries(commands).forEach(([cmd, { description }]) => {
    console.log(`  ${cmd.padEnd(20)} - ${description}`);
  });
  
  console.log('\nExamples:');
  console.log('  node scripts/dev-tools.js db:reset');
  console.log('  node scripts/dev-tools.js docker:dev');
  console.log('  node scripts/dev-tools.js check\n');
}

function runCommand(cmdName) {
  const cmd = commands[cmdName];
  
  if (!cmd) {
    console.error(`❌ Unknown command: ${cmdName}`);
    showHelp();
    process.exit(1);
  }
  
  console.log(`\n🚀 Running: ${cmd.description}\n`);
  console.log(`Command: ${cmd.command}\n`);
  
  try {
    execSync(cmd.command, { stdio: 'inherit' });
    console.log(`\n✅ ${cmd.description} completed successfully\n`);
  } catch (error) {
    console.error(`\n❌ ${cmd.description} failed\n`);
    process.exit(1);
  }
}

// Main
const cmdName = process.argv[2];

if (!cmdName || cmdName === 'help' || cmdName === '--help' || cmdName === '-h') {
  showHelp();
  process.exit(0);
}

runCommand(cmdName);
