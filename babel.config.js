module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
    ["module:react-native-dotenv"],
    ["@babel/plugin-transform-flow-strip-types"],
    ["@babel/plugin-transform-private-methods", { "loose": true }],
    ['react-native-reanimated/plugin'],

  ]
  };
};
