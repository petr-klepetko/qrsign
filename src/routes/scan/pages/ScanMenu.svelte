<script context="module">
  import { onMount } from "svelte";
  import Device from "svelte-device-info";
</script>

<script>
  import Center from "$lib/Center.svelte";
  import { createEventDispatcher } from "svelte";
  import { Html5Qrcode } from "html5-qrcode";

  import ScannerLoader from "../lib/ScannerLoader.svelte";
  import TopContent from "../lib/TopContent.svelte";
  import BottomContent from "../lib/BottomContent.svelte";
  import {
    sayHello,
    html5QrCodeSetup,
    getDevices,
    // liveScanOnSuccess,
    liveScanOnError,
    options,
    stopLiveScan,
  } from "../lib/utils.svelte";
  import Modal from "$lib/Modal.svelte";
  import { openModal } from "svelte-modals";

  const dispatch = createEventDispatcher();

  let readerElement;
  let fileinput;
  let BottomContentElement;
  let unique = {};

  let html5QrCode;

  let uploadedImage;
  let qrCodeValue;

  let scanCompleted = false;
  let scannerIsLoaded = false;

  let onFileSelected = () => null;

  let refreshScanning = () => null;

  const liveScanOnSuccess = async (decodedText, html5QrCode) => {
    await stopLiveScan(html5QrCode);
    qrCodeValue = decodedText;
    scanCompleted = true;
    unique = {};
    console.log("LiveScan successful, decodedText: ", decodedText);
  };

  const setUpLiveScan = async (html5QrCode, devices) => {
    try {
      await html5QrCode.start(
        devices[0].id,
        options,
        (decodedText) => {
          liveScanOnSuccess(decodedText, html5QrCode);
        },
        (err) => {
          liveScanOnError(err);
          scannerIsLoaded == false ? (scannerIsLoaded = true) : null;
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  onMount(async () => {
    sayHello();
    // return;
    html5QrCode = new Html5Qrcode(/* element id */ "reader");

    const devices = await getDevices();
    if (devices === "error") {
      return;
    }

    if (!(await setUpLiveScan(html5QrCode, devices))) {
      return;
    }

    onFileSelected = async (e) => {
      if (!scannerIsLoaded) {
        return;
      }
      if (!(await stopLiveScan(html5QrCode))) {
        return;
      }

      uploadedImage = e.target.files[0];

      try {
        qrCodeValue = await html5QrCode.scanFile(uploadedImage, true);
        scanCompleted = true;
        unique = {};
      } catch (err) {
        // console.log(err);
        openModal(Modal, {
          title: "Error while scanning the uploaded image",
          message: err ?? "No error info",
        });
        uploadedImage = null;
        fileinput.value = null;
        setUpLiveScan(html5QrCode, devices);
      }
    };

    refreshScanning = async () => {
      uploadedImage = null;
      qrCodeValue = null;
      unique = {};
      scanCompleted = false;
      setUpLiveScan(html5QrCode, devices);
    };
  });
</script>

<TopContent {scanCompleted} />

<ScannerLoader {scannerIsLoaded} />

<div id="reader" hidden={scanCompleted} bind:this={readerElement} />

{#key unique}
  <BottomContent
    {qrCodeValue}
    {scanCompleted}
    {fileinput}
    {scannerIsLoaded}
    {refreshScanning}
    on:read={() => dispatch("read")}
    bind:this={BottomContentElement}
  />
{/key}

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
  #reader {
    z-index: -1;
  }
</style>
