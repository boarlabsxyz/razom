import withPreconstruct from '@preconstruct/next';

export default withPreconstruct({
  serverExternalPackages: ['graphql'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
