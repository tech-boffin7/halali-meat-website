import { submitQuoteForm } from '@/app/actions/public-actions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/quote
 * Public API endpoint for submitting quote requests
 * Uses server action for actual logic
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convert JSON to FormData for server action
    const formData = new FormData();
    formData.append('name', body.name || '');
    formData.append('email', body.email || '');
    formData.append('phone', body.phone || '');
    formData.append('company', body.company || '');
    formData.append('productInterest', body.productInterest || '');
    formData.append('quantity', body.quantity || '');
    formData.append('message', body.message || '');
    
    const result = await submitQuoteForm(formData);
    
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
    console.error('Error in quote API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit quote request' 
    }, { status: 500 });
  }
}