import { DecryptInput, DecryptOutput } from "../types";
import { decryptWithSignal } from "../signal/sessionCrypto";

export async function decryptMessage(input: DecryptInput): Promise<DecryptOutput> {
  if (!input.from || !input.to || !input.ciphertext) {
    throw new Error("from, to, ciphertext are required");
  }

  const plaintext = await decryptWithSignal(
    input.to,
    input.from,
    input.ciphertext,
    input.messageType
  );

  return { plaintext };
}