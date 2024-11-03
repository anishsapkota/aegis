import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateNonce, buildVpRequestJwt, pemToJWK } from "@/lib/cryptoUtils";
import fs from "fs";

const serverURL = process.env.SERVER_URL;

const privateKey = fs.readFileSync(`certs/private.pem`, "utf-8");
const publicKeyPem = fs.readFileSync(`certs/public.pem`, "utf-8");

const jwks = pemToJWK(publicKeyPem, "public");

export async function GET(
  request: NextRequest,
  { params }: { params: { state: string; pd: string } },
) {
  const url = new URL(request.url);

  const state = params.state ? params.state : uuidv4();
  const pd = url.searchParams.get("pd");
  if (!pd) {
    return new Response("Presentation defintion is required", { status: 400 });
  }

  const nonce = generateNonce(16);
  const response_uri = serverURL + "/api/verifier/direct-post" + "/" + state;
  let clientId = serverURL + "/api/verifier/direct-post" + "/" + state;

  const jwtToken = buildVpRequestJwt(
    state,
    nonce,
    clientId,
    response_uri,
    JSON.parse(pd),
    jwks,
    serverURL,
    privateKey,
  );

  return new Response(jwtToken.toString(), { status: 200 });
}
