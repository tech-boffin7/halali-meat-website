import { submitContactForm } from '@/app/actions/public-actions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/contact
 * Public API endpoint for submitting contact forms
 * Uses server action for actual logic
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convert JSON to FormData for server action
    const formData = new FormData();
    formData.append('name', body.name || '');
    formData.append('email', body.email || '');
    formData.append('message', body.message || body.subject || ''); // Use message or subject as body
    
    const result = await submitContactForm(formData);
    
    if (result.success) {
      return NextResponse.json({ success: true, message: result.message }, { status: 201 });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: result.message,
        errors: result.errors 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit contact form' 
    }, { status: 500 });
  }
}