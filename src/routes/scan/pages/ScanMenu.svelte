<script context="module">
  import { onDestroy, onMount } from "svelte";
  import Device from "svelte-device-info";
</script>

<script>
  import Button from "$lib/Button.svelte";
  import Center from "$lib/Center.svelte";
  import Spacer from "$lib/Spacer.svelte";
  import Modal from "$lib/Modal.svelte";

  import { createEventDispatcher } from "svelte";
  import { Html5Qrcode } from "html5-qrcode";

  import { openModal } from "svelte-modals";
  import DigitalSignature, {
    sig,
    publicKey,
  } from "$lib/DigitalSignature.svelte";
  import ScannerLoader from "../lib/ScannerLoader.svelte";

  const dispatch = createEventDispatcher();

  let uploadedImage, fileinput, qrCodeValue, qrCodeValuePretty, validSignature;

  let readerElement;

  let scanningIsLoaded = false;
  // let endLiveScanning = false;
  let uploadEnabled = false;

  //* Creating empty functions so they are always defined. */
  let onFileSelected = () =>
    console.log("Spustila se puvodni prazdná funkce onFileSelected.");
  let html5QrCode = () => null;

  /**
   * Live scanning
   */

  const liveScanOnSuccess = async (decodedText, decodedResult) => {
    scanningIsLoaded = true;
    await stopLiveScan();
    qrCodeValue = decodedText;
    console.log("LiveScan successful, decodedText: ", decodedText);
  };

  const liveScanOnError = (errorMessage) => {
    console.log("I tried, but saw no code. ");
    console.log();
    if (!scanningIsLoaded) {
      scanningIsLoaded = true;
    }
  };

  const stopLiveScan = async () => {
    try {
      await html5QrCode.stop();
      console.log("Stopping the scanning");
    } catch (err) {
      console.log("error while stopping: ", err ?? "No error info");
    }
  };

  const html5QrCodeSetup = async () => {
    html5QrCode = new Html5Qrcode(/* element id */ "reader");
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length && !qrCodeValue) {
        const cameraId = devices[0].id;
        const options = {
          // fps: 6, // Optional, frame per seconds for qr code scanning
          // qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
        };

        html5QrCode.start(
          cameraId,
          options,
          liveScanOnSuccess,
          liveScanOnError
        );
      }
    } catch (err) {
      console.log("Error on starting the camera: ", err ?? "No error info");
      openModal(Modal, {
        title: "Error while starting the camera",
        message: err ?? "No error info",
      });
    }
  };

  const parseQRcode = (value) => {
    let result = decodeURI(value);
    result = JSON.parse(result);
    result = JSON.stringify(result, null, 4);
    console.log(result);
    return result;
  };

  /**
   * Scan file
   */

  const scanOnSuccess = (decodedText) => {
    qrCodeValue = decodedText;
    try {
      qrCodeValuePretty = parseQRcode(qrCodeValue);
    } catch (e) {
      console.log(e);
    }
    console.log("Succesfull scan from file: ", qrCodeValue);
  };

  const scanOnError = async (err) => {
    console.log(`Error scanning file. Reason: ${err ?? "No error provided. "}`);
    openModal(Modal, {
      title: "Error scanning file",
      message: err ?? "No error info",
    });
    uploadedImage = null;
    // await fileUploadSetup();
    /** Live (camera) scan setup*/
    await html5QrCodeSetup();
    // await html5QrCode.start()
  };

  /** Initial setup of the file uploading */
  const fileUploadSetup = async () => {
    onFileSelected = async (e) => {
      console.log(
        "File upload selected.\nWaiting for the live scanner to stop."
      );
      try {
        await stopLiveScan();
      } catch (err) {
        console.log(`error while stopping: ${err}`);
        return;
      }

      console.log("Live scanner has stopped, continuing. ");

      let reader = new FileReader();
      let image = e.target.files[0];

      if (!image) {
        console.log("Image was not found in the uploaded files");
      }

      uploadedImage = null;

      reader.readAsDataURL(image);

      try {
        const decodedText = await html5QrCode.scanFile(image, true);
        scanOnSuccess(decodedText);

        reader.onload = (e) => {
          uploadedImage = e.target.result;
        };
      } catch (err) {
        await scanOnError(err);
      }
      // readerElement.style = "display:none";
    };
  };

  onMount(async () => {
    /** Offline scan setup */
    await fileUploadSetup();
    /** Live (camera) scan setup*/
    await html5QrCodeSetup();
  });

  onDestroy(async () => {
    try {
      await stopLiveScan();
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  });
</script>

<!-- <DigitalSignature /> -->

<!-- {#if !uploadedImage && !qrCodeValue} -->
{#if !(uploadedImage || qrCodeValue)}
  <p>Here you can read and verify a signed document</p>
  <p>
    First, you can either take a new picture, or upload if from your gallery.
  </p>
  {#if !scanningIsLoaded}
    <ScannerLoader />
  {/if}
{:else}
  <Center direction="column">
    <p>Here you <s>go</s> code :)</p>
  </Center>
{/if}

<div
  bind:this={readerElement}
  id="reader"
  style={uploadedImage ? "display: none" : "display: block"}
  width="600px"
/>

{#if !(uploadedImage || qrCodeValue) && scanningIsLoaded}
  <Center direction="column">
    <div id="textOr">or</div>
  </Center>
  <Center direction="column">
    <Button
      on:click={() => {
        fileinput.click();
        console.log("button clicked");
      }}>Upload an image</Button
    >
  </Center>
{/if}
{#if uploadedImage || qrCodeValue}
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
        qrCodeValue = null;
        uploadedImage = null;
        scanningIsLoaded = false;
        await html5QrCodeSetup();
      }}>Try again</Button
    >
  </Center>
{/if}
<Center>
  <input
    style="display:none"
    type="file"
    accept=".jpg, .jpeg, .png, .heic"
    on:change={(e) => {
      onFileSelected(e);
      console.log("on change fired");
    }}
    bind:this={fileinput}
  />
</Center>

<style>
  #textOr {
    margin: 10px auto;
  }
  p {
    margin: 0 0 10px 0;
  }
  .uploadedImage {
    display: flex;
    height: 200px;
    width: 200px;
  }
  /* .displayNone {
    display: none;
  } */

  .qrcode-value {
    max-width: 100%;
  }
  #reader {
    z-index: -1;
  }
</style>
