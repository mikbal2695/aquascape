import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { title, description, tags, image, author, content } = await request.json();

    if (!title || !description || !content) {
      return NextResponse.json({ error: 'Title, description, and content are required' }, { status: 400 });
    }

    // Generate URL safe slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Format tags
    const tagsFormatted = tags
      ? tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
      : ['General'];

    // Insert new post directly into Supabase database (bypasses filesystem)
    const { error } = await supabase
      .from('posts')
      .insert({
        slug,
        title,
        description,
        content,
        image: image || '/paludarium.png',
        author: author || 'Aquascaper',
        tags: tagsFormatted
      });

    if (error) {
      console.error('Error inserting post to Supabase:', error);
      return NextResponse.json({ error: error.message || 'Database insert failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    console.error('POST api/posts error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save post' }, { status: 500 });
  }
}
