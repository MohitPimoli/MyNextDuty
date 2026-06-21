import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SCSS is supported natively by Next.js when sass-embedded is installed.
  // No additional sassOptions needed for default behavior.

  reactStrictMode: true,

  // Webpack alias: @/ points to the project root for imports like @/components/...
  webpack: (config) => {
    config.resolve.alias["@"] = __dirname;
    return config;
  },
};

export default nextConfig;
