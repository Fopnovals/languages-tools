module.exports = {
  copyFontAwesome: {
    src: ['{{ROOT}}/assets/styles/fontawesome/webfonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyAnimateCss: {
    src: './node_modules/animate.css/animate.css',
    dest: '{{BUILD}}'
  }
};
