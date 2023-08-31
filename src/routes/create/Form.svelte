<script>
  import { onMount, onDestroy } from "svelte";
  import Device from "svelte-device-info";
  import Button from "../../lib/Button.svelte";
  import Center from "$lib/Center.svelte";

  import QRCode, { qrcode } from "$lib/QRJS.svelte";
  // import DigitalSignature, {
  //   sig,
  //   signText2,
  //   validateText,
  //   // rsaPrivateKey,
  // } from "$lib/DigitalSignature.svelte";
  import SigningUtility, { signingUtility } from "./SigningUtility.svelte";

  let debug = false;
  let editMode = true;

  let finalQRCodeValue = {
    templateId: 1,
    fields: [],
    signature: "",
  };

  const padString = (str) => {
    console.log(str.length);
    if (str.length <= 217 && str.length >= 192) {
      console.log("192 - 217");
      return str.padEnd(218);
    } else {
      console.log("Je to OK");
      return str;
    }
  };

  const updateFinalQRValue = async () => {
    /** Create an array of just the values and encode special characters as if for a URL */
    finalQRCodeValue.fields = currentTemplate.fields.map((field) =>
      encodeURI(field.value)
    );

    console.log("text: ", JSON.stringify(finalQRCodeValue.fields));
    finalQRCodeValue.signature = await signingUtility.sign(
      signingUtility.keys.private,
      JSON.stringify(finalQRCodeValue.fields),
      "b64"
    );

    /** Pad to certain number because of the character counting error in the library*/
    //padString(JSON.stringify(finalQRCodeValue.fields));

    return finalQRCodeValue;
  };

  const reloadQRcode = async () => {
    finalQRCodeValue.signature = "";
    await updateFinalQRValue();

    const textForQR = padString(JSON.stringify(finalQRCodeValue));

    console.log("textForQR: ", textForQR);
    qrcode.makeCode(
      `{"templateId":1,"fields":["as","","",""],"signature":"eNo9U7uu6yAQ/CU/y1NYgQIpYEWxi9QurNglBYavvzODcwukZL3szgu/rOlppuiXdXyaz/A0Lvmciv+mDif75Yz+YI/t/CP14Z2uYM44647v2I9vJTxSDuYTw7KhfhbU2vmtGQ3ONau+9k/zwh2P72vG3Yyey5cd3yx2W+x6sQfHNfMDdx/Yd/x2WdZT0J0Xaq5FbQRe/F9jECbbCes3Dbh/+WOLszhMF+qZtWCIZQfuTbzUZ14xlA8xAtc6VIx2DJnY10gthNVwnnbzeyHO2uOxg3hc49/8j53Lhu8bdLWXlz4O+hDjyd3AS77cZ3nIN4fFxopvy7eGV1iIy1EvcODMcxTud+rB/dbXUyPySdSM2Csv7Dtsg/8DejPxV+2oh2vR20HPDN1jOFbiIa+kmvFR3Bfg/lI34kAffTY7MkCcL2j1IdYOGeiVGc7MqcXvUvFbzJGH6NtH6cr6sdNv8Q/0RRquwOVHcg3fiqtm0/X3aeh3EC7utpewFf/jyXl9xYud5YTmDvvlLfTxw50PZMZFZe9gZpTZgV4y38zT7WfirOo9teRO5e5SDqFDfSfKhDTlW/CL7t+e0a99EHbwpM++IEfaw2ySr3jfHnA+fXBFnpHDob440xfldCLeTC1m5qjuY89wc2yJ29e80SNotzecqRm4I/2pwWIvec5dB3Okd9FWT1yshzvORtr+eC8f5psaFb0B1KovymHW2y1TrLmR7+LEbNV3MKXb64RdXc2nfGTGMWu/Z9WMVN3+zy9h+vv7B99wn/c="}`
    );
    console.log("Reloaded");
    //console.log(JSON.stringify(currentData).padEnd(1000, "x"));
  };

  let templates = [
    {
      id: 1,
      header: "Potvrzení o studiu",
      fields: [
        { id: 1, name: "Jméno" },
        { id: 2, name: "Škola" },
        { id: 3, name: "Datum od" },
        { id: 4, name: "Datum do" },
      ],
      html: `
      <div></div>
      `,
    },
  ];

  let currentTemplate = {
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
  };

  console.log(currentTemplate.fields[0]);
  let formData = currentTemplate.fields.forEach((field) => {
    return field.value;
  });

  let currentData = currentTemplate.fields.map((field) => field.value);

  onMount(async () => {
    await signingUtility.init();
  });
</script>

<!-- {currentTemplate.fields[0].value} -->

<div class="form-container">
  <div class="form">
    <h3>{currentTemplate.header}</h3>
    {#if editMode}
      <p>
        Student jménem <input
          bind:value={currentTemplate.fields[0].value}
          on:change={() => {
            //console.log(currentTemplate.fields[0].value);
            reloadQRcode();
          }}
          placeholder="Jméno"
        />
        studuje na škole
        <input
          placeholder="Škola"
          bind:value={currentTemplate.fields[1].value}
          on:change={() => {
            //console.log(currentTemplate.fields[0].value);
            reloadQRcode();
          }}
        />
        od
        <input
          type="date"
          placeholder="Datum od"
          bind:value={currentTemplate.fields[2].value}
          on:change={() => {
            //console.log(currentTemplate.fields[0].value);
            reloadQRcode();
          }}
        />
        do
        <input
          type="date"
          placeholder="Datum do"
          bind:value={currentTemplate.fields[3].value}
          on:input={() => {
            //console.log(currentTemplate.fields[0].value);
            reloadQRcode();
          }}
        />
      </p>
    {:else}
      <p>
        Student jménem <strong
          >{currentTemplate.fields[0].value != ""
            ? currentTemplate.fields[0].value
            : `[${currentTemplate.fields[0].name}]`}</strong
        >
        studuje na škole
        <strong
          >{currentTemplate.fields[1].value != ""
            ? currentTemplate.fields[1].value
            : `[${currentTemplate.fields[1].name}]`}</strong
        >
        od
        <strong
          >{currentTemplate.fields[2].value != ""
            ? currentTemplate.fields[2].value
            : `[${currentTemplate.fields[2].name}]`}</strong
        >
        do
        <strong
          >{currentTemplate.fields[3].value != ""
            ? currentTemplate.fields[3].value
            : `[${currentTemplate.fields[3].name}]`}</strong
        >
      </p>
    {/if}
    <div class="qr-code" id="qr-code">
      <!-- <svelte:component this={QRcomponent} url={"https://github.com/"} /> -->
      <!-- <DigitalSignature /> -->
      <QRCode codeValue={JSON.stringify(formData ?? "")} squareSize="420" />

      <!-- <QrCode value="https://github.com/" /> -->
      <!-- <img src="/src/img/ahoj_kod.png" alt="qrCode" /> -->
    </div>
  </div>
  {#if editMode}
    <Button on:click={() => (editMode = false)}>Save</Button>
  {:else}
    <Center>
      <Button on:click={() => (editMode = true)} cssClass={"small"}>Back</Button
      >
      <Button
        on:click={() => {
          window.print();
        }}
        cssClass={"small"}>Print</Button
      >
    </Center>
  {/if}
</div>
{#if debug}
  <Center>
    <Center direction="column"
      >Final QR code value:
      <pre>{JSON.stringify(finalQRCodeValue, null, 4)}</pre>
    </Center>
    <Center direction="column">
      Current data:<br />
      <pre>{JSON.stringify(currentData, null, 4)}</pre>
    </Center>
  </Center>
{/if}

<style>
  .form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .form {
    width: calc(100vw - 50px);
    height: calc((100vw - 50px) * 1.414);
    max-width: 50vh;
    max-height: 70vh;
    /* margin: 10px 0; */
    padding: 5px 10px;
    border: 1px solid;
  }
  .qr-code {
    width: 100%;
    /* height: 100%; */
    display: flex;
    justify-content: left;
    margin: 0;
    padding: 0;
    padding-top: 3px;
    /* background-color: pink; */
  }

  img {
    size: 100px;
  }

  @page {
    size: A4;
    margin: 0;
  }
  @media print {
    .form {
      width: 21cm;
      min-height: 29.7cm;
      padding: 2cm;
      margin: 1cm auto;
      background: white;
      border: initial;
      border-radius: initial;
      page-break-after: always;
    }

    .form-container {
      margin: 0;
      padding: 0;
    }

    .qr-code {
      width: 100%;
    }

    h3 {
      font-size: 28px;
    }

    * {
      font-size: 15px;
    }
  }
</style>
