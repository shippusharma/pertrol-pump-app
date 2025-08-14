import { configs } from '@/configs';
import packages from '../../package.json';

export async function GET() {
  return Response.json(
    {
      message: `👨‍⚕️ Api's are Healthy 🌍 Server is running!`,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'notification-service',
      version: packages.version,
      env: configs.nodeEnv,
    },
    { status: 200 }
  );
}
