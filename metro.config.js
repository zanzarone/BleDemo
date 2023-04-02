module.exports = {
  transformer: {
    // x css
    babelTransformerPath: require.resolve('react-native-css-transformer'),
    resolver: {
      sourceExts: [...sourceExts, 'css'],
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
