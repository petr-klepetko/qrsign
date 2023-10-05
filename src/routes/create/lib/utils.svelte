<script context="module">
  import axios from "axios";
  import {
    PUBLIC_BE_URL as BE_URL,
    PUBLIC_BE_PORT as BE_PORT,
    PUBLIC_SIGN_MESSAGE_ENDPOINT as SIGN_MESSAGE_ENPOINT,
  } from "$env/static/public";

  export let finalQRCodeValue = {
    templateId: 1,
    fields: [],
    signature: "",
    author: "",
  };

  export let templates = [
    {
      id: 1,
      header: "Potvrzení o studiu",
      fields: [
        { id: 1, name: "Jméno", value: "" },
        { id: 2, name: "Škola", value: "" },
        { id: 3, name: "Datum od", value: "" },
        { id: 4, name: "Datum do", value: "" },
      ],
      html: `
        <div></div>
        `,
    },
  ];

  /** Functions*/
  export const padString = (str) => {
    // console.log(str.length);
    if (str.length <= 217 && str.length >= 192) {
      console.log("192 - 217");
      return str.padEnd(218);
    } else {
      // console.log("Je to OK");
      return str;
    }
  };

  const sanitize = (string) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    const reg = /[&<>"'/]/gi;
    return string.replace(reg, (match) => map[match]);
  };

  export const prepareFormField = (field, decodeUri = false) => {
    console.log(field);

    if (decodeUri) {
      field.value = decodeURI(field.value);
    }
    try {
      return field.value != ""
        ? `<strong>${sanitize(field.value)}</strong>`
        : `<strong>[${field.name}]</strong>`;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  export const getSignatureUUID = async (
    qrCodeValue,
    previousSignatureUUID
  ) => {
    // console.log("previousSignature: ", previousSignatureUUID);
    // console.log('previousSignatureUUID === "": ', previousSignatureUUID === "");
    const uuid =
      typeof previousSignatureUUID === "" ? "" : previousSignatureUUID;
    // console.log("uuid: ", uuid);
    console.log("previousSignatureUUID: ", previousSignatureUUID);
    const options = {
      method: "POST",
      // url: `http://localhost:8079/crypto/sign-message/${uuid}`,
      url: `${BE_URL}:${BE_PORT}${SIGN_MESSAGE_ENPOINT}/${uuid}`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      sameSite: "None",
      data: {
        message: qrCodeValue,
      },
    };

    let response = false;
    try {
      response = await axios.request(options);
      // console.log("response.data: ", response.data.signatureUUID);
    } catch (error) {
      console.error(error);
    }

    if (!response) {
      return "";
    }
    return response.data.signatureUUID;
  };

  export const updateFinalQRValue = async (
    signingUtility,
    finalQRCodeValue,
    currentTemplate
  ) => {
    /** Create an array of just the values and encode special characters as if for a URL */

    // finalQRCodeValue.signature = "";
    finalQRCodeValue.fields = currentTemplate.fields.map((field) =>
      encodeURI(field.value)
    );

    // finalQRCodeValue.signature = await signingUtility.sign(
    //   signingUtility.keys.private,
    //   JSON.stringify(finalQRCodeValue.fields),
    //   "b64"
    // );
    // finalQRCodeValue.signature = "f5c3e1e7-3a8d-49cd-a935-602e111dd5cd";
    finalQRCodeValue.author = "036ee0a2-807c-4d71-aca0-55a5edfab8a2";
    finalQRCodeValue.signature = "";

    console.log(
      "JSON.stringify(finalQRCodeValue): ",
      JSON.stringify(finalQRCodeValue)
    );

    finalQRCodeValue.signature = await getSignatureUUID(
      JSON.stringify(finalQRCodeValue),
      finalQRCodeValue.signature
    );

    // console.log("finalQRCodeValue.signature: ", finalQRCodeValue.signature);

    /** Pad to certain number because of the character counting error in the library*/

    return finalQRCodeValue;
  };
</script>
