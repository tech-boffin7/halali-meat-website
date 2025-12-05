import { getSettings, updateCompanySettings, updateEmailSettings, updateNotificationPreferences, updatePreferenceSettings, updateSecuritySettings } from '@/app/actions/settings-actions';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await getSettings();
    
    if (!result.success || !result.settings) {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    return NextResponse.json({ settings: result.settings }, { status: 200 });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case 'company':
        result = await updateCompanySettings(data);
        break;
      case 'email':
        result = await updateEmailSettings(data);
        break;
      case 'notifications':
        result = await updateNotificationPreferences(data);
        break;
      case 'security':
        result = await updateSecuritySettings(data);
        break;
      case 'preferences':
        result = await updatePreferenceSettings(data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid settings type' }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ message: result.message }, { status: 200 });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
