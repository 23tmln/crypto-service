import * as signal from "@signalapp/libsignal-client";

function main() {
  console.log("=== SIGNAL EXPORT KEYS ===");
  console.log(Object.keys(signal).sort());

  console.log("\n=== TOP-LEVEL TYPES ===");
  for (const key of Object.keys(signal).sort()) {
    const value = (signal as Record<string, unknown>)[key];
    console.log(
      key,
      "->",
      typeof value,
      value && typeof value === "object" ? "[object]" : ""
    );
  }
}

main();