<script context="module">
  export const sayHello = () => {
    console.log("Říkám ahoj");
  };

  export let scanningIsLoaded = false;

  import { Html5Qrcode } from "html5-qrcode";

  import Modal from "$lib/Modal.svelte";
  import { openModal } from "svelte-modals";

  export const options = {
    fps: 6, // Optional, frame per seconds for qr code scanning
    // qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
  };

  /**
   * Live scanning
   */
  export const liveScanOnSuccess = async (decodedText, decodedResult) => {
    await stopLiveScan();
    qrCodeValue = decodedText;
    console.log("LiveScan successful, decodedText: ", decodedText);
  };

  export const liveScanOnError = (errorMessage) => {
    console.log("I tried, but saw no code. ");
  };

  export const getDevices = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) return devices;
      else {
        return "error";
      }
    } catch (err) {
      console.log("Error on starting the camera: ", err ?? "No error info");
      openModal(Modal, {
        title: "Error while starting the camera",
        message: err ?? "No error info",
      });
      return "error";
    }
  };

  export const stopLiveScan = async (html5QrCode) => {
    try {
      await html5QrCode.stop();
      console.log("Stopping the scanning");
      return true;
    } catch (err) {
      console.log("error while stopping: ", err ?? "No error info");
      return false;
    }
  };

  export const html5QrCodeSetup = async (html5QrCode, scannerIsLoaded) => {
    html5QrCode = new Html5Qrcode(/* element id */ "reader");
  };
</script>
