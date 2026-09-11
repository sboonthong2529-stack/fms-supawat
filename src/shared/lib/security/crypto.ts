import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const secret = process.env.AUTH_SECRET || "default_auth_secret_minimum_16_characters";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts sensitive text at rest using AES-256-GCM.
 * Formats output as `iv:authTag:encryptedHex`.
 */
export function encryptSecret(plaintext: string): string {
  if (!plaintext) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts sensitive text encrypted with encryptSecret.
 * Returns empty string on decryption failure, or original string if not in encrypted format.
 */
export function decryptSecret(cipherString: string): string {
  if (!cipherString) return "";
  try {
    const parts = cipherString.split(":");
    if (parts.length !== 3) return cipherString;
    const [ivHex, tagHex, dataHex] = parts;
    if (!ivHex || !tagHex || !dataHex) return cipherString;
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const data = Buffer.from(dataHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(tag);
    return decipher.update(data) + decipher.final("utf8");
  } catch {
    return "";
  }
}
