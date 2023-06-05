<script>
  import Button from "$lib/Button.svelte";
  import Center from "$lib/Center.svelte";
  import Spacer from "$lib/Spacer.svelte";
  import { fade } from "svelte/transition";
  import { createEventDispatcher, onMount } from "svelte";
  // To use Html5QrcodeScanner (more info below)
  import { Html5QrcodeScanner } from "html5-qrcode";

  // To use Html5Qrcode (more info below)
  import { Html5Qrcode } from "html5-qrcode";

  const dispatch = createEventDispatcher();

  //** Code from repl */
  let uploadedImage, fileinput;

  const onFileSelected = (e) => {
    uploadedImage = null;
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      uploadedImage = e.target.result;
    };
  };

  //** End of code from repl*/

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
    let html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
  });
</script>

Ahoj

<div id="reader" />

{#if uploadedImage}
  <Center direction="column" delay={300}>
    <p>Here you <s>go</s> code :)</p>
    <Spacer height="30px" />
    <img in:fade out:fade class="uploadedImage" src={uploadedImage} alt="d" />
    <Spacer height="40px" />
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
  <p>Here you can read and verify a signed document.</p>
  <p>
    First, you can either take a new picture, or upload if from your gallery.
  </p>
  <Spacer height="80px" />
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
    accept=".jpg, .jpeg, .png"
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
</style>
