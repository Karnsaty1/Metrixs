// frontendDecrypt.js
export async function decryptAESGCM(data, keyHex) {
  const [ivHex, authTagHex, encryptedHex] = data.split(":");

  const iv = hexToUint8Array(ivHex);
  const authTag = hexToUint8Array(authTagHex);
  const encryptedBytes = hexToUint8Array(encryptedHex);

  // Combine encrypted + authTag (Web Crypto expects it together)
  const encryptedWithTag = new Uint8Array(encryptedBytes.length + authTag.length);
  encryptedWithTag.set(encryptedBytes);
  encryptedWithTag.set(authTag, encryptedBytes.length);

  const key = await crypto.subtle.importKey(
    "raw",
    hexToUint8Array(keyHex),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedWithTag
  );

  return new TextDecoder().decode(decryptedBuffer);
}

// Helper: convert hex string to Uint8Array
function hexToUint8Array(hex) {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex");
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return arr;
}
