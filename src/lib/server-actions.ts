"use server";

import { Resolver } from "did-resolver";
import { getResolver } from "@cef-ebsi/ebsi-did-resolver";
import { importJWK, jwtVerify } from "jose";
import axios from "axios";
import { getCurrentUser } from "./server-side-session";
import { v4 } from "uuid";
import { INotification } from "./useNotification";

export async function resolveDIDebsi(did: string) {
  const resolverConfig = {
    registry: "https://api-conformance.ebsi.eu/did-registry/v5/identifiers",
  };

  const ebsiResolver = getResolver(resolverConfig);
  const didResolver = new Resolver(ebsiResolver);

  const didDoc = await didResolver.resolve(did);
  return didDoc;
}

export async function verifySignature(jwk: any, token: any) {
  try {
    const publicKey = await importJWK(jwk, "ES256");

    const { payload, protectedHeader } = await jwtVerify(token, publicKey);

    console.log("JWT verified successfully:", payload);
    console.log("Protected header:", protectedHeader);
    return true;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return false;
  }
}

export async function createPubSubTopicAndSubscribe(userId: string) {
  try {
    const topicExists = (
      await axios.get(process.env.REDIS_URL + "/topic/" + userId)
    ).data;

    if (topicExists.exists === false) {
      const res = await axios.post(process.env.REDIS_URL + "/topic", {
        topic: userId,
      });
      if (res.status === 201) {
        await axios.post(process.env.REDIS_URL + "/subscribe", {
          topic: userId,
        });
      }
    }
  } catch (error) {
    console.error("Error creating pub/sub topic: ", error);
  }
}

export async function sendAccessRquest(patientDID: string) {
  try {
    const currentUser = await getCurrentUser();
    const res = await axios.post(process.env.REDIS_URL + "/publish", {
      topic: patientDID,
      message: {
        type: "accessRequest",
        senderDID: currentUser.userDID,
        id: v4(),
        read: false,
        title: "Health Records Access Request",
        message: `Your doctor wants to access your medical records`,
        timestamp: new Date().toUTCString(),
      } satisfies INotification,
    });
    if (res.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error sending vc request: ", error);
    return false;
  }
}
