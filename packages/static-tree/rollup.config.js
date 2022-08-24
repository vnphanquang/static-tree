import { resolve } from 'path';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolver from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const plugins = (declaration = false) => [
  typescript({
    tsconfig: resolve(__dirname, 'tsconfig.build.json'),
    tsconfigDefaults: {
      compilerOptions: {
        declaration,
      },
    },
  }),
  nodeResolver(),
  commonjs(),
  filesize(),
];

const external = [];

const input = resolve(__dirname, './src/index.ts');

/** @type {import('rollup').RollupOptions} */
const config = [
  {
    input,
    output: {
      file: resolve(__dirname, pkg.module),
      format: 'esm',
    },
    external,
    plugins: plugins(true),
  },
  {
    input,
    output: {
      file: resolve(__dirname, pkg.main),
      format: 'cjs',
      sourcemap: true,
    },
    external,
    plugins: plugins(true),
  },
];

export default config;
