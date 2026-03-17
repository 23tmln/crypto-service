import path from "path";
import {
  Direction,
  IdentityChange,
  IdentityKeyStore,
  KyberPreKeyRecord,
  KyberPreKeyStore,
  PreKeyRecord,
  PreKeyStore,
  PrivateKey,
  ProtocolAddress,
  PublicKey,
  SessionRecord,
  SessionStore,
  SignedPreKeyRecord,
  SignedPreKeyStore,
} from "@signalapp/libsignal-client";

import { loadUserKeys } from "../keys/keyManager";
import { readJsonFile, writeJsonFile } from "../utils/fileStore";
import { base64ToBytes, publicKeyFromBase64 } from "../utils/signalSerde";

const SESSION_DIR = path.join(process.cwd(), "storage", "sessions");
const PREKEY_DIR = path.join(process.cwd(), "storage", "prekeys");

type StoredSessionJson = {
  address: string;
  session: string;
};

type StoredPrekeysJson = {
  userId: string;
  signedPreKeyId: number;
  signedPreKeyPrivate: string;
  signedPreKeyPublic: string;
  signedPreKeySignature: string;
  oneTimePreKeys: Array<{
    id: number;
    publicKey: string;
    privateKey: string;
  }>;
  kyberPreKeyId: number;
  kyberPreKeyPublic: string;
  kyberPreKeySecret: string;
  kyberPreKeySignature: string;
  kyberPreKeyRecord: string;
};

function sessionFile(address: ProtocolAddress): string {
  const safe = `${address.name()}__${address.deviceId()}`;
  return path.join(SESSION_DIR, `${safe}.json`);
}

function prekeyFile(userId: string): string {
  return path.join(PREKEY_DIR, `${userId}.json`);
}

function sessionRecordToBase64(record: SessionRecord): string {
  return Buffer.from(record.serialize()).toString("base64");
}

function sessionRecordFromBase64(base64: string): SessionRecord {
  return SessionRecord.deserialize(base64ToBytes(base64));
}

export class FileIdentityKeyStore extends IdentityKeyStore {
  constructor(private readonly userId: string) {
    super();
  }

  async getIdentityKey() {
    const user = loadUserKeys(this.userId);
    if (!user) {
      throw new Error(`Identity not found for user ${this.userId}`);
    }

    return PrivateKey.deserialize(base64ToBytes(user.identityPrivateKey));
  }

  async getLocalRegistrationId(): Promise<number> {
    const user = loadUserKeys(this.userId);
    if (!user) {
      throw new Error(`Registration id not found for user ${this.userId}`);
    }

    return user.registrationId;
  }

  async saveIdentity(
    name: ProtocolAddress,
    key: PublicKey
  ): Promise<IdentityChange> {
    const existing = await this.getIdentity(name);

    if (!existing) {
      return IdentityChange.NewOrUnchanged;
    }

    return existing.equals(key)
      ? IdentityChange.NewOrUnchanged
      : IdentityChange.ReplacedExisting;
  }

  async isTrustedIdentity(
    _name: ProtocolAddress,
    _key: PublicKey,
    _direction: Direction
  ): Promise<boolean> {
    return true;
  }

  async getIdentity(name: ProtocolAddress): Promise<PublicKey | null> {
    const user = loadUserKeys(name.name());
    if (!user) {
      return null;
    }

    return publicKeyFromBase64(user.identityPublicKey);
  }
}

export class FileSessionStore extends SessionStore {
  constructor() {
    super();
  }

  async saveSession(name: ProtocolAddress, record: SessionRecord): Promise<void> {
    const data: StoredSessionJson = {
      address: name.toString(),
      session: sessionRecordToBase64(record),
    };

    writeJsonFile(sessionFile(name), data);
  }

  async getSession(name: ProtocolAddress): Promise<SessionRecord | null> {
    const data = readJsonFile<StoredSessionJson>(sessionFile(name));
    if (!data) {
      return null;
    }

    return sessionRecordFromBase64(data.session);
  }

  async getExistingSessions(
    addresses: ProtocolAddress[]
  ): Promise<SessionRecord[]> {
    const result: SessionRecord[] = [];

    for (const address of addresses) {
      const session = await this.getSession(address);
      if (session) {
        result.push(session);
      }
    }

    return result;
  }
}

export class FilePreKeyStore extends PreKeyStore {
  constructor(private readonly userId: string) {
    super();
  }

  async savePreKey(_id: number, _record: PreKeyRecord): Promise<void> {
    throw new Error("savePreKey not implemented yet");
  }

  async getPreKey(id: number): Promise<PreKeyRecord> {
    const prekeys = readJsonFile<StoredPrekeysJson>(prekeyFile(this.userId));
    if (!prekeys) {
      throw new Error(`Prekeys not found for user ${this.userId}`);
    }

    const found = prekeys.oneTimePreKeys.find((p) => p.id === id);
    if (!found) {
      throw new Error(`PreKey ${id} not found for user ${this.userId}`);
    }

    return PreKeyRecord.new(
      found.id,
      PublicKey.deserialize(base64ToBytes(found.publicKey)),
      PrivateKey.deserialize(base64ToBytes(found.privateKey))
    );
  }

  async removePreKey(_id: number): Promise<void> {
    // MVP: chưa xóa thật
  }
}

export class FileSignedPreKeyStore extends SignedPreKeyStore {
  constructor(private readonly userId: string) {
    super();
  }

  async saveSignedPreKey(
    _id: number,
    _record: SignedPreKeyRecord
  ): Promise<void> {
    throw new Error("saveSignedPreKey not implemented yet");
  }

  async getSignedPreKey(id: number): Promise<SignedPreKeyRecord> {
    const prekeys = readJsonFile<StoredPrekeysJson>(prekeyFile(this.userId));
    if (!prekeys) {
      throw new Error(`Signed prekey store not found for user ${this.userId}`);
    }

    if (prekeys.signedPreKeyId !== id) {
      throw new Error(`SignedPreKey ${id} not found for user ${this.userId}`);
    }

    return SignedPreKeyRecord.new(
      prekeys.signedPreKeyId,
      Date.now(),
      PublicKey.deserialize(base64ToBytes(prekeys.signedPreKeyPublic)),
      PrivateKey.deserialize(base64ToBytes(prekeys.signedPreKeyPrivate)),
      base64ToBytes(prekeys.signedPreKeySignature)
    );
  }
}

export class FileKyberPreKeyStore extends KyberPreKeyStore {
  constructor(private readonly userId: string) {
    super();
  }

  async saveKyberPreKey(
    _kyberPreKeyId: number,
    _record: KyberPreKeyRecord
  ): Promise<void> {
    throw new Error("saveKyberPreKey not implemented yet");
  }

  async getKyberPreKey(kyberPreKeyId: number): Promise<KyberPreKeyRecord> {
    const prekeys = readJsonFile<StoredPrekeysJson>(prekeyFile(this.userId));
    if (!prekeys) {
      throw new Error(`Kyber prekey store not found for user ${this.userId}`);
    }

    if (prekeys.kyberPreKeyId !== kyberPreKeyId) {
      throw new Error(
        `KyberPreKey ${kyberPreKeyId} not found for user ${this.userId}`
      );
    }

    return KyberPreKeyRecord.deserialize(
      base64ToBytes(prekeys.kyberPreKeyRecord)
    );
  }

  async markKyberPreKeyUsed(
    _kyberPreKeyId: number,
    _signedPreKeyId: number,
    _baseKey: PublicKey
  ): Promise<void> {
    // MVP: chưa đánh dấu usage
  }
}