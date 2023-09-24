import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from './lib/session';


export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // const session = await getIronSession(request, response,sessionOptions);
    // if(!session.user)
    // return new NextResponse(
    //   JSON.stringify({error:"Protected route can't access",message:"Please provide a valid authenticated session"}),
    //   { status: 401 }
    // )
    return NextResponse.next();
}


export const config = {
  matcher: ['/api/notifications/:path*', '/api/orders/:path*', '/api/users/:path*', '/api/tokens/:path*']
}