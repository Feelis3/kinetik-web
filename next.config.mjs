/** @type {import('next').NextConfig} */
const nextConfig = {
  // GSAP/ScrollTrigger pins and the Three.js scene are set up imperatively in
  // effects with cleanup. StrictMode's dev-only double-invoke re-runs that setup
  // and corrupts pin state (collapsed pins → sections overlap). Disable so dev
  // matches production behaviour.
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
