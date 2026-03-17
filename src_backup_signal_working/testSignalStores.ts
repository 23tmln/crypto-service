import * as signal from "@signalapp/libsignal-client";

function show(name: string, value: unknown) {
  console.log(`\n=== ${name} static keys ===`);
  console.log(Object.getOwnPropertyNames(value as object).sort());

  if (typeof value === "function" && (value as { prototype?: object }).prototype) {
    console.log(`=== ${name} prototype methods ===`);
    console.log(Object.getOwnPropertyNames((value as { prototype: object }).prototype).sort());
  }
}

function main() {
  show("IdentityKeyStore", signal.IdentityKeyStore);
  show("PreKeyStore", signal.PreKeyStore);
  show("SignedPreKeyStore", signal.SignedPreKeyStore);
  show("SessionStore", signal.SessionStore);

  console.log("\n=== function lengths ===");
  console.log("processPreKeyBundle.length =", signal.processPreKeyBundle.length);
  console.log("signalEncrypt.length =", signal.signalEncrypt.length);
  console.log("signalDecryptPreKey.length =", signal.signalDecryptPreKey.length);
  console.log("signalDecrypt.length =", signal.signalDecrypt.length);
}

main();