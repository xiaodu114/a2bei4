//  yarn add rollup -D

export default {
    input: './src/index.js',
    output: {
        file: './dist/a2bei4.js',
        format: 'umd',
        name: 'du',
        banner: `/*!
 * a2bei4 - xiaodu114.github.io
 */
`
    }
};