import path from "path";

export default {
  resolve: {
    alias: {
      "@kinds": path.resolve(__dirname, "./src/kinds/kinds.ts"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@typeclass": path.resolve(__dirname, "./src/typeclass"),
    },
  },
};
