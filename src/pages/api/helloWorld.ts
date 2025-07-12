export async function GET() {
  const data = {
    message: 'Hello World from the Astro server-side API!',
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST({ request }: { request: Request }) {
  const body = await request.json();
  console.log('Received data:', body);

  return new Response(JSON.stringify({ received: body, status: 'success' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
