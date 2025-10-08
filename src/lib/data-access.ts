import fs from 'fs/promises';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'dynamic-products.json');
const QUOTES_FILE = path.join(process.cwd(), 'src', 'data', 'quotes.json');
const CONTACT_MESSAGES_FILE = path.join(process.cwd(), 'src', 'data', 'contact-messages.json');

export async function getProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

export async function getQuotes() {
  try {
    const data = await fs.readFile(QUOTES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading quotes file:', error);
    return [];
  }
}

export async function getContactMessages() {
  try {
    const data = await fs.readFile(CONTACT_MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contact messages file:', error);
    return [];
  }
}
