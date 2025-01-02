import withPreconstruct from '@preconstruct/next';

export default withPreconstruct({
  serverExternalPackages: ['graphql'],
  webpack(config) {
    config.externals = {
      ...config.externals,
      'styled-jsx': 'styled-jsx',
      next: 'next',
      '@swc/helpers': '@swc/helpers',
    };
    return config;
  },
});
