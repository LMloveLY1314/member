module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
//引入vant插件
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}
