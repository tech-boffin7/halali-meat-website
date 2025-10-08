import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Adjust path as needed

const QUOTES_FILE = path.join(process.cwd(), 'src', 'data', 'quotes.json');

// Helper function to read quotes
async function readQuotes() {
  try {
    const data = await fs.readFile(QUOTES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading quotes file:', error);
    return [];
  }
}

// Helper function to write quotes
async function writeQuotes(quotes: any[]) {
  try {
    await fs.writeFile(QUOTES_FILE, JSON.stringify(quotes, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing quotes file:', error);
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Forbidden: You do not have administrative privileges." }, { status: 403 });
  }

  const quotes = await readQuotes();
  return NextResponse.json(quotes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, productInterest, quantity, message } = body;

    // Basic validation
    if (!name || !email || !productInterest || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save quote to file
    const quotes = await readQuotes();
    const newQuote = {
      id: Date.now().toString(), // Simple unique ID
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: phone || 'N/A',
      company: company || 'N/A',
      productInterest,
      quantity,
      message: message || 'N/A',
      status: 'pending', // Add a status for management
    };
    quotes.push(newQuote);
    await writeQuotes(quotes);

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
      secure: process.env.EMAIL_SERVER_PORT === '465',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO || process.env.EMAIL_FROM,
      subject: `New Quote Request from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Product Interest:</strong> ${productInterest}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Additional Details:</strong> ${message || 'N/A'}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Quote request sent successfully!', quote: newQuote }, { status: 200 });

  } catch (error) {
    console.error('Quote API Error:', error);
    if (error instanceof Error && error.message.includes('Invalid login')) {
      return NextResponse.json({ error: 'Authentication failed for email server.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden: You do not have administrative privileges." }, { status: 403 });
    }
  
    try {
      const { id, status } = await request.json();
      const quotes = await readQuotes();
      const quoteIndex = quotes.findIndex((q: any) => q.id === id);
  
      if (quoteIndex === -1) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      }
  
      quotes[quoteIndex].status = status;
      await writeQuotes(quotes);
  
      return NextResponse.json(quotes[quoteIndex]);
    } catch (error) {
      console.error('Error updating quote:', error);
      return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
    }
  }
  
  export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden: You do not have administrative privileges." }, { status: 403 });
    }
  
    try {
      const { id } = await request.json();
      const quotes = await readQuotes();
      const filteredQuotes = quotes.filter((q: any) => q.id !== id);
  
      if (quotes.length === filteredQuotes.length) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      }
  
      await writeQuotes(filteredQuotes);
  
      return NextResponse.json({ message: 'Quote deleted successfully' });
    } catch (error) {
      console.error('Error deleting quote:', error);
      return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
    }
  }