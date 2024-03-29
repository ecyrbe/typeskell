import path from 'path';

export default {
  resolve: {
    alias: {
      '@kinds': path.resolve(__dirname, './src/kinds'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@typeclass': path.resolve(__dirname, './src/typeclass'),
      '@data': path.resolve(__dirname, './src/data'),
      '@typeskell': path.resolve(__dirname, './src/typeskell'),
    },
  },
};
