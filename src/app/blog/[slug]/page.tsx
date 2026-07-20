import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0; // Force SSR for fresh content and views logging

// Generate dynamic SEO metadata per blog post dynamically from database fields
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | BecharaScape",
    };
  }

  // Ensure description is safe and fits optimal SEO search snippet constraints (120-160 characters)
  const cleanDescription = post.metadata.description
    .replace(/[#*`_\[\]]/g, '') // strip markdown markers
    .substring(0, 155);

  const ogImageUrl = post.metadata.image?.startsWith('http') 
    ? post.metadata.image 
    : `https://becharascape.com${post.metadata.image || '/jungle-aquarium.png'}`;

  return {
    title: post.metadata.title,
    description: cleanDescription,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.metadata.title,
      description: cleanDescription,
      url: `https://becharascape.com/blog/${slug}`,
      siteName: "BecharaScape",
      images: [
        {
          url: ogImageUrl,
          alt: post.metadata.title,
        }
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.metadata.title,
      description: cleanDescription,
      images: [ogImageUrl],
    }
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.metadata.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="main-layout">
      {/* Analytics Page Tracker */}
      <AnalyticsTracker slug={post.metadata.slug} />

      <div className="content-area">
        <article className="box">
          <div className="box-content" style={{ padding: '30px' }}>
            <header className="article-header">
              <h1 style={{ color: 'var(--brand-blue)' }}>
                {post.metadata.title}
              </h1>
              <div className="article-meta" style={{ color: 'var(--text-muted)' }}>
                <span>📅 {new Date(post.metadata.date).toLocaleDateString()}</span> &nbsp;|&nbsp; 
                <span>👤 {post.metadata.author || 'Unknown'}</span> &nbsp;|&nbsp;
                <span>🏷️ {post.metadata.tags.join(', ')}</span>
              </div>
            </header>

            <div className="prose">
              <MDXRemote source={post.content} />
            </div>
          </div>
        </article>
      </div>

      <aside className="sidebar">
        <div className="box">
          <div className="box-header">
            👤 Author Profile
          </div>
          <div className="box-content" style={{ textAlign: 'center' }}>
             <div className="blog-author-avatar" style={{ width: '80px', height: '80px', margin: '0 auto 15px auto', overflow: 'hidden' }}>
               <img 
                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.metadata.author || post.metadata.slug}`} 
                 alt="avatar" 
                 style={{ width: '100%', height: '100%' }}
               />
             </div>
             <h4>{post.metadata.author || 'AquascaperJohn'}</h4>
             <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>
               Passionate about setups and sharing aquascaping knowledge.
             </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
