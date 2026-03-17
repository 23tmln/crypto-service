const BASE_URL = "http://localhost:3000";

type GenerateKeysResponse = {
  success: boolean;
  userId: string;
  bundle: any;
  error?: string;
};

type EncryptResponse = {
  success: boolean;
  from: string;
  to: string;
  ciphertext: string;
  messageType: string;
  sessionId?: string;
  error?: string;
};

type DecryptResponse = {
  success: boolean;
  from: string;
  to: string;
  plaintext: string;
  error?: string;
};

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as T;

  if (!res.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data;
}

async function generateKeys(userId: string) {
  const result = await postJson<GenerateKeysResponse>("/generate-keys", {
    userId,
  });

  if (!result.success) {
    throw new Error(`generate-keys failed for ${userId}`);
  }

  console.log(`✔ Keys generated for ${userId}`);
  return result.bundle;
}

async function encrypt(from: string, to: string, plaintext: string, recipientBundle: any) {
  const result = await postJson<EncryptResponse>("/encrypt", {
    from,
    to,
    plaintext,
    recipientBundle,
  });

  if (!result.success) {
    throw new Error(`encrypt failed: ${from} -> ${to}`);
  }

  console.log(`✔ Encrypted ${from} -> ${to}`);
  console.log(`  messageType: ${result.messageType}`);
  return result;
}

async function decrypt(from: string, to: string, ciphertext: string, messageType: string, sessionId?: string) {
  const body: any = {
    from,
    to,
    ciphertext,
    messageType,
  };

  if (sessionId) {
    body.sessionId = sessionId;
  }

  const result = await postJson<DecryptResponse>("/decrypt", body);

  if (!result.success) {
    throw new Error(`decrypt failed: ${from} -> ${to}`);
  }

  console.log(`✔ Decrypted at ${to}`);
  console.log(`  plaintext: ${result.plaintext}`);
  return result;
}

async function main() {
  console.log("=== AUTO API TEST START ===");

  const aliceBundle = await generateKeys("alice");
  const bobBundle = await generateKeys("bob");

  console.log("\n=== Alice -> Bob ===");
  const ab1 = await encrypt("alice", "bob", "xin chao bob", bobBundle);
  const ab1Dec = await decrypt("alice", "bob", ab1.ciphertext, ab1.messageType, ab1.sessionId);

  if (ab1Dec.plaintext !== "xin chao bob") {
    throw new Error("Mismatch plaintext for Alice -> Bob message 1");
  }

  const ab2 = await encrypt("alice", "bob", "day la tin nhan thu hai", bobBundle);
  const ab2Dec = await decrypt("alice", "bob", ab2.ciphertext, ab2.messageType, ab2.sessionId);

  if (ab2Dec.plaintext !== "day la tin nhan thu hai") {
    throw new Error("Mismatch plaintext for Alice -> Bob message 2");
  }

  console.log("\n=== Bob -> Alice ===");
  const ba1 = await encrypt("bob", "alice", "xin chao alice", aliceBundle);
  const ba1Dec = await decrypt("bob", "alice", ba1.ciphertext, ba1.messageType, ba1.sessionId);

  if (ba1Dec.plaintext !== "xin chao alice") {
    throw new Error("Mismatch plaintext for Bob -> Alice message 1");
  }

  const ba2 = await encrypt("bob", "alice", "day la tin nhan thu hai tu bob", aliceBundle);
  const ba2Dec = await decrypt("bob", "alice", ba2.ciphertext, ba2.messageType, ba2.sessionId);

  if (ba2Dec.plaintext !== "day la tin nhan thu hai tu bob") {
    throw new Error("Mismatch plaintext for Bob -> Alice message 2");
  }

  console.log("\n=== ALL TESTS PASSED ===");
}

main().catch((err) => {
  console.error("\n=== AUTO API TEST FAILED ===");
  console.error(err);
  process.exit(1);
});