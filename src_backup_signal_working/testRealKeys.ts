import { generateKeysForUser, loadIdentityPrivateKey, loadIdentityPublicKey, getPublicBundle } from "./keys/keyManager";

function main() {
  generateKeysForUser("alice");
  const priv = loadIdentityPrivateKey("alice");
  const pub = loadIdentityPublicKey("alice");
  const bundle = getPublicBundle("alice");

  console.log("private key loaded:", !!priv);
  console.log("public key loaded:", !!pub);
  console.log("bundle:", bundle);

  if (priv && pub) {
    const derivedPub = priv.getPublicKey();
    console.log("public key matches private:", derivedPub.equals(pub));
  }
}

main();