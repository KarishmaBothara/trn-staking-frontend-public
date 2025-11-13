/* eslint-disable @typescript-eslint/no-var-requires */
const nextComposePlugins = require('next-compose-plugins');
const { withPlugins } = nextComposePlugins.extend(() => ({}));
const withImages = require('next-images');
const path = require('path');
// const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

module.exports = withPlugins([[withImages], [withBundleAnalyzer]], {
  experimental: {
    esmExternals: 'loose',
  },

  transpilePackages: [
    '@mui/material',
    '@futureverse/wallet-signer-etherjs',
    '@futureverse/experience-sdk',
    '@futureverse/react',
    '@futureverse/component-library',
  ],
  // webpack5: true,
  webpack(config, options) {
    config.resolve.fallback = { fs: false };
    config.resolve.modules.push(path.resolve('./'));

    /* Start SVGR config */
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;
    /* End SVGR config */

    config.module.rules.push({
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    });

    // config.plugins.push(new DuplicatePackageCheckerPlugin());
    config.resolve.alias['bignumber.js'] = path.resolve(__dirname, 'node_modules', 'bignumber.js');
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    minimumCacheTTL: 60,
    domains: ['imgcdn.micklelab.xyz', 'assets.coingecko.com', 'imgcdn.halolab.io'],
    formats: ['image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'xumm.app', port: '', pathname: '/sign/**' }],
  },
  output: 'standalone',
});
