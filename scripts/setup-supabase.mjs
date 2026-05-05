import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  console.log("Setting up Supabase...");

  // Create the table via raw SQL using the REST API
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS portfolio_files (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      title text NOT NULL,
      description text DEFAULT '',
      file_url text NOT NULL,
      file_type text NOT NULL DEFAULT 'other',
      featured boolean DEFAULT false,
      download_count integer DEFAULT 0,
      created_at timestamptz DEFAULT now()
    );
  `;

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
  });

  // Use the pg endpoint to run SQL
  const sqlResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });
  console.log("REST API status:", sqlResponse.status);

  // Try to query the table to see if it exists
  const { data, error } = await supabase.from("portfolio_files").select("id").limit(1);
  
  if (error && error.code === "42P01") {
    console.log("Table does not exist. You need to create it manually in Supabase SQL editor.");
    console.log("Run this SQL in your Supabase dashboard > SQL Editor:\n");
    console.log(createTableSQL);
  } else if (error) {
    console.error("Error:", error.message, error.code);
  } else {
    console.log("✓ Table portfolio_files exists!");
  }

  // Check / create storage bucket
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
  if (bucketErr) {
    console.error("Bucket list error:", bucketErr.message);
  } else {
    const exists = buckets.some((b) => b.name === "portfolio-files");
    if (!exists) {
      const { error: createErr } = await supabase.storage.createBucket("portfolio-files", {
        public: true,
        fileSizeLimit: 52428800,
      });
      if (createErr) {
        console.error("Bucket create error:", createErr.message);
      } else {
        console.log("✓ Created storage bucket: portfolio-files");
      }
    } else {
      console.log("✓ Storage bucket portfolio-files exists!");
    }
  }
}

setup().catch(console.error);
