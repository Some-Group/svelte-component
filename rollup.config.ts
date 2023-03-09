/// <reference types="rollup" />

import svelte from 'rollup-plugin-svelte'
import autoPreprocess from 'svelte-preprocess'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import * as fs from 'fs'

const compoentPath = 'src/components/'
const result = fs.readdirSync(compoentPath)

const componentsNames = []

result.forEach(name => {
    if (fs.lstatSync(compoentPath + name).isDirectory() && fs.lstatSync(compoentPath + name + '/index.ts').isFile()) {
        componentsNames.push(name)
    }
})

function buildConfig(componentName, outputName) {
    return {
        input: `src/components/${componentName}/index.ts`,
        output: {
            format: 'esm',
            file: `dist/es/${outputName}/index.js`
        },
        sourcemap: true,
        plugins: [
            svelte({
                preprocess: autoPreprocess({
                    sourceMap: true,
                }),
            }),
            resolve({
                browser: true,
                dedupe: ['svelte'],
                exportConditions: ['svelte'],
                extensions: ['.svelte']
            }),
            typescript({ sourceMap: true }),
            // terser()
        ],
        external: ['classnames', 'svelte', 'svelte/internal']
    }

}


export default componentsNames.map(name => {
    return buildConfig(name, name)
})