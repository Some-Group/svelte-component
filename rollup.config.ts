/// <reference types="rollup" />

import svelte from 'rollup-plugin-svelte'
import autoPreprocess from 'svelte-preprocess'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
    input: `src/index.ts`,
    output: {
        file: 'dist/svelte-compoent.js',
        format: 'esm',
    },
    plugins: [
        svelte({
            preprocess: autoPreprocess(),
        }),
        resolve({
            exportConditions: ['svelte'],
            extensions: ['.svelte']
        }),
        typescript({ sourceMap: true })
    ],
    external: ['classnames']
}
