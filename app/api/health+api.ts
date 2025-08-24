import { configs } from '@/configs';
import packages from '../../package.json';

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

export async function GET() {
  return Response.json(
    {
      message: `👨‍⚕️ Api's are Healthy 🌍 Server is running!`,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(process.uptime()),
      version: packages.version,
      env: configs.nodeEnv,
    },
    { status: 200 }
  );
}
