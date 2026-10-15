import { defineConfig } from 'vite';
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/RadiationShielding-Lab/',
  build: { target: 'es2022', sourcemap: true },
});
