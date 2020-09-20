module.exports = {
  presets: [
    '@babel/preset-env', // altera as propriedades do JS que o Browser não entende pra um padrão que é lido pelos browsers
    '@babel/preset-react', // altera o código JSX e funcionalidades do react para JS
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
  ],
};
