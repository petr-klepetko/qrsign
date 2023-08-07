<script context="module">
  import { onDestroy, onMount } from "svelte";
  import Device from "svelte-device-info";
</script>

<script>
  import Button from "$lib/Button.svelte";
  import Center from "$lib/Center.svelte";
  import Spacer from "$lib/Spacer.svelte";
  import Modal from "$lib/Modal.svelte";
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
  import { Jumper } from "svelte-loading-spinners";
  import { openModal } from "svelte-modals";
  import DigitalSignature, {
    sig,
    publicKey,
  } from "$lib/DigitalSignature.svelte";

  const dispatch = createEventDispatcher();

  let uploadedImage, fileinput, qrCodeValue, qrCodeValuePretty, validSignature;

  let scanningIsLoaded = false;
  // let endLiveScanning = false;
  let uploadEnabled = false;

  //* Creating empty functions so they are always defined. */
  let onFileSelected = () =>
    console.log("Spustila se puvodni prazdná funkce onFileSelected.");
  let html5QrCode = () => null;

  const verifySignature = () => {
    console.log(publicKey);
    sig.init(publicKey);

    let tempQRvalue = JSON.parse(qrCodeValue);
    let sigValueHex = tempQRvalue.signature;
    tempQRvalue.signature = "";
    console.log(tempQRvalue);
    sig.updateString(tempQRvalue);
    let response;
    try {
      response = sig.verify(sigValueHex);
    } catch (e) {
      console.log(e);
    }
    return response;
  };

  /**
   * Live scanning
   */

  const liveScanOnSuccess = (decodedText, decodedResult) => {
    scanningIsLoaded = true;
    stopLiveScan();
    qrCodeValue = decodedText;
    console.log("LiveScan successful, decodedText: ", decodedText);
  };

  const liveScanOnError = (errorMessage) => {
    console.log("I tried, but saw no code. ");
    console.log();
    if (!scanningIsLoaded) {
      scanningIsLoaded = true;
    }
    // if (endLiveScanning) {
    //   stopLiveScan();
    // }
  };

  /** Function for stopping the live camera */
  const stopLiveScan = () => {
    html5QrCode
      .stop()
      .then((ignore) => {
        console.log("Stopping the scanning. ", ignore);
      })
      .catch((err) => {
        console.log("error while stopping: ", err ?? "No error info");
      });
  };

  /** Live camera setup */
  const html5QrCodeSetup = () => {
    html5QrCode = new Html5Qrcode(/* element id */ "reader");
    let cameraId;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length && !qrCodeValue) {
          cameraId = devices[0].id;

          html5QrCode
            .start(
              cameraId,
              {
                fps: 6, // Optional, frame per seconds for qr code scanning
                qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
              },
              liveScanOnSuccess,
              liveScanOnError
            )
            // .then(() => {
            //   console.log("started live scanning");
            //   uploadEnabled = true;
            // })
            .catch((err) => {
              console.log(
                "Error on starting the camera: ",
                err ?? "No error info"
              );
              openModal(Modal, {
                title: "Error while starting the camera",
                message: err ?? "No error info",
              });
            });
        }
      })
      .catch((err) => {
        console.log(
          "error while getting the cameras: ",
          err ?? "No error info"
        );
        openModal(Modal, {
          title: "Error while getting the cameras",
          message: err ?? "No error info",
        });
      });
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
      validSignature = verifySignature();
    } catch (e) {
      console.log(e);
    }
    console.log("Succesfull scan from file: ", qrCodeValue);

    /** If user manages to scan a file before the live scan is loaded, we need to close the camera.
     * However, we cannot stop it until it has started, so we only mark this variable and after next error it will stop
     */
    // endLiveScanning = true;
  };

  const scanOnError = (err) => {
    console.log(`Error scanning file. Reason: ${err ?? "No error provided. "}`);
  };

  /** Initial setup of the file uploading */
  const fileUploadSetup = async () => {
    //stopLiveScan();

    onFileSelected = async (e) => {
      // console.log("On file selected fired.");
      console.log("Waiting for the live scanner to stop.");
      await stopLiveScan();
      console.log("Live scanner has stopped, continuing. ");
      let reader = new FileReader();
      let image = e.target.files[0];

      uploadedImage = null;

      reader.readAsDataURL(image);

      try {
        html5QrCode
          .scanFile(image, true)
          .then(scanOnSuccess)
          .catch(scanOnError);

        reader.onload = (e) => {
          uploadedImage = e.target.result;
        };
      } catch (e) {
        console.log(e);
      }
      // console.log("Ahoj");
    };
  };

  onMount(() => {
    /** Offline scan setup */
    fileUploadSetup();
    /** Live (camera) scan setup*/
    html5QrCodeSetup();
  });

  onDestroy(() => {
    try {
      stopLiveScan();
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  });
</script>

<DigitalSignature />

{#if !uploadedImage && !qrCodeValue}
  <p>Here you can read and verify a signed document</p>
  <p>
    First, you can either take a new picture, or upload if from your gallery.
  </p>
  {#if !scanningIsLoaded}
    <Center direction="column">
      <Spacer height="60px" />
      <p>Just a moment please :)</p>
      <Jumper size="60" color="grey" unit="px" duration="1s" />
    </Center>
  {/if}
{/if}
{#if uploadedImage || qrCodeValue}
  <!-- {uploadedImage} -->
  <Center direction="column">
    <p>Here you <s>go</s> code :)</p>
  </Center>
{/if}
<div id="reader" style={uploadedImage ? "display: none" : ""} />

{#if !uploadedImage && !qrCodeValue && scanningIsLoaded}
  <Center direction="column">
    <div id="textOr">or</div>
  </Center>
  <Center direction="column">
    <Button
      on:click={() => {
        fileinput.click();
      }}>Upload an image</Button
    >
  </Center>
{/if}
{#if uploadedImage || qrCodeValue}
  <Center direction="column">
    <p>Text from your code:</p>
    <Spacer height="20px" />
    <div class="qrcode-value">
      <!-- <strong><i>{qrCodeValue}</i></strong> -->
      <!-- {#if verifySignature(qrCodeValue?.signature)} -->
      Signature OK response: {validSignature}
      <!-- {/if} -->
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
      on:click={() => {
        qrCodeValue = null;
        uploadedImage = null;
        scanningIsLoaded = false;
        html5QrCodeSetup();
      }}>Try again</Button
    >
  </Center>
{/if}
<Center>
  <input
    style="display:none"
    type="file"
    accept=".jpg, .jpeg, .png, .heic"
    on:change={(e) => onFileSelected(e)}
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
