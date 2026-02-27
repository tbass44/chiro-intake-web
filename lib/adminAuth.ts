// lib/adminAuth.ts

type SessionPayload = {
  u: string;
  exp: number;
};

function base64urlEncode(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64urlDecode(str: string) {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const base64 = str.replaceAll("-", "+").replaceAll("_", "/") + pad;
  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmac(data: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(data)
  );

  return new Uint8Array(signature);
}

export async function createAdminSessionToken(
  username: string,
  secret: string,
  days: number
) {
  const exp = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;

  const payload: SessionPayload = { u: username, exp };
  const payloadStr = JSON.stringify(payload);

  const enc = new TextEncoder();
  const payloadBytes = enc.encode(payloadStr);
  const payloadB64 = base64urlEncode(payloadBytes);

  const sigBytes = await hmac(payloadB64, secret);
  const sigB64 = base64urlEncode(sigBytes);

  return `${payloadB64}.${sigB64}`;
}

export async function verifyAdminSessionToken(
  token: string,
  secret: string
) {
  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false as const };

  const [payloadB64, sigB64] = parts;

  const sigBytes = await hmac(payloadB64, secret);
  const givenSig = base64urlDecode(sigB64);

  if (sigBytes.length !== givenSig.length) return { ok: false as const };

  for (let i = 0; i < sigBytes.length; i++) {
    if (sigBytes[i] !== givenSig[i]) {
      return { ok: false as const };
    }
  }

  try {
    const payloadBytes = base64urlDecode(payloadB64);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadJson) as SessionPayload;

    if (!payload?.u || !payload?.exp) return { ok: false as const };
    if (Math.floor(Date.now() / 1000) > payload.exp)
      return { ok: false as const };

    return { ok: true as const, username: payload.u };
  } catch {
    return { ok: false as const };
  }
}
