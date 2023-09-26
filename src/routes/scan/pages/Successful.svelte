<script>
  import { onMount } from "svelte";
  import {
    PUBLIC_BE_URL as BE_URL,
    PUBLIC_BE_PORT as BE_PORT,
    PUBLIC_GET_SIGNATURE_BY_UUID_ENDPOINT as GET_SIGN_UUID_ENDPOINT,
    PUBLIC_GET_USER_BY_UUID as GET_USER_BY_UUID_ENDPOINT,
  } from "$env/static/public";
  import axios from "axios";
  import {
    padString,
    templates,
    updateFinalQRValue,
    prepareFormField,
  } from "../../create/lib/utils.svelte";

  import QRCode, { qrcode } from "$lib/QRJS.svelte";

  export let qrCodeValue = {};

  import { verify } from "../lib/signingUtils.svelte";
  import { openModal } from "svelte-modals";
  import Modal from "../../../lib/Modal.svelte";

  let qrCodeObject = JSON.parse(qrCodeValue);
  console.log("qrCodeObject.fields[0]: ", qrCodeObject.fields[0]);

  let authorUUID = qrCodeObject.author;

  let currentTemplate = templates[0];

  for (let i = 0; i < currentTemplate.fields.length; i++) {
    currentTemplate.fields[i].value = qrCodeObject.fields[i];
  }

  let formData = "";

  console.log(JSON.stringify(authorUUID));

  let sender = {
    name: "Sender name",
    certificateInfo: "Certificate info",
  };

  let success = null;

  $: if (typeof qrCodeValue !== "object") {
    try {
      qrCodeValue = JSON.parse(qrCodeValue);
    } catch (error) {}
  }

  const getUserByUUID = async (uuid) => {
    if (!uuid) {
      console.log("uuid not presented");
      return false;
    }
    const options = {
      method: "GET",
      url: `${BE_URL}:${BE_PORT}${GET_USER_BY_UUID_ENDPOINT}/${uuid}`,
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log("error: ", error);
      return false;
    }
  };

  onMount(async () => {
    const responseFromVerify = await verify(qrCodeValue);

    success = responseFromVerify;
    console.log("responseFromVerify: ", responseFromVerify);

    sender = await getUserByUUID(authorUUID);

    const result = qrcode.makeCode(padString(JSON.stringify(qrCodeObject)));
    console.log("qrCode: ", padString(JSON.stringify(qrCodeObject)));
    console.log("result: ", result);

    //   formData = qrCodeObject.fields.forEach((field) => {
    //   return field.value;
    // });

    if (!sender) {
      console.log("Couldn't fetch the author");
      return;
    }
  });

  const preparePublicKey = (publicKeyStr) => {
    publicKeyStr = publicKeyStr.replace(
      "-----BEGIN PUBLIC KEY-----",
      "-----BEGIN PUBLIC KEY-----<br>"
      // ""
    );

    publicKeyStr = publicKeyStr.replace(
      "-----END PUBLIC KEY-----",
      "<br>-----END PUBLIC KEY-----"
      // ""
    );

    return publicKeyStr;
  };

  const reloadQRcode = async () => {
    qrcode.makeCode(padString(JSON.stringify(qrCodeObject)));
    console.log("finalQRCodeValue: ", padString(JSON.stringify(qrCodeObject)));
  };
</script>

{#if success !== null}
  <div>
    <p>Verification was {success ? "successful" : "unsuccessful"}!</p>
    <p>Check your document below:</p>
  </div>
  <!-- <div class="doc-preview">Your document will be there.</div> -->
  <!-- <div class="doc-preview"> -->
  <div class="form-container">
    <div class="form">
      <h3>{currentTemplate.header}</h3>
      <p>
        Student jménem {@html prepareFormField(currentTemplate.fields[0], true)}
        studuje na škole
        {@html prepareFormField(currentTemplate.fields[1], true)}
        od
        {@html prepareFormField(currentTemplate.fields[2], true)}
        do
        {@html prepareFormField(currentTemplate.fields[3], true)}
      </p>
      <div on:click={reloadQRcode} class="qr-code" id="qr-code">
        <QRCode codeValue={"ahoj"} squareSize="420" />
      </div>
    </div>
  </div>
  <div class="sender-info">
    <p><strong>Sender:</strong> {sender.name}</p>
    <p><strong>Sender e-mail:</strong> {sender.email}</p>
    <p>
      <strong>Sender publicKey:</strong>
      <span
        id="public-key"
        on:keydown={() => {}}
        on:click={() => {
          openModal(Modal, {
            title: "Author's public key",
            message: preparePublicKey(sender?.publicKey),
          });
        }}
      >
        {sender.publicKey?.substring(1, 70)}...
      </span>
    </p>
    <!-- </p> -->
  </div>
{/if}

<style>
  .doc-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 800px;
    border: solid 1px black;
  }
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
  h3 {
    font-size: 28px;
  }

  * {
    font-size: 15px;
  }
  .sender-info {
  }

  #public-key {
    margin-bottom: 10px;
  }

  #public-key:hover {
    cursor: pointer;
  }
  @page {
    size: A4;
    margin: 0;
  }
</style>
