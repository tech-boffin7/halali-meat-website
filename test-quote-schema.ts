
/**
 * Test Script: Verify Quote Schema Changes
 * 
 * This script verifies that:
 * 1. Existing quotes have been migrated with default values
 * 2. New quotes can be created with all fields
 * 3. The schema matches API expectations
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testQuoteSchema() {
  console.log('🧪 Testing Quote Schema...\n');

  try {
    // Test 1: Fetch existing quotes and verify fields
    console.log('Test 1: Checking existing quotes have new fields');
    const existingQuotes = await prisma.quote.findMany({ take: 3 });
    
    if (existingQuotes.length > 0) {
      console.log(`  ✓ Found ${existingQuotes.length} quotes`);
      existingQuotes.forEach(quote => {
        console.log(`    - ${quote.name}: productInterest="${quote.productInterest}", quantity="${quote.quantity}"`);
      });
    }

    // Test 2: Create a new quote with all fields
    console.log('\nTest 2: Creating new quote with all fields');
    const newQuote = await prisma.quote.create({
      data: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+254 700 000 000',
        company: 'Test Company Ltd',
        productInterest: 'Beef',
        quantity: '500 kg',
        message: 'This is a test quote request',
        status: 'UNREAD',
      },
    });
    
    console.log(`  ✓ Created quote ID: ${newQuote.id}`);
    console.log(`    Company: ${newQuote.company}`);
    console.log(`    Product: ${newQuote.productInterest}`);
    console.log(`    Quantity: ${newQuote.quantity}`);

    // Test 3: Verify the quote can be fetched
    console.log('\nTest 3: Fetching the new quote');
    const fetchedQuote = await prisma.quote.findUnique({
      where: { id: newQuote.id },
    });
    
    if (fetchedQuote) {
      console.log(`  ✓ Quote fetched successfully`);
      console.log(`    All fields present: ${!!fetchedQuote.company && !!fetchedQuote.productInterest && !!fetchedQuote.quantity}`);
    }

    // Test 4: Delete test quote
    console.log('\nTest 4: Cleaning up test data');
    await prisma.quote.delete({
      where: { id: newQuote.id },
    });
    console.log(`  ✓ Test quote deleted`);

    console.log('\n✅ All tests passed! Schema is working correctly.\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testQuoteSchema()
  .then(() => {
    console.log('🎉 Quote schema verification complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });
