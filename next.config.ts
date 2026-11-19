import type { NextConfig } from "next";
const nextConfig:NextConfig={
  experimental:{agentUpgrade:"security"},
  poweredByHeader:false,
  images:{formats:["image/avif","image/webp"],qualities:[75,85,90],minimumCacheTTL:86400},
  async headers(){return [{source:"/(.*)",headers:[{key:"X-Content-Type-Options",value:"nosniff"},{key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},{key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"}]}];},
};
export default nextConfig;
