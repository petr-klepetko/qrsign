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
    const uuid =
      typeof previousSignatureUUID === "" ? "" : previousSignatureUUID;
    const options = {
      method: "POST",
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
    } catch (error) {
      if (error?.response?.data?.message === "No user ID") {
        //TODO redirect na login
        console.log("You have to login");
        //TODO hláška
      } else {
        console.error(error);
      }
    }

    if (!response) {
      return "";
    }
    return response.data.signatureUUID;
  };

  export const updateFinalQRValue = async (
    finalQRCodeValue,
    currentTemplate
  ) => {
    /** Create an array of just the values and encode special characters as if for a URL */

    finalQRCodeValue.fields = currentTemplate.fields.map((field) =>
      encodeURI(field.value)
    );

    const previousSignatureUUID = finalQRCodeValue.signature;
    finalQRCodeValue.signature = "";

    console.log(
      "JSON.stringify(finalQRCodeValue): ",
      JSON.stringify(finalQRCodeValue)
    );

    finalQRCodeValue.signature = await getSignatureUUID(
      JSON.stringify(finalQRCodeValue),
      previousSignatureUUID
    );

    return finalQRCodeValue;
  };
</script>
