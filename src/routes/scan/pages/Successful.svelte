<script>
  import { onMount } from "svelte";

  export let qrCodeValue = {};

  // import { signingUtility } from "../../create/SigningUtility.svelte";
  import { verify } from "../lib/signingUtils.svelte";

  console.log("qrCodeValue: ", qrCodeValue);
  let sender = {
    name: "Sender name",
    certificateInfo: "Certificate info",
  };

  $: if (typeof qrCodeValue !== "object") {
    console.log("typeof(qrCodeValue): ", typeof qrCodeValue);
    try {
      qrCodeValue = JSON.parse(qrCodeValue);
    } catch (error) {}
  }

  onMount(async () => {
    const responseFromVerify = await verify(qrCodeValue);
    console.log("responseFromVerify: ", responseFromVerify);
  });
</script>

<div>
  <p>Verification was successfull!</p>
  <p>Check your document below:</p>
</div>
<div class="doc-preview">Your document will be there.</div>
<div class="sender-info">
  <p><strong>Sender:</strong> {sender.name}</p>
  <p><strong>Certificate:</strong> {sender.certificateInfo}</p>
</div>

<style>
  .doc-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 800px;
    border: solid 1px black;
  }
  .sender-info {
  }
</style>
