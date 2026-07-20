import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

export const revalidate = 0; // Force fresh sitemap generation on every request

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://becharascape.com';

  const posts = await getAllPosts();
  
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.metadata.slug}`,
    lastModified: new Date(post.metadata.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ];
}
