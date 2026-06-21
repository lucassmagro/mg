/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Imagens locais (em /public) são otimizadas pelo Next via sharp.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
