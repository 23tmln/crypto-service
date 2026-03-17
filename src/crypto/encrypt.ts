import { EncryptInput, EncryptOutput } from "../types";
import { encryptWithSignal } from "../signal/sessionCrypto";
import { getPublicBundle } from "../keys/keyManager";

export async function encryptMessage(input: EncryptInput): Promise<EncryptOutput> {
  if (!input.from || !input.to || !input.plaintext) {
    throw new Error("from, to, plaintext are required");
  }

  const recipientBundle = input.recipientBundle ?? getPublicBundle(input.to);

  if (!recipientBundle) {
    throw new Error(`Cannot find recipient bundle for user: ${input.to}`);
  }

  return encryptWithSignal(
    input.from,
    input.to,
    recipientBundle,
    input.plaintext
  );
}