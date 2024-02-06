import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    name: process.env.APP_NAME || 'auditor-platforms-tools',
    env: process.env.APP_ENV || 'development',
    port: process.env.APP_PORT || 3119,
  };
});
