import { NextResponse } from "next/server";
import { verifierConfig } from "@/lib/verifier-config";

export async function middleware() {
  console.log("**** MIDDLEWARE ****");
  return NextResponse.json({ ...verifierConfig });
}

export const config = {
  matcher: "/.well-known/:path*",
};
