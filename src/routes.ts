import { Router, Request, Response } from "express";
import { generateKeysForUser, getPublicBundle } from "./keys/keyManager";
import { encryptMessage } from "./crypto/encrypt";
import { decryptMessage } from "./crypto/decrypt";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Signal crypto service is running",
  });
});

router.get("/bundle/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const bundle = getPublicBundle(userId);

    if (!bundle) {
      return res.status(404).json({
        success: false,
        error: `Bundle not found for user: ${userId}`,
      });
    }

    return res.json({
      success: true,
      userId,
      bundle,
    });
  } catch (error: any) {
    console.error("GET /bundle/:userId error:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
});

router.post("/generate-keys", (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        error: "userId is required and must be a string",
      });
    }

    generateKeysForUser(userId);
    const bundle = getPublicBundle(userId);

    return res.json({
      success: true,
      userId,
      bundle,
    });
  } catch (error: any) {
    console.error("POST /generate-keys error:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
});

router.post("/encrypt", async (req: Request, res: Response) => {
  try {
    const { from, to, plaintext, recipientBundle } = req.body;

    if (!from || typeof from !== "string") {
      return res.status(400).json({
        success: false,
        error: "from is required and must be a string",
      });
    }

    if (!to || typeof to !== "string") {
      return res.status(400).json({
        success: false,
        error: "to is required and must be a string",
      });
    }

    if (typeof plaintext !== "string") {
      return res.status(400).json({
        success: false,
        error: "plaintext is required and must be a string",
      });
    }

    const result = await encryptMessage({
      from,
      to,
      plaintext,
      recipientBundle,
    });

    return res.json({
      success: true,
      from,
      to,
      ...result,
    });
  } catch (error: any) {
    console.error("POST /encrypt error:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
});

router.post("/decrypt", async (req: Request, res: Response) => {
  try {
    const { from, to, ciphertext, messageType, sessionId } = req.body;

    if (!from || typeof from !== "string") {
      return res.status(400).json({
        success: false,
        error: "from is required and must be a string",
      });
    }

    if (!to || typeof to !== "string") {
      return res.status(400).json({
        success: false,
        error: "to is required and must be a string",
      });
    }

    if (!ciphertext || typeof ciphertext !== "string") {
      return res.status(400).json({
        success: false,
        error: "ciphertext is required and must be a string",
      });
    }

    const result = await decryptMessage({
      from,
      to,
      ciphertext,
      messageType,
      sessionId,
    });

    return res.json({
      success: true,
      from,
      to,
      ...result,
    });
  } catch (error: any) {
    console.error("POST /decrypt error:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
});

export default router;