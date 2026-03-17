import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    images: {
    unoptimized: true,
  },experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Aap ise 5mb, 10mb ya apni zarurat ke hisaab se badha sakte hain
    },
  },

};

// module.exports = {
//   output: "export",
//   images: {
//     unoptimized: true,
//   },
// };


export default nextConfig;
