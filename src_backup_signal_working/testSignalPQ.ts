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
  show("SignedPreKeyRecord", signal.SignedPreKeyRecord);
  show("KyberPreKeyRecord", signal.KyberPreKeyRecord);
  show("KEMKeyPair", signal.KEMKeyPair);
  show("KEMPublicKey", signal.KEMPublicKey);
  show("KEMSecretKey", signal.KEMSecretKey);

  console.log("\n=== function lengths ===");
  // @ts-ignore
  console.log("SignedPreKeyRecord.new.length =", signal.SignedPreKeyRecord.new?.length);
  // @ts-ignore
  console.log("KyberPreKeyRecord.new.length =", signal.KyberPreKeyRecord.new?.length);
}
main();