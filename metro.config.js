module.exports = {
  transformer: {
    // x css
    babelTransformerPath: require.resolve('react-native-css-transformer'),
    resolver: {
      sourceExts: ['js', 'json', 'jsx', 'css'],
    },
    // ORI
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
