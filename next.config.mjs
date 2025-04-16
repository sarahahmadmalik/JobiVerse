/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude canvas and encoding from client-side bundles
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        encoding: false,
      };
    }

    // Optional: If you need canvas on the server side
    if (isServer) {
      config.externals.push({
        canvas: "commonjs canvas",
        encoding: "commonjs encoding",
      });
    }

    return config;
  },

  // Correct property name for external packages
  serverExternalPackages: ["canvas", "encoding"],
};

export default nextConfig;
