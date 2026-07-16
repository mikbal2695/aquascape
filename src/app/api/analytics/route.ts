import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Get client IP address and user-agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Hash the IP address for privacy/GDPR compliance
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // Insert view count directly to Supabase page_views table
    const { error } = await supabase
      .from('page_views')
      .insert({
        slug,
        ip_hash: ipHash,
        user_agent: userAgent
      });

    if (error) {
      console.error('Error logging pageview to Supabase:', error);
      return NextResponse.json({ error: 'Database logging failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics endpoint error:', error);
    return NextResponse.json({ error: error.message || 'Failed to log view' }, { status: 500 });
  }
}
