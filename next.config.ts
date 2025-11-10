import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    domains: supabaseUrl
      ? [new URL(supabaseUrl).hostname] // extract hostname dynamically
      : [],
  },
};

export default nextConfig;