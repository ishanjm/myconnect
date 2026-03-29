import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  serverExternalPackages: ['sequelize', 'mysql2'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pg-hstore': false,
      'pg': false,
      'sqlite3': false,
      'tedious': false,
      'mariadb': false,
    };
    return config;
  },
};

export default nextConfig;
