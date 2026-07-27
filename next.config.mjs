import path from "path"
import { fileURLToPath } from "url"

/** @type {import('next').NextConfig} */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
