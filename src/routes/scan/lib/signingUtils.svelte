<script context="module">
  import axios from "axios";
  import {
    PUBLIC_BE_URL as BE_URL,
    PUBLIC_BE_PORT as BE_PORT,
    PUBLIC_GET_SIGNATURE_BY_UUID_ENDPOINT as GET_SIGN_UUID_ENDPOINT,
    PUBLIC_GET_USER_BY_UUID as GET_USER_BY_UUID_ENDPOINT,
  } from "$env/static/public";

  /**
   * Functions "library"
   **/

  /*
  Convert a string into an ArrayBuffer
  from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  */
  function stringToarrayBuffer(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  /*
  Import a PEM encoded RSA public key, to use for RSA-OAEP encryption.
  Takes a string containing the PEM encoded key, and returns a Promise
  that will resolve to a CryptoKey representing the public key.
  */
  function importPublicKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(
      pemHeader.length,
      pem.length - pemFooter.length
    );
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = stringToarrayBuffer(binaryDerString);

    return window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      true,
      ["verify"]
    );
  }

  const getEntityByUUID = async (entityEndpoint, uuid) => {
    if (!entityEndpoint) {
      console.log("entityEndpoint not presented");
      return false;
    }

    if (!uuid) {
      console.log("uuid not presented");
      return false;
    }
    const options = {
      method: "GET",
      // url: `http://localhost:8079/${entityEndpoint}/${uuid}`,
      url: `${BE_URL}:${BE_PORT}${entityEndpoint}/${uuid}`,
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log("error: ", error);
      return false;
    }
  };

  /**
   * Async function for verifying a message
   * @param {*} publicKey
   * @param {*} signature
   * @param {*} message
   * @returns
   */
  const verifyMessage = async (publicKey, signature, message) => {
    /** Encode the message */
    let enc = new TextEncoder();
    let encodedText = enc.encode(message);

    let result = await window.crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      signature,
      encodedText
    );
    return result;
  };

  export const verify = async (qrCodeValue) => {
    if (!qrCodeValue) {
      console.log("No qr code value");
      return false;
    }

    let authorUUID;

    try {
      authorUUID = qrCodeValue.author;
    } catch (error) {
      console.log("error: ", error);
      return false;
    }

    let signatureUUID;

    try {
      signatureUUID = qrCodeValue.signature;
    } catch (error) {
      console.log("error(couldnt get signature uuid from qrCode): ", error);
    }

    let message;

    try {
      const qrCodeValueNoSignature = qrCodeValue;
      qrCodeValueNoSignature.signature = "";
      message = JSON.stringify(qrCodeValueNoSignature);
      console.log(message);
    } catch (error) {
      console.log("error: ", error);
    }

    let signatureValue;

    try {
      signatureValue = await getEntityByUUID(
        GET_SIGN_UUID_ENDPOINT,
        signatureUUID
      );
      signatureValue = signatureValue.value;
      const signatureBack = atob(signatureValue);
      const array = signatureBack.split(",");
      const signatureUint8Array = new Uint8Array(array);
      signatureValue = signatureUint8Array;
    } catch (error) {
      console.log("error: ", error);
    }

    let author;

    try {
      author = await getEntityByUUID(GET_USER_BY_UUID_ENDPOINT, authorUUID);
    } catch (error) {
      console.log("error: ", error);
    }

    let publicKey;

    try {
      publicKey = await importPublicKey(author.publicKey);
    } catch (error) {
      console.log("error: ", error);
    }

    try {
      console.log("publicKey: ", publicKey);
      console.log("signatureValue: ", signatureValue);
      console.log("message: ", message);
      const response = await verifyMessage(publicKey, signatureValue, message);
      console.log("response: ", response);
      return response;
    } catch (error) {
      console.log("error: ", error);
    }
  };
</script>
