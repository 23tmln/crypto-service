import { generateKeysForUser, getPublicBundle } from "./keys/keyManager";
import { encryptMessage } from "./crypto/encrypt";
import { decryptMessage } from "./crypto/decrypt";

async function main() {
  console.log("=== SIGNAL DEMO START ===");

  generateKeysForUser("alice");
  generateKeysForUser("bob");

  const bobBundle = getPublicBundle("bob");
  if (!bobBundle) {
    throw new Error("Bob bundle not found");
  }

  const encrypted = await encryptMessage({
    from: "alice",
    to: "bob",
    plaintext: "xin chao bob",
    recipientBundle: bobBundle,
  });

  console.log("Encrypted output:");
  console.log(encrypted);

  const decrypted = await decryptMessage({
    from: "alice",
    to: "bob",
    ciphertext: encrypted.ciphertext,
    messageType: encrypted.messageType,
    sessionId: encrypted.sessionId,
  });

  console.log("Decrypted output:");
  console.log(decrypted);

  console.log("=== SIGNAL DEMO END ===");
}

main().catch((err) => {
  console.error("DEMO ERROR:", err);
  process.exit(1);
});