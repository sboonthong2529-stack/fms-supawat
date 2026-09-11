import { describe, it, expect } from "vitest";
import { encryptSecret, decryptSecret } from "./crypto";

describe("crypto encryption at rest", () => {
  it("should encrypt and decrypt plaintext accurately", () => {
    const original = "abcd efgh ijkl mnop";
    const encrypted = encryptSecret(original);
    expect(encrypted).not.toBe(original);
    expect(encrypted).toContain(":");

    const decrypted = decryptSecret(encrypted);
    expect(decrypted).toBe(original);
  });

  it("should return empty string for empty input", () => {
    expect(encryptSecret("")).toBe("");
    expect(decryptSecret("")).toBe("");
  });

  it("should return fallback for unencrypted string", () => {
    expect(decryptSecret("plain_password_1234")).toBe("plain_password_1234");
  });
});
