<script context="module">
  import { onMount } from "svelte";
  import Device from "svelte-device-info";
</script>

<script>
  import Button from "$lib/Button.svelte";
  import Center from "$lib/Center.svelte";
  import Spacer from "$lib/Spacer.svelte";
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
  import { Jumper } from "svelte-loading-spinners";
  import { openModal } from "svelte-modals";
  import Modal from "$lib/Modal.svelte";

  const dispatch = createEventDispatcher();

  let uploadedImage, fileinput, qrCodeValue;

  let scanningIsLoaded = false;

  //* Creating empty functions so they are always defined. */
  let onFileSelected = () => null;
  let html5QrCode = () => null;

  const scanOnSuccess = (decodedText) => {
    qrCodeValue = decodedText;
    console.log(qrCodeValue);
  };

  const scanOnError = (err) => {
    console.log(`Error scanning file. Reason: ${err ?? "No error provided. "}`);
  };

  const fileUploadSetup = () => {
    onFileSelected = (e) => {
      let reader = new FileReader();
      let image = e.target.files[0];

      uploadedImage = null;

      reader.readAsDataURL(image);
      reader.onload = (e) => {
        uploadedImage = e.target.result;
      };

      html5QrCode.scanFile(image, true).then(scanOnSuccess).catch(scanOnError);
    };
  };

  const liveScanOnSuccess = (decodedText, decodedResult) => {
    scanningIsLoaded = true;

    console.log("decodedText: ", decodedText);
    console.log("decodedResult", decodedResult);
    html5QrCode
      .stop()
      .then((ignore) => {
        console.log("Stopping the scanning. ", ignore);
      })
      .catch((err) => {
        console.log("error while stopping: ", err ?? "No error info");
      });
    qrCodeValue = decodedText;
  };

  const liveScanOnError = (errorMessage) => {
    console.log("I tried, but saw no code. ");
    if (!scanningIsLoaded) {
      scanningIsLoaded = true;
    }
  };

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
                fps: 10, // Optional, frame per seconds for qr code scanning
                qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
              },
              liveScanOnSuccess,
              liveScanOnError
            )
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

  onMount(() => {
    // console.log("this device is " + (Device.isMobile ? "" : "not") + " mobile");
    // openModal(Modal, {
    //   title: "Device type: ",
    //   message: "This device is " + (Device.isMobile ? "" : "not") + " mobile",
    // });
    fileUploadSetup();
    html5QrCodeSetup();
  });
</script>

{#if !uploadedImage && !qrCodeValue}
  <p>Here you can read and verify a signed document</p>
  <p>
    First, you can either take a new picture, or upload if from your gallery.
  </p>
  {#if !scanningIsLoaded}
    <Center direction="column">
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
<div id="reader" />

{#if !uploadedImage && !qrCodeValue}
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
    <p><strong><i>{qrCodeValue}</i></strong></p>
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
    on:change={(e) => {
      html5QrCode
        .stop()
        .then((ignore) => {
          console.log("Stopping the scanning. ", ignore ?? "");
          onFileSelected(e);
        })
        .catch((err) => {
          console.log("error while stopping: ", err ?? "No error info");
        });
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
  #reader {
    z-index: -1;
  }
</style>
