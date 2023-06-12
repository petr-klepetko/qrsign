<script>
  import QrCode from "svelte-qrcode";
  export let url;
</script>

<QrCode value={url} />
