import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.tsx",
  output: {
    dir: "dist",
    format: "es",
  },
  external: ["react"],
  plugins: [typescript()],
};
