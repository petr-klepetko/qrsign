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
  import { Html5QrcodeScanner } from "html5-qrcode";
  import { Html5Qrcode } from "html5-qrcode";

  const dispatch = createEventDispatcher();

  let uploadedImage, fileinput;

  let qrCodeValue;

  let onFileSelected = () => null;

  onMount(() => {
    console.log("this device is " + (Device.isMobile ? "" : "not") + " mobile");
    const html5QrCode = new Html5Qrcode("qrcode");

    onFileSelected = (e) => {
      uploadedImage = null;
      let image = e.target.files[0];

      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        uploadedImage = e.target.result;
      };

      html5QrCode
        .scanFile(image, true)
        .then((decodedText) => {
          // success, use decodedText
          qrCodeValue = decodedText;
          console.log(qrCodeValue);
          liveCapturing = false;
        })
        .catch((err) => {
          // failure, handle it.
          console.log(`Error scanning file. Reason: ${err}`);
        });
    };
  });

  //** Code from repl */

  function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }

  onMount(() => {
    // This method will trigger user permissions
    Html5Qrcode.getCameras()
      .then((devices) => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices && devices.length) {
          var cameraId = devices[0].id;
          // .. use this to start scanning.
          let html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ true
          );
          html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        }
      })
      .catch((err) => {
        // handle err
      });
  });

  let liveCapturing = false;
</script>

{#if !uploadedImage}
  <p>Here you can read and verify a signed document</p>
  <p>
    First, you can either take a new picture, or upload if from your gallery.
  </p>
{/if}

<!-- <div id="reader" class={uploadedImage == null ? "displayNone" : ""} /> -->
{#if uploadedImage}
  <div id="reader" class="displayNone" />
  <Center direction="column" delay={300}>
    <p>Here you <s>go</s> code :)</p>
    <Spacer height="30px" />
    <img
      id="qrcode"
      in:fade
      out:fade
      class="uploadedImage"
      src={uploadedImage}
      alt="d"
    />
    <Spacer height="40px" />
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
        fileinput.click();
      }}>Try again</Button
    >
  </Center>
{:else}
  <div id="reader" />
  <img id="qrcode" style="display:none" alt="qrcode" />
  <!-- <Spacer height="80px" /> -->
  <Center direction="column">
    <!-- <Button
      cssClass={liveCapturing ? "displayNone" : ""}
      on:click={() => {
        liveCapturing = !liveCapturing;
      }}>Scan a code</Button
    > -->
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
  .displayNone {
    display: none;
  }
</style>
