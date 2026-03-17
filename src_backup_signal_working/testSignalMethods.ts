import * as signal from "@signalapp/libsignal-client";

function listPrototypeMethods(name: string, value: unknown) {
  if (typeof value !== "function") {
    console.log(`\n=== ${name}: not a class/function ===`);
    return;
  }

  const proto = (value as { prototype?: object }).prototype;
  if (!proto) {
    console.log(`\n=== ${name}: no prototype ===`);
    return;
  }

  const methods = Object.getOwnPropertyNames(proto).sort();
  console.log(`\n=== ${name} prototype methods ===`);
  console.log(methods);
}

function listStaticKeys(name: string, value: unknown) {
  if (typeof value !== "function" && typeof value !== "object") {
    console.log(`\n=== ${name}: no static keys ===`);
    return;
  }

  console.log(`\n=== ${name} static keys ===`);
  console.log(Object.getOwnPropertyNames(value).sort());
}

function main() {
  const targets: Array<[string, unknown]> = [
    ["PrivateKey", signal.PrivateKey],
    ["PublicKey", signal.PublicKey],
    ["IdentityKeyPair", signal.IdentityKeyPair],
    ["PreKeyRecord", signal.PreKeyRecord],
    ["SignedPreKeyRecord", signal.SignedPreKeyRecord],
    ["PreKeyBundle", signal.PreKeyBundle],
    ["SessionRecord", signal.SessionRecord],
    ["ProtocolAddress", signal.ProtocolAddress],
  ];

  for (const [name, value] of targets) {
    listStaticKeys(name, value);
    listPrototypeMethods(name, value);
  }
}

main();