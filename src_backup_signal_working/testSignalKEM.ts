import * as signal from "@signalapp/libsignal-client";

function show(name: string, value: unknown) {
  console.log(`\n=== ${name} static keys ===`);
  console.log(Object.getOwnPropertyNames(value as object).sort());

  if (typeof value === "function" && (value as { prototype?: object }).prototype) {
    console.log(`=== ${name} prototype methods ===`);
    console.log(
      Object.getOwnPropertyNames((value as { prototype: object }).prototype).sort()
    );
  }
}

function main() {
  show("KEMKeyPair", signal.KEMKeyPair);
  show("KEMPublicKey", signal.KEMPublicKey);
  show("KEMSecretKey", signal.KEMSecretKey);

  // @ts-ignore
  console.log("KEMKeyPair.generate.length =", signal.KEMKeyPair.generate?.length);
  // @ts-ignore
  console.log("KEMKeyPair.deserialize.length =", signal.KEMKeyPair.deserialize?.length);
}

main();