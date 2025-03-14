import path from "path";
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from "vitest/config";
import dotenv from 'dotenv'
dotenv.config()

const aliases = ['infraestructure', 'domain', 'application', 'presentation'];

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: aliases.map((alias) => ({
      find: `@${alias}`,
      replacement: path.resolve(__dirname, `src/${alias}`),
    })),
  },
  test: {
    environment: 'node',
    globals: true,
    exclude: [
      '**/*.e2e-spec.ts',
      '**/prisma/**',
      '**/dist/**',
      '**/node_modules/**',
      '**.module.ts',
      '**/src/infraestructure/repositories/**',
      '**/src/infraestructure/services/**',
      '**/src/domain/**',
      '**/src/presentation/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/index.ts',
        'src/*.ts',
        'prisma/**',
        '**/src/infraestructure/repositories/**',
        '**/src/infraestructure/services/**',
        '**/src/domain/**',
        '**/src/presentation/**',
        ...configDefaults.exclude,
      ],
      all: true,
      include: [
        'src/application/**/*.ts',
        'src/infrastructure/helpers/**/*.ts'
      ],
      reportsDirectory: './coverage',
      clean: true,
    },
  },
});
