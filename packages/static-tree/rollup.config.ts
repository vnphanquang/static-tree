import commonjs from '@rollup/plugin-commonjs';
import nodeResolver from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import type { RollupOptions } from 'rollup';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json' assert { type: 'json' };

const plugins = [
  ts({
    tsconfig: 'tsconfig.build.json',
  }),
  // typescript({
  //   tsconfig: 'tsconfig.build.json',
  //   tsconfigDefaults: {
  //     compilerOptions: {
  //       declaration,
  //     },
  //   },
  // }),
  nodeResolver(),
  commonjs(),
  filesize(),
];

const external = [];

const input = './src/index.ts';

const config: RollupOptions = {
  input,
  output: [
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
  ],
  external,
  plugins,
};

export default config;
