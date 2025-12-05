import { sendScheduledMessages } from '@/lib/cron/send-scheduled-messages';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Security: Verify cron secret
  const authHeader = request.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedAuth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const results = await sendScheduledMessages();
    
    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Allow Vercel Cron to call this
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
