/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Imagens locais (em /public) são otimizadas pelo Next via sharp.
    formats: ["image/avif", "image/webp"],
    // Imagens enviadas pelo painel ficam no Supabase Storage (bucket público).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Cabeçalhos de segurança (HSTS já é entregue pela Vercel — não duplicar aqui).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
