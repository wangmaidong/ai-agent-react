const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  webpack: {
    plugins: [
      process.env.NODE_ENV === "production" && new BundleAnalyzerPlugin({
        analyzerMode: "server",
        analyzerPort: 8888,
        openAnalyzer: true,
      }),
    ],
  },
};
