import { Router } from "express";
import { generateKeysForUser, getPublicBundle } from "../keys/keyManager";
import { encryptMessage } from "../crypto/encrypt";
import { decryptMessage } from "../crypto/decrypt";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Crypto service is running" });
});

router.post("/generate-keys", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  generateKeysForUser(userId);
  const bundle = getPublicBundle(userId);

  return res.json({
    userId,
    bundle,
  });
});

router.post("/encrypt", async (req, res) => {
  try {
    const result = await encryptMessage(req.body);
    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

router.post("/decrypt", async (req, res) => {
  try {
    const result = await decryptMessage(req.body);
    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

export default router;