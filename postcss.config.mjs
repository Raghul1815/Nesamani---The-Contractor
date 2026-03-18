import path from 'path';

export default {
  plugins: {
    '@Aruvili/cloudcss/postcss': {
      config: path.resolve('./cloud.config.cjs'),
    },
  },
};
