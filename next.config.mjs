/** @type {import('next').NextConfig} */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : '';

const nextConfig = {
  images: {
    remotePatterns: supabaseHostname ? [
      {
        protocol: 'https', 
        hostname: supabaseHostname,
      }
    ] : [],
  }
};

export default nextConfig;