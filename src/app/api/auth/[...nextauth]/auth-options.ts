import CredentialsProvider from "next-auth/providers/credentials";
import { JWTPayload, SignJWT, importJWK } from "jose";
import { Session, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { JwtPayload as OriginalJwtPayload, jwtDecode } from "jwt-decode";
import { resolveDIDebsi, verifySignature } from "@/lib/server-actions";
import { generateUsername } from "unique-username-generator";

interface JwtPayload extends OriginalJwtPayload {
  vc: {
    issuer: string;
    type: string[];
    credentialSubject: {
      id: string;
    };
  };
}

export interface token extends JWT {
  uid: string;
  jwtToken: string;
}

export interface User {
  did: string;
  name: string;
  token: string;
  role: string;
}

export interface CustomSession extends Session {
  user: User;
}

const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET || "secret";

  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(jwk);

  return jwt;
};

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials-login",
      name: "credentials",
      credentials: {
        verifiable_presentation_data: {
          label: "Verifiable Presentation",
          type: "vp_token",
          placeholder: "login_using_verifiable_presentation",
        },
      },
      //@ts-ignore
      async authorize(credentials) {
        if (credentials?.verifiable_presentation_data) {
          const data = JSON.parse(credentials.verifiable_presentation_data);
          const decodedVP: JwtPayload = jwtDecode(data.vp);

          const res = await resolveDIDebsi(decodedVP.vc.issuer);
          if (!res || !res.didDocument) {
            return null;
          }
          const userRole =
            decodedVP.vc.type.includes("MedicalLicense") ||
            decodedVP.vc.type.includes("Approbation")
              ? "practitioner"
              : "patient";
          for (const method of res.didDocument.verificationMethod!) {
            try {
              const publicKeyJwk = method.publicKeyJwk;
              const verification = await verifySignature(publicKeyJwk, data.vp);
              if (verification === true) {
                const username = generateUsername("", 0, 15);

                const jwt = await generateJWT({
                  did:
                    userRole == "patient"
                      ? decodedVP.vc.credentialSubject.id
                      : "did:ebsi:zmRrEp7pS7XhVDdZbMgD9Yq",
                  role: userRole,
                });
                return {
                  did:
                    userRole == "patient"
                      ? decodedVP.vc.credentialSubject.id
                      : "did:ebsi:zmRrEp7pS7XhVDdZbMgD9Yq",
                  name: username,
                  token: jwt,
                  role: userRole,
                };
              }
            } catch (error) {
              console.error("Verification failed:", error);
            }
          }
          return null;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }): Promise<JWT> => {
      const newToken: token = token as token;

      if (user) {
        newToken.uid = (user as unknown as User).did;
        newToken.jwtToken = (user as unknown as User).token;
        newToken.role = (user as unknown as User).role;
      }
      return newToken;
    },
    session: async ({ session, token }) => {
      const newSession: CustomSession = session as CustomSession;
      if (newSession.user && token.uid) {
        newSession.user.did = token.uid as string;
        newSession.user.token = token.jwtToken as string;
        newSession.user.role = token.role as string;
      }
      return newSession as CustomSession;
    },
  },
  pages: {
    signIn: "/signin",
  },
} satisfies NextAuthOptions;

export default authOptions;
