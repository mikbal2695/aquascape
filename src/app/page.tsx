import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import AquariumCalculator from "@/components/AquariumCalculator";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const revalidate = 0; // Force SSR to fetch fresh posts on every request

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { tag } = await searchParams;
  let posts = await getAllPosts();

  if (tag) {
    posts = posts.filter((post) =>
      post.metadata.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  return (
    <div>
      {/* Analytics Page Tracker */}
      <AnalyticsTracker slug={tag ? `home-tag-${tag}` : "home"} />

      {/* Featured Section */}
      <section className="featured-hero">
        <div className="featured-text">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', fontWeight: 'bold', color: 'var(--brand-blue)' }}>Join BecharaScape</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Real setups from real aquascapers. Discover authentic planted tank experiences, plan your next scape with first-hand insights, and join a community that values thriving ecosystems.
          </p>
          <div>
            <button className="btn btn-orange" style={{ marginRight: '10px' }}>Join For Free</button>
            <button className="btn btn-blue">Explore Setups</button>
          </div>
        </div>
        <div 
          className="featured-image"
          style={{ backgroundImage: 'url(/jungle-aquarium.png)' }}
        ></div>
      </section>

      <div className="main-layout">
        {/* Main Content (Latest Setups) */}
        <div className="content-area">
          <div className="box">
            <div className="box-header">
              📖 Latest Setups ({posts.length})
            </div>
            <div className="box-content" style={{ padding: '0 20px' }}>
              {posts.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No setups published yet. Head to <Link href="/admin" style={{ fontWeight: 'bold' }}>/admin</Link> to write the first post!
                </div>
              ) : (
                posts.map((post, index) => (
                  <div key={post.metadata.slug}>
                    <div className="blog-feed-item">
                      <div className="blog-author-meta">
                        <div className="blog-author-avatar" style={{ overflow: 'hidden' }}>
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.metadata.author || post.metadata.slug}`} 
                            alt="avatar" 
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                        <div>
                          <strong>{post.metadata.author || "AquascaperJohn"}</strong><br/>
                          {new Date(post.metadata.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Link href={`/blog/${post.metadata.slug}`}>
                        <h3 className="blog-title">{post.metadata.title}</h3>
                      </Link>
                      <p className="blog-excerpt">{post.metadata.description}</p>
                      <Link href={`/blog/${post.metadata.slug}`} style={{ overflow: 'hidden', display: 'block', borderRadius: '4px' }}>
                        <img 
                          className="blog-large-img" 
                          src={post.metadata.image || "/paludarium.png"} 
                          alt={post.metadata.title} 
                        />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Interactive Calculator Gimmick */}
          <AquariumCalculator />

          <div className="box">
            <div className="box-header">
              💬 Recent Activity (5)
            </div>
            <div className="box-content" style={{ padding: '0 15px' }}>
              <div className="sidebar-list-item">
                <div className="sidebar-details">
                  <div className="sidebar-title"><Link href="#">Best CO2 diffuser for a 20g long?</Link></div>
                  <div className="sidebar-meta">The Gear Forum<br/>by plantmaster</div>
                </div>
              </div>
              <div className="sidebar-list-item">
                <div className="sidebar-details">
                  <div className="sidebar-title"><Link href="#">Algae bloom won't go away</Link></div>
                  <div className="sidebar-meta">Algae Control<br/>by newbiefish</div>
                </div>
              </div>
              <div className="sidebar-list-item">
                <div className="sidebar-details">
                  <div className="sidebar-title"><Link href="#">Trimming Stem Plants</Link></div>
                  <div className="sidebar-meta">Plant Care<br/>by scissor_hands</div>
                </div>
              </div>
            </div>
          </div>

          <div className="box">
            <div className="box-header">
              🏆 Featured Scapes
            </div>
            <div className="box-content" style={{ padding: '0 15px' }}>
              <div className="sidebar-list-item">
                <img src="/koipond.jpg" className="sidebar-thumb" alt="Thumb" />
                <div className="sidebar-details">
                  <div className="sidebar-title"><Link href="/blog/designing-koi-ponds">Vibrant Backyard Koi Pond</Link></div>
                  <div className="sidebar-meta">by PondMaster<br/>Active Koi</div>
                </div>
              </div>
              <div className="sidebar-list-item">
                <img src="/cichlids.png" className="sidebar-thumb" alt="Thumb" />
                <div className="sidebar-details">
                  <div className="sidebar-title"><Link href="/blog/guide-to-cichlid-tanks">African Cichlid Reef</Link></div>
                  <div className="sidebar-meta">by LakeTanganyikaExplorer<br/>Malawi Setups</div>
                </div>
              </div>
            </div>
          </div>

          <div className="box">
            <div className="box-header">
              🏷️ Filter by Tag
            </div>
            <div className="box-content" style={{ padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Low Tech', 'High Tech', 'Iwagumi', 'Dutch', 'hardscape', 'biotope', 'setup-guide', 'paludarium', 'moss'].map((tagName) => {
                const isActive = tag?.toLowerCase() === tagName.toLowerCase();
                return (
                  <Link 
                    key={tagName} 
                    href={`/?tag=${tagName}`}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: isActive ? 'var(--brand-blue)' : '#f3f4f6',
                      color: isActive ? '#fff' : '#4b5563',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.2s',
                    }}
                  >
                    #{tagName}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="box" style={{ background: 'linear-gradient(135deg, var(--header-dark), #1a365d)', color: '#fff', border: 'none' }}>
            <div className="box-content" style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#48BB78', fontSize: '1rem', fontWeight: 'bold' }}>📰 Aquascaper Journal</h4>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4', marginBottom: '15px' }}>
                Join our newsletter and receive weekly aquascaping guides, tank showcases, and equipment reviews.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #4a5568',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
                <button className="btn btn-orange" style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}>Subscribe</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
