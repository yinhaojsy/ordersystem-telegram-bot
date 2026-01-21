#!/usr/bin/env node

/**
 * Environment Variables Checker
 * Run this script to validate your .env configuration
 * 
 * Usage: node check-env.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const REQUIRED_VARS = [
  {
    name: 'TELEGRAM_BOT_TOKEN',
    description: 'Telegram bot token from @BotFather',
    validate: (val) => val && val.includes(':'),
    example: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz'
  },
  {
    name: 'TELEGRAM_NOTIFICATION_CHAT_ID',
    description: 'Chat ID for notifications',
    validate: (val) => val && !isNaN(val),
    example: '123456789 or -987654321'
  },
  {
    name: 'OPENAI_API_KEY',
    description: 'OpenAI API key',
    validate: (val) => val && val.startsWith('sk-'),
    example: 'sk-proj-...'
  },
  {
    name: 'ORDER_SYSTEM_API_URL',
    description: 'Order system API URL',
    validate: (val) => val && val.startsWith('http'),
    example: 'http://localhost:3000/api'
  },
  {
    name: 'ORDER_SYSTEM_AUTH_TOKEN',
    description: 'Order system authentication token',
    validate: (val) => val && val.length > 20,
    example: 'eyJhbGciOiJ...'
  },
  {
    name: 'WEBHOOK_PORT',
    description: 'Webhook server port',
    validate: (val) => val && !isNaN(val) && val > 0 && val < 65536,
    example: '3001'
  },
  {
    name: 'WEBHOOK_SECRET',
    description: 'Webhook authentication secret',
    validate: (val) => val && val.length >= 16,
    example: 'your-secure-random-secret'
  }
];

console.log('\n🔍 Checking Telegram Bot Environment Configuration...\n');

let hasErrors = false;
let hasWarnings = false;

// Check if .env file exists
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('   Create a .env file in the project root.');
  console.log('   See ENV_TEMPLATE.md for reference.\n');
  process.exit(1);
}

console.log('✅ .env file found\n');

// Check each required variable
REQUIRED_VARS.forEach(({ name, description, validate, example }) => {
  const value = process.env[name];
  
  if (!value) {
    console.log(`❌ ${name}`);
    console.log(`   Missing: ${description}`);
    console.log(`   Example: ${example}\n`);
    hasErrors = true;
  } else if (!validate(value)) {
    console.log(`⚠️  ${name}`);
    console.log(`   Invalid format: ${description}`);
    console.log(`   Current: ${value.substring(0, 20)}...`);
    console.log(`   Example: ${example}\n`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${name}`);
    // Show partial value for security
    const displayValue = value.length > 30 
      ? value.substring(0, 15) + '...' + value.substring(value.length - 5)
      : value;
    console.log(`   ${displayValue}\n`);
  }
});

// Additional checks
console.log('📋 Additional Checks:\n');

// Check webhook secret strength
const secret = process.env.WEBHOOK_SECRET;
if (secret) {
  if (secret.length < 24) {
    console.log('⚠️  WEBHOOK_SECRET is too short (< 24 characters)');
    console.log('   Generate a stronger secret: openssl rand -base64 32\n');
    hasWarnings = true;
  } else if (secret.includes('change-this') || secret.includes('your-')) {
    console.log('⚠️  WEBHOOK_SECRET appears to be a placeholder');
    console.log('   Generate a real secret: openssl rand -base64 32\n');
    hasWarnings = true;
  } else {
    console.log('✅ WEBHOOK_SECRET looks secure\n');
  }
}

// Check user mapping file
const userMappingPath = join(__dirname, 'src', 'config', 'userMapping.js');
if (!existsSync(userMappingPath)) {
  console.log('⚠️  User mapping file not found');
  console.log('   Create: src/config/userMapping.js');
  console.log('   See USER_MAPPING_SETUP.md for details\n');
  hasWarnings = true;
} else {
  console.log('✅ User mapping file exists\n');
}

// Summary
console.log('═══════════════════════════════════════════════════\n');

if (hasErrors) {
  console.log('❌ Configuration has ERRORS - please fix them before running the bot\n');
  console.log('📚 Resources:');
  console.log('   - ENV_TEMPLATE.md - Complete template');
  console.log('   - SETUP_CHECKLIST.md - Step-by-step guide');
  console.log('   - ENV_QUICK_REFERENCE.md - Quick reference\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Configuration has WARNINGS - bot may work but should be improved\n');
  console.log('📚 Resources:');
  console.log('   - ENV_TEMPLATE.md - Complete template');
  console.log('   - SETUP_CHECKLIST.md - Step-by-step guide\n');
  process.exit(0);
} else {
  console.log('✅ All checks passed! Your configuration looks good.\n');
  console.log('🚀 Next steps:');
  console.log('   1. Make sure Order System is running');
  console.log('   2. Start the bot: npm start');
  console.log('   3. Test in Telegram: /start\n');
  process.exit(0);
}
