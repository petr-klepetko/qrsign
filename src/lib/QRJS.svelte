<script context="module">
  export let qrcode;
</script>

<script>
  import { onMount } from "svelte";

  export let codeValue;
  export let squareSize;

  squareSize = 1000;

  const drawQRcode = () => {
    qrcode = new QRCode("qrcode", {
      text: codeValue,
      width: squareSize,
      height: squareSize,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  };

  onMount(() => {
    let script = document.createElement("script");
    script.src =
      "https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js";
    document.head.append(script);

    let availableParentWidth =
      document.getElementById("qrcode").parentElement.clientWidth - 50;
    // console.log("parent width: ", availableParentWidth);

    script.onload = function () {
      qrcode = new QRCode("qrcode", {
        text: codeValue,
        width: availableParentWidth,
        height: availableParentWidth,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    };
    console.log("Mělo by se vytvořit. ");
  });
</script>

<div id="qrcode" />

<style>
  #qrcode {
    width: 100%;
    height: 200x;

    margin-top: 0px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  @media print {
    :global(img) {
      margin-top: 10px;
      width: 2000px;
    }
  }
</style>
