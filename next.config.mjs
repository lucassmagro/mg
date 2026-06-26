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
};

export default nextConfig;
