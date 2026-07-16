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

      {/* Top Banner Leaderboard Ad (AdSense Able Layout) */}
      <div className="ad-container" style={{ margin: '0 0 20px 0', padding: '1.5rem', background: '#fff', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.7rem', color: '#bbb', textTransform: 'uppercase', marginBottom: '5px' }}>Advertisement</div>
        <div style={{ fontStyle: 'italic', color: '#999', fontSize: '1.1rem' }}>Responsive Leaderboard Ad Slot</div>
      </div>

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

                    {/* Native In-Feed AdSense Injection after the first post */}
                    {index === 0 && (
                      <div className="ad-container" style={{ margin: '20px 0', padding: '1.5rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#bbb', textTransform: 'uppercase', marginBottom: '5px' }}>Advertisement</div>
                        <div style={{ fontStyle: 'italic', color: '#999', fontSize: '1rem' }}>In-Feed Native Ad Slot</div>
                      </div>
                    )}
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
                  <div className="sidebar-title"><Link href="/forum/thread-1">Best CO2 diffuser for a 20g long?</Link></div>
                  <div className="sidebar-meta">The Gear Forum<br/>by plantmaster</div>
                </div>
              </div>
              <div className="sidebar-list-item">
                <div className="sidebar-details">
                  <div className="sidebar-title"><Link href="/forum/thread-2">Algae bloom won't go away</Link></div>
                  <div className="sidebar-meta">Algae Control<br/>by newbiefish</div>
                </div>
              </div>
              <div className="sidebar-list-item">
                <div className="sidebar-details">
                  <div className="sidebar-title"><Link href="/forum/thread-3">Trimming Stem Plants</Link></div>
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

          {/* Sticky Sidebar Ad Container (High Click-through rate placement) */}
          <div className="sticky-sidebar-ad">
            <div className="ad-container" style={{ background: '#fff', border: '1px solid var(--border-color)', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#bbb', textTransform: 'uppercase', marginBottom: '5px' }}>Advertisement</div>
              <div style={{ fontStyle: 'italic', color: '#999', fontSize: '1rem' }}>Sticky Skyscraper Ad Slot</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
