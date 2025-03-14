import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import autoprefixer from 'autoprefixer';
import svgr from 'vite-plugin-svgr';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
          svgProps: {
            className: 'w-5 h-5'
          },
        },
      }),
    ],
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
    },
    server: {
      host: "::",
      port: 8000,
      fs: {
        strict: false,
        caseSensitiveFileNames: false
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    define: {
      'process.env': env
    }
  }
});
