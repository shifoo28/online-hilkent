import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import {verify} from "jsonwebtoken";

// const SECRET = process.env.JWT_SECRET!;

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("auth/signin", req.url));
//   }

//   try {
//     verify(token, SECRET);
//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL("auth/signin", req.url));
//   }
// }

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
