#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

console.log('🧪 Testing React Native Story Widget package...\n');

// Check if lib directory exists
const libDir = path.join(__dirname, '..', 'lib');
if (!fs.existsSync(libDir)) {
  console.error('❌ lib directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Check if main entry file exists
const mainFile = path.join(libDir, 'index.js');
if (!fs.existsSync(mainFile)) {
  console.error('❌ Main entry file (lib/index.js) not found.');
  process.exit(1);
}

// Check if types exist
const typesFile = path.join(libDir, 'index.d.ts');
if (!fs.existsSync(typesFile)) {
  console.error('❌ Type definitions (lib/index.d.ts) not found.');
  process.exit(1);
}

console.log('✅ Build files exist');

// Test if package can be packed
try {
  console.log('🏗️  Testing package creation...');
  const result = execSync('npm pack --dry-run', {
    encoding: 'utf8',
    cwd: path.join(__dirname, '..'),
  });

  if (result.includes('Tarball Contents')) {
    console.log('✅ Package can be created successfully');
  }
} catch (error) {
  console.error('❌ Package creation failed:', error.message);
  process.exit(1);
}

// Check package.json validity
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'),
  );

  const requiredFields = [
    'name',
    'version',
    'main',
    'types',
    'peerDependencies',
  ];
  const missingFields = requiredFields.filter(field => !packageJson[field]);

  if (missingFields.length > 0) {
    console.error(
      '❌ Missing required package.json fields:',
      missingFields.join(', '),
    );
    process.exit(1);
  }

  console.log('✅ package.json is valid');
} catch (error) {
  console.error('❌ Invalid package.json:', error.message);
  process.exit(1);
}

// Try to require the built package
try {
  const packagePath = path.join(__dirname, '..', 'lib', 'index.js');
  const pkg = require(packagePath);

  const expectedExports = [
    'Story',
    'StoryGroup',
    'StoryContext',
    'StoryMediaControlContext',
  ];
  const missingExports = expectedExports.filter(exp => !pkg[exp]);

  if (missingExports.length > 0) {
    console.error('❌ Missing exports:', missingExports.join(', '));
    process.exit(1);
  }

  console.log('✅ All expected exports are available');
} catch (error) {
  console.error('❌ Failed to load package:', error.message);
  process.exit(1);
}

console.log('\n🎉 Package validation successful!');
console.log('\n📦 To create a local package for testing:');
console.log('   npm run pack-local');
console.log('\n📖 See LOCAL_TESTING.md for detailed testing instructions.');
