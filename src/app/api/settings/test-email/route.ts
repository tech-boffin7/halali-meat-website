import { authOptions } from '@/lib/authOptions';
import { testSMTPConnection, validateSMTPConfig } from '@/lib/email-validator';
import { decrypt } from '@/lib/encryption';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate configuration
    const validation = validateSMTPConfig(body);
    if (!validation.isValid) {
      return NextResponse.json({ 
        success: false, 
        message: validation.errors.join(', ') 
      }, { status: 400 });
    }

    // Decrypt password if it's encrypted (coming from saved settings)
    let password = body.password;
    if (body.isEncrypted && password) {
      try {
        password = decrypt(password);
      } catch {
        return NextResponse.json(
          { success: false, error: 'Failed to send test email' },
          { status: 500 }
        );
      }
    }

    // Test SMTP connection
    const result = await testSMTPConnection({
      host: body.host,
      port: parseInt(body.port),
      secure: body.secure,
      user: body.user,
      password,
      fromEmail: body.fromEmail,
      fromName: body.fromName,
    });

    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    });
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Test failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}
