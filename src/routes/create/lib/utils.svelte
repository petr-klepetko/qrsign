<script context="module">
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
    console.log(str.length);
    if (str.length <= 217 && str.length >= 192) {
      console.log("192 - 217");
      return str.padEnd(218);
    } else {
      console.log("Je to OK");
      return str;
    }
  };

  export const prepareFormField = (field) => {
    try {
      field.value != "" ? field.value : `[${field.name}]`;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  export const updateFinalQRValue = async (
    signingUtility,
    finalQRCodeValue,
    currentTemplate
  ) => {
    /** Create an array of just the values and encode special characters as if for a URL */
    finalQRCodeValue.signature = "";
    finalQRCodeValue.fields = currentTemplate.fields.map((field) =>
      encodeURI(field.value)
    );

    // finalQRCodeValue.signature = await signingUtility.sign(
    //   signingUtility.keys.private,
    //   JSON.stringify(finalQRCodeValue.fields),
    //   "b64"
    // );
    finalQRCodeValue.signature = "f5c3e1e7-3a8d-49cd-a935-602e111dd5cd";
    finalQRCodeValue.author = "862f0a18-bd07-4ada-8b17-984f931382ba";

    /** Pad to certain number because of the character counting error in the library*/

    return finalQRCodeValue;
  };
</script>
