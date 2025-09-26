// tsdown.config.ts
import { defineConfig } from 'tsdown';
import { babel } from '@rollup/plugin-babel';

export default defineConfig({
  dts: true,
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  target: 'es2022',
  sourcemap: true,

  plugins: [
    babel({
      // Let Babel parse TS/JSX, but do NOT transpile TS or change modules
      babelrc: false,
      configFile: false,
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      parserOpts: { plugins: ['typescript', 'jsx'] },
      plugins: [
        // React Compiler must run first
        [
          'babel-plugin-react-compiler',
          {
            // Set your minimum supported React version
            // e.g. '19' if React 19+, or '18'/'17' if you support older versions
            target: '18',
            // Recommended for library builds: skip problematic components instead of failing
            panicThreshold: 'none',
          },
        ],
      ],
      // Required option for @rollup/plugin-babel; we don’t actually use helpers
      babelHelpers: 'bundled',
      // Don’t touch dependencies
      exclude: /node_modules/,
    }),
  ],
});
