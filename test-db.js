const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

console.log("=========================================");
console.log("🔍 BECHARASCAPE SUPABASE CONNECTION AUDIT");
console.log("=========================================\n");

// 1. Manually parse .env.local if present
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log("📝 Found .env.local file. Loading credentials...");
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Strip outer quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
} else {
  console.log("⚠️ No .env.local file found. Checking system environment variables...");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("\n❌ ERROR: Missing Supabase credentials!");
  console.error("Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
  console.error("You can create a .env.local file in this folder with the following format:");
  console.error("NEXT_PUBLIC_SUPABASE_URL=your_supabase_url");
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key");
  process.exit(1);
}

console.log(`📡 URL: ${supabaseUrl}`);
console.log(`🔑 Key type being tested: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role (Full Bypass)' : 'Anon Public'}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function runAudit() {
  try {
    // Audit 1: Test Connection & Fetch Table Columns
    console.log("\n🔄 Audit 1: Querying posts table...");
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);

    if (postsError) {
      throw new Error(`Query failed: ${postsError.message} (${postsError.code})`);
    }
    console.log("✅ Audit 1 Success: Database connected and 'posts' table is reachable!");

    // Audit 2: Test Dummy Post Insertion
    console.log("\n🔄 Audit 2: Inserting a temporary dummy article...");
    const testSlug = `audit-test-slug-${Date.now()}`;
    const testPost = {
      slug: testSlug,
      title: "Audit Test Dummy Article",
      description: "Temp post for testing connection trace logs.",
      content: "This is a temporary article. It verifies end-to-end publishing pipelines.",
      image: "/paludarium.png",
      author: "Antigravity Audit Agent",
      tags: ["Audit", "Test"]
    };

    const { data: insertData, error: insertError } = await supabase
      .from('posts')
      .insert(testPost)
      .select();

    if (insertError) {
      throw new Error(`Insertion failed: ${insertError.message} (${insertError.code})`);
    }
    console.log("✅ Audit 2 Success: Dummy post inserted successfully!");
    console.log(JSON.stringify(insertData, null, 2));

    // Audit 3: Fetching All Posts to verify the dummy is present
    console.log("\n🔄 Audit 3: Verifying the post is discoverable in query listings...");
    const { data: listData, error: listError } = await supabase
      .from('posts')
      .select('title, slug')
      .eq('slug', testSlug);

    if (listError || listData.length === 0) {
      throw new Error(`Verification failed: ${listError ? listError.message : 'Article was not found in listing query'}`);
    }
    console.log(`✅ Audit 3 Success: Verified article was fetched successfully via API query! Title: "${listData[0].title}"`);

    // Audit 4: Cleanup (Delete the Dummy)
    console.log("\n🔄 Audit 4: Cleaning up temporary dummy article...");
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('slug', testSlug);

    if (deleteError) {
      throw new Error(`Deletion cleanup failed: ${deleteError.message}`);
    }
    console.log("✅ Audit 4 Success: Dummy post cleaned up cleanly. Database restored to normal.");

    console.log("\n🏆 ALL AUDITS COMPLETED SUCCESSFULLY! The system is fully operational.");
  } catch (err) {
    console.error(`\n❌ AUDIT FAILED: ${err.message}`);
  }
}

runAudit();
