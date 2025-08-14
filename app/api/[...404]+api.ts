export async function GET() {
  return Response.json({ message: 'API endpoint not found', success: false, status: 404 }, { status: 404 });
}

export async function POST() {
  return Response.json({ message: 'API endpoint not found', success: false, status: 404 }, { status: 404 });
}
