import { generateKeysForUser, getPublicBundle } from "./keys/keyManager";
import { buildPreKeyBundle } from "./signal/bundle";

function main() {
  generateKeysForUser("alice");
  generateKeysForUser("bob");

  const bobBundle = getPublicBundle("bob");
  if (!bobBundle) {
    throw new Error("Bob bundle not found");
  }

  const libsignalBundle = buildPreKeyBundle(bobBundle);

  console.log("registrationId:", libsignalBundle.registrationId());
  console.log("deviceId:", libsignalBundle.deviceId());
  console.log("preKeyId:", libsignalBundle.preKeyId());
  console.log("signedPreKeyId:", libsignalBundle.signedPreKeyId());
  console.log("kyberPreKeyId:", libsignalBundle.kyberPreKeyId());
  console.log("bundle built successfully:", !!libsignalBundle);
}

main();