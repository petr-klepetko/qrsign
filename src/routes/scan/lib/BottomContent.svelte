<script>
  export let scanCompleted = false;
  export let fileinput;
  export let qrCodeValue;
  export let scannerIsLoaded = false;
  export let refreshScanning;
  import Center from "$lib/Center.svelte";
  import Button from "$lib/Button.svelte";
  import Spacer from "$lib/Spacer.svelte";

  import { createEventDispatcher } from "svelte";
  import { openModal } from "svelte-modals";
  import Modal from "../../../lib/Modal.svelte";

  const dispatch = createEventDispatcher();

  const parseQRcode = (value) => {
    if (typeof value === "undefined") {
      return false;
    }
    try {
      let result = decodeURI(value);
      result = JSON.parse(result);
      result = JSON.stringify(result, null, 4);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  let qrCodeValuePretty = parseQRcode(qrCodeValue);
</script>

{#if !scanCompleted}
  <Center direction="column">
    <div id="textOr">or</div>
  </Center>
  <Center direction="column">
    <Button
      on:click={() => {
        if (!scannerIsLoaded) {
          openModal(Modal, {
            title: "Error",
            message: "Wait for the scanner to load, please",
          });
          return;
        }
        fileinput.click();
        // console.log("button clicked");
      }}>Upload an image</Button
    >
  </Center>
{:else}
  <Center direction="column">
    <p>Text from your code:</p>
    <Spacer height="20px" />
    <div class="qrcode-value">
      Parsed JSON:
      <pre>{qrCodeValuePretty}</pre>
    </div>
    <Spacer height="20px" />
    <Button
      on:click={() => {
        dispatch("read", "upload");
      }}>OK, continue</Button
    >
    <div id="textOr">or</div>
    <Button
      on:click={async () => {
        // console.log("Try again button clicked");
        refreshScanning();
        // qrCodeValue = null;
        // uploadedImage = null;
        // scanningIsLoaded = false;
        // await html5QrCodeSetup();
      }}>Try again</Button
    >
  </Center>
{/if}

<style>
  #textOr {
    margin: 10px auto;
  }
  p {
    margin: 0 0 10px 0;
  }
  .qrcode-value {
    margin-left: 10px;
    max-width: 100%;
    overflow-x: scroll;
  }

  pre {
    margin-left: 10px;
  }
</style>
