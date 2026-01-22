import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const domain = new URL(targetUrl).hostname;
    const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    return NextResponse.json({ iconUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
}