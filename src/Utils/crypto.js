import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";

export const encryption = (text, secretKey) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decryption = (text, secretKey) => {
    const byte = CryptoJS.AES.decrypt(text, secretKey);
    return byte.toString(CryptoJS.enc.Utf8);
};

export const hashing = (text, salt) => {
    return bcrypt.hashSync(text, salt);
};

export const comparing = async (text, textDB) => {
    return bcrypt.compare(text, textDB);
};
