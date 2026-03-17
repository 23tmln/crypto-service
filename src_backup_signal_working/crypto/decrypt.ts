import { DecryptInput, DecryptOutput } from "../types";
import { decryptWithSignal } from "../signal/sessionCrypto";

export async function decryptMessage(input: DecryptInput): Promise<DecryptOutput> {
  if (!input.from || !input.to || !input.ciphertext || !input.sessionId) {
    throw new Error("from, to, ciphertext, sessionId are required");
  }

  const plaintext = await decryptWithSignal(
    input.to,
    input.from,
    input.ciphertext,
    input.messageType
  );

  return { plaintext };
}