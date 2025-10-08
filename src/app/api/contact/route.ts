import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust path as needed

const CONTACT_MESSAGES_FILE = path.join(process.cwd(), 'src', 'data', 'contact-messages.json');

// Helper function to read contact messages
async function readContactMessages() {
  try {
    const data = await fs.readFile(CONTACT_MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contact messages file:', error);
    return [];
  }
}

// Helper function to write contact messages
async function writeContactMessages(messages: any[]) {
  try {
    await fs.writeFile(CONTACT_MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing contact messages file:', error);
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Forbidden: You do not have administrative privileges." }, { status: 403 });
  }

  const messages = await readContactMessages();
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save contact message to file
    const messages = await readContactMessages();
    const newMessage = {
      id: Date.now().toString(), // Simple unique ID
      timestamp: new Date().toISOString(),
      name,
      email,
      message,
      status: 'unread', // Add a status for management
    };
    messages.push(newMessage);
    await writeContactMessages(messages);

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
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Message sent successfully!', contactMessage: newMessage }, { status: 200 });

  } catch (error) {
    console.error('Contact API Error:', error);
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
      const { id } = await request.json();
      const messages = await readContactMessages();
      const messageIndex = messages.findIndex((m: any) => m.id === id);
  
      if (messageIndex === -1) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }
  
      messages[messageIndex].status = 'read';
      await writeContactMessages(messages);
  
      return NextResponse.json(messages[messageIndex]);
    } catch (error) {
      console.error('Error updating message:', error);
      return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
  }
  
  export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden: You do not have administrative privileges." }, { status: 403 });
    }
  
    try {
      const { id } = await request.json();
      const messages = await readContactMessages();
      const filteredMessages = messages.filter((m: any) => m.id !== id);
  
      if (messages.length === filteredMessages.length) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }
  
      await writeContactMessages(filteredMessages);
  
      return NextResponse.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
  }