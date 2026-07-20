import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.becharascape.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    template: "%s | BecharaScape",
    default: "BecharaScape - My Adventures In Aquascaping",
  },
  description: "Discover professional aquascaping guides, planted tank setups, aquarium calculators, and journals. Learn to build paludariums and nature aquariums.",
  keywords: ["aquascaping", "planted tank", "aquarium", "becharascape", "fish tank", "paludarium"],
  openGraph: {
    title: "BecharaScape - My Adventures In Aquascaping",
    description: "Explore professional aquascaping tutorials, planted tank setups, aquarium calculators, and journals.",
    url: "https://www.becharascape.com", 
    siteName: "BecharaScape",
    images: [
      {
        url: "https://www.becharascape.com/jungle-aquarium.png",
        width: 1200,
        height: 630,
        alt: "BecharaScape Aquascaping Layout"
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BecharaScape - My Adventures In Aquascaping",
    description: "Explore professional aquascaping tutorials, planted tank setups, and journals.",
    images: ["https://www.becharascape.com/jungle-aquarium.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Replace with your real AdSense publisher ID when ready
  const ADSENSE_PID = "ca-pub-8806489587869464"; 

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "BecharaScape",
    "url": "https://www.becharascape.com",
    "description": "My Adventures In Aquascaping",
  };

  return (
    <html lang="en">
      <body>
        <header>
          <div className="header-top">
            <div className="bubble-animation-container">
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
            </div>
            <div className="container header-top-inner">
              <Link href="/" className="logo-link" style={{ display: 'block', height: '42px', width: '180px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 100" width="100%" height="100%">
                  {/* Icon Group (Pure Leaf & Water) */}
                  <g transform="translate(15, 0)">
                    {/* Elegant Minimalist Water Wave */}
                    <path d="M25 65 C55 50 85 75 115 60" fill="none" stroke="#3182CE" strokeWidth={4} strokeLinecap="round"/>
                    
                    {/* Beautiful Organic Leaf */}
                    <path d="M60 60 C45 35 65 20 80 22 C75 40 85 55 60 60 Z" fill="#48BB78"/>
                  </g>
                  {/* Typography (Sleek & Centered) */}
                  <text x="145" y="58" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="800" fontSize="34" fill="#2D3748" letterSpacing="0.5">
                    Bechara<tspan fill="#48BB78">scape</tspan>
                  </text>
                </svg>
              </Link>
              <div className="header-actions">
                <Link href="/admin" className="btn btn-blue" style={{ textDecoration: 'none', display: 'inline-block' }}>Admin Dashboard</Link>
              </div>
            </div>
          </div>
          <div className="header-nav">
            <div className="container">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/admin">Submit Setup</Link></li>
                <li><Link href="/">All Setups</Link></li>
                <li className="search-form">
                  <input type="text" placeholder="Search setups..." />
                  <button>Search</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="header-subnav">
            <div className="container">
              <ul>
                <li><Link href="/?tag=Low Tech">Low Tech</Link></li>
                <li><Link href="/?tag=High Tech">High Tech</Link></li>
                <li><Link href="/?tag=Iwagumi">Iwagumi</Link></li>
                <li><Link href="/?tag=Dutch">Dutch Style</Link></li>
                <li><Link href="/?tag=hardscape">Hardscape Only</Link></li>
                <li><Link href="/?tag=biotope">Biotope</Link></li>
              </ul>
            </div>
          </div>
        </header>

        <main className="container">
          {children}
        </main>

        <footer style={{ backgroundColor: 'var(--header-dark)', color: '#fff', padding: '2rem 0', textAlign: 'center', marginTop: '4rem' }}>
          <div className="container">
            <p>&copy; {new Date().getFullYear()} BecharaScape. All rights reserved.</p>
          </div>
        </footer>

        {/* Global Google AdSense */}
        <Script 
          async 
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PID}`}
          crossOrigin="anonymous" 
          strategy="afterInteractive" 
        />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
