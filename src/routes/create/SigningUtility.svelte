<script context="module">
  import { text } from "svelte/internal";
  import axios from "axios";
  //   import item from "./public.pem";

  const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwWfVXLvBZ3XECHQFeOKVoCAMO3LohaQGlZA2Tq5gJQmTvMNK1hcN+zk6fj3eCkeJX2z4U83iODOXVjbBKXCIhcWGuGZPHMEncse+d4pIERE7mKSutGoOQ5+3GANv8nHRRCt6Yq5Q+U//yiavdD8Pls2QFGI6Z9pFEgzHsSju1v8gKAEdg5YK7rgUJ/NLn+oU4CGcS5vcS3F+/ETAM/eVgxui/CnWTi7zjlh/law0bLcIxMoyzrNof/DDR/jjY3iMyX7ZiE5Fw6bbeePujauxymPRFXIPwuUHN7XdxBCfsSEXOh/PYhk9mjAs3rVviNuv4exIhFpmviZdf22GjjWDjAgMBAAECggEABlvH/9O+cM8OMxBOq1IJjL21NoT45Rl/KLJ51tg6DCNrtkAhaNAg42KW7SPkID4YViiejWzV7PFEHDYWpCe8R05qQjfD30u7bgywYhX4Q9UeryfO3lf1ZHUoWppPVEVj4EQvEHwnRTQMJ3eVTcwyuQaF1bUz9xMv27OLSkTG8F+hXkegD/s3ZodiriSniuInTj6E5iJj2heA6VpLZpIQIpxhitLSy8aCtDLJi2Mw5v+26yEl3znq/vB7F/RMlJWaNlqQU+RpnevpSsw4WnFemimXNmjaopgySQhAos+CL6Gdvg59Cvtj/NQKobBXKmQZi0Lf1yyTu6Ay9CiCZDCduQKBgQD2XsjnPYZ9c9f93sbyFNA+BWgAnIpgDBKiC3UbK+g+KCVWpQAmEDEDDi6KG2odnM+2Nwm4yr4uXBzNKm5CP7JhOZYsnf0tMQerzLt+WjJt3mSw+qbRb0JY/ZWxs4RtTvZhMmVUzcC1F7xQo7ctxCxGh4rZbrBgOBso09XgpBGrbwKBgQC3Po4dxTI8c6CYZCjNswWjyF35Z5i36KHDrPqT+RXLHbUpwEw4exZr+I+W2n/f+xrHTvrkjaCJOJus19aKfaIxIVRaKBxLgzYW6Nd5UGakHTq48hU+3JgS0uJ6w6iSg8YZFJSwbu+/xMmA+NOHMwe6a14sH+H0itS/U9pTh3H3zQKBgCZNlDSHVzp34TPCB/IpFDsgQgweSlEmb1ssJtfDmsbXHP78hipkyAnukYO9QWE7OPveUK+fLbQtc/jdyOiZ2JTPDC8BnRQClGu8V8YMJdz4/3SYc4kKICmPu082Vrdb2GhCGoj1uCkveIKdAWSnJC8O8aJeWCONdYOCc7UKLQkXAoGAMvMTtLdVpnVH29dNeRQjp0xYxLXHQqtN/wgji+0f4B/cdUVga/vdWhv8YKdUEsTQx0XwgIfYcQ7qSf6hSlRwOlTYDVFFvME40tnev35Za5ws7atxuM7BAcrc6eFpB4PYGrUcOoo94wYmONP2jIrlxTGBN6eNvd60FJaOB9eLGqkCgYBf9tOoaVBMHdRb00DDM+Y/lE1ZjvSaCpTDW4ZCQK/W7FBL5ZwMI7SRPo8sKTCSC3Atn7k81rY4jkGPM099rJG9IkhtAOq3+8EHgZLE8L/209svTvLqmpyScXhaK9w6eiYaGSkHbAxOsoOr2AqHicyNNWhWihOtkfnKJvjoZsNduQ==
-----END PRIVATE KEY-----`;

  const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsFn1Vy7wWd1xAh0BXjil
aAgDDty6IWkBpWQNk6uYCUJk7zDStYXDfs5On493gpHiV9s+FPN4jgzl1Y2wSlwi
IXFhrhmTxzBJ3LHvneKSBERO5ikrrRqDkOftxgDb/Jx0UQremKuUPlP/8omr3Q/D
5bNkBRiOmfaRRIMx7Eo7tb/ICgBHYOWCu64FCfzS5/qFOAhnEub3EtxfvxEwDP3l
YMbovwp1k4u845Yf5WsNGy3CMTKMs6zaH/ww0f442N4jMl+2YhORcOm23nj7o2rs
cpj0RVyD8LlBze13cQQn7EhFzofz2IZPZowLN61b4jbr+HsSIRaZr4mXX9tho41g
4wIDAQAB
-----END PUBLIC KEY-----`;

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

  /*
  Import a PEM encoded RSA private key, to use for RSA-PSS signing.
  Takes a string containing the PEM encoded key, and returns a Promise
  that will resolve to a CryptoKey representing the private key.
  */
  function importPrivateKey(pem, format = "object") {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(
      pemHeader.length,
      pem.length - pemFooter.length
    );
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = stringToarrayBuffer(binaryDerString);

    return window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        // Consider using a 4096-bit key for systems that require long-term security
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign"]
    );
  }

  /**
   * Async function for signing a message
   * @param {key} privateKey
   * @param {string} message
   * @param {string} format
   */
  const signMessage = async (privateKey, message, format = "array") => {
    /** Encode the message */
    const enc = new TextEncoder();
    const encodedMessage = enc.encode(message);

    /** Create a signature */
    const signature = await window.crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      encodedMessage
    );

    /** Put the signature into a Uint8Array, so it can be manipulated */
    const textSignature = new Uint8Array(signature);

    if (format == "b64") {
      return btoa(textSignature);
    }
    return textSignature;
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

  /**------------------------------------------------------------------*/

  export const signingUtility = {};

  /**
   * Constructor
   */
  signingUtility.init = async () => {
    signingUtility.keys = {};

    try {
      signingUtility.keys.public = await importPublicKey(publicKeyPem);
    } catch (err) {
      console.log(`Error while getting the public key. ${err}`);
      return;
    }

    try {
      signingUtility.keys.private = await importPrivateKey(privateKeyPem);
    } catch (err) {
      console.log(`Error while getting the private key`);
    }

    signingUtility.sign = signMessage;
  };
</script>
