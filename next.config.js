/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, def, isServer, defaultLoaders, webpack }) => {
        config.resolve.alias.canvas = false;
        config.resolve.alias.encodig = false;
        return config;
      },
}

module.exports = nextConfig
