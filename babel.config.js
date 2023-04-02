module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  // x css
  plugins: [
    'react-native-classname-to-style',
    ['react-native-platform-specific-extensions', {extensions: ['css']}],
  ],
};
