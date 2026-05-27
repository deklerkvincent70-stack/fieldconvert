import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.headers.get('host') === 'fieldconvert.vercel.app') {
    const url = request.nextUrl.clone();
    url.protocol = 'https';
    url.host = 'convert.vindk.com';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*'
};
