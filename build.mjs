import CDNModule from "./CDNModule.mjs";
import esbuild from "esbuild";

const result = await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: "docs/bundle.js",
  plugins: [CDNModule],
});
console.log("built", result);
