import { supabase } from './supabase';

export type PostMetadata = {
  title: string;
  date: string;
  description: string;
  slug: string;
  tags: string[];
  image?: string;
  author?: string;
};

export type Post = {
  metadata: PostMetadata;
  content: string;
};

// Database-backed fetch for all posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts from Supabase:', error);
      return [];
    }

    return (data || []).map((row) => ({
      metadata: {
        title: row.title,
        date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: row.description,
        slug: row.slug,
        tags: row.tags || [],
        image: row.image,
        author: row.author,
      },
      content: row.content,
    }));
  } catch (err) {
    console.error('Network error fetching posts:', err);
    return [];
  }
}

// Database-backed fetch for single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error(`Error fetching post ${slug} from Supabase:`, error);
      return null;
    }

    return {
      metadata: {
        title: data.title,
        date: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: data.description,
        slug: data.slug,
        tags: data.tags || [],
        image: data.image,
        author: data.author,
      },
      content: data.content,
    };
  } catch (err) {
    console.error('Network error fetching post:', err);
    return null;
  }
}
