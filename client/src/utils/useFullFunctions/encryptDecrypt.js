import CryptoJS from "crypto-js";
const key = "CVdvt9=i#O7ac--C#;h4{&^'9ya]lT~)yR#Pmn8beXAQ'1C^L";

export const encryptData = (data) => {
  // Encrypt
  let cipherText = CryptoJS.AES.encrypt(data, key).toString();

  return cipherText;
};

export const decryptedData = (data) => {
  // Decrypt
  let cipherText = CryptoJS.AES.decrypt(data, key);
  var originalText = cipherText.toString(CryptoJS.enc.Utf8);

  return originalText;
};
