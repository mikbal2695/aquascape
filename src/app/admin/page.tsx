import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import AdminPostForm from "@/components/AdminPostForm";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable cache for admin panel so metrics are always fresh

export default async function AdminPage() {
  const posts = await getAllPosts();

  // 1. Fetch Analytics from page_views
  const { data: views, error: viewsError } = await supabase
    .from('page_views')
    .select('slug, ip_hash, created_at');

  if (viewsError) {
    console.error("Error loading analytics:", viewsError);
  }

  const allViews = views || [];
  const totalViews = allViews.length;

  // Calculate unique visitors (unique IP hashes)
  const uniqueIps = new Set(allViews.map((v) => v.ip_hash));
  const uniqueVisitors = uniqueIps.size;

  // Calculate views per slug
  const viewsPerSlug: Record<string, number> = {};
  allViews.forEach((v) => {
    viewsPerSlug[v.slug] = (viewsPerSlug[v.slug] || 0) + 1;
  });

  // Sort posts by popularity
  const popularPosts = [...posts]
    .map((post) => ({
      ...post,
      views: viewsPerSlug[post.metadata.slug] || 0,
    }))
    .sort((a, b) => b.views - a.views);

  return (
    <div style={{ padding: '20px 0' }}>
      <header className="article-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--brand-blue)', fontSize: '2.2rem' }}>🔧 BecharaScape Control Panel</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>
          Consultant Grade SEO Audit & Database-Backed Analytics
        </p>
      </header>

      {/* Analytics KPI Blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="box" style={{ margin: 0 }}>
          <div className="box-header" style={{ backgroundColor: '#2980b9' }}>📊 Total Pageviews</div>
          <div className="box-content" style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>{totalViews.toLocaleString()}</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hits since launch</span>
          </div>
        </div>

        <div className="box" style={{ margin: 0 }}>
          <div className="box-header" style={{ backgroundColor: '#27ae60' }}>👥 Unique Visitors</div>
          <div className="box-content" style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>{uniqueVisitors.toLocaleString()}</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Anonymized unique IPs</span>
          </div>
        </div>

        <div className="box" style={{ margin: 0 }}>
          <div className="box-header" style={{ backgroundColor: '#f39c12' }}>📝 Total Setups</div>
          <div className="box-content" style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>{posts.length}</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Database-backed articles</span>
          </div>
        </div>

        <div className="box" style={{ margin: 0 }}>
          <div className="box-header" style={{ backgroundColor: '#8e44ad' }}>⚡ SEO Optimization</div>
          <div className="box-content" style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>100%</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Perfect SSR & Dynamic Sitemap</span>
          </div>
        </div>
      </div>

      <div className="main-layout" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Left Column: Popularity List & Performance */}
        <div>
          <div className="box">
            <div className="box-header">
              🏆 Article Popularity & Traffic
            </div>
            <div className="box-content" style={{ padding: '0 15px' }}>
              {popularPosts.length === 0 ? (
                <div style={{ padding: '20px', color: 'var(--text-muted)', textAlign: 'center' }}>No posts found.</div>
              ) : (
                popularPosts.map((post) => (
                  <div 
                    key={post.metadata.slug}
                    style={{
                      padding: '15px 0',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ maxWidth: '75%' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '500', margin: '0 0 3px 0' }}>
                        <Link href={`/blog/${post.metadata.slug}`} target="_blank">
                          {post.metadata.title}
                        </Link>
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        By {post.metadata.author} &bull; {post.metadata.tags.slice(0,2).join(', ')}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--brand-blue)' }}>{post.views}</strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>views</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Upload form */}
        <div>
          <div className="box">
            <div className="box-header">
              ✍️ Write New Setup / Article
            </div>
            <div className="box-content">
              <AdminPostForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
