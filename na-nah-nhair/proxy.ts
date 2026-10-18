import { type NextRequest, NextResponse } from "next/server";

// Premier filet de sécurité : sans cookie de session, aucune page du back-office n'est rendue.
// La vérification complète (signature, expiration, révocation) est faite par chaque page et chaque action.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/connexion") return NextResponse.next();
  if (!request.cookies.get("nnh_admin")?.value) {
    return NextResponse.redirect(new URL("/admin/connexion", request.url), 307);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
