import babel from 'rollup-plugin-babel'

export default {
  entry: 'index.js',
  dest: 'dist/bundle.js',
  format: 'umd',
  moduleName: 'ArrayJoin',
  plugins: [babel()]
}
