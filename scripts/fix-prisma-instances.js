const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to replace PrismaClient instances
function replacePrismaInstances(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file contains new PrismaClient()
  if (content.includes('new PrismaClient()')) {
    console.log(`Processing: ${filePath}`);
    
    // Replace the import
    content = content.replace(
      /import\s+\{\s*PrismaClient\s*\}\s+from\s+['"]@\/lib\/generated\/prisma['"];?\s*\n/g,
      ''
    );
    
    // Replace the instantiation
    content = content.replace(
      /const\s+prisma\s*=\s*new\s+PrismaClient\(\)\s*;?\s*\n/g,
      ''
    );
    
    // Add the import for the shared prisma instance
    if (!content.includes("import { prisma } from '@/lib/prisma'")) {
      const importMatch = content.match(/import.*from.*['"]/);
      if (importMatch) {
        const lastImportIndex = content.lastIndexOf('import');
        const lastImportEndIndex = content.indexOf('\n', lastImportIndex) + 1;
        content = content.slice(0, lastImportEndIndex) + 
                 "import { prisma } from '@/lib/prisma'\n" + 
                 content.slice(lastImportEndIndex);
      } else {
        content = "import { prisma } from '@/lib/prisma'\n\n" + content;
      }
    }
    
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
  }
}

// Main execution
console.log('🔍 Finding TypeScript files...');
const tsFiles = findTsFiles('./app');
const apiFiles = tsFiles.filter(file => file.includes('/api/') && !file.includes('auth/[...nextauth]'));

console.log(`📁 Found ${apiFiles.length} API files to process`);

apiFiles.forEach(file => {
  replacePrismaInstances(file);
});

console.log('✅ PrismaClient instances replacement completed!');
console.log('\n📝 Next steps:');
console.log('1. Run: npx prisma generate');
console.log('2. Run: npx prisma db push');
console.log('3. Restart your development server'); 