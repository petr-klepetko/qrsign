<script>
  let sender = {
    name: "Sender name",
    certificateInfo: "Certificate info",
  };
</script>

<div>
  <p>Verification was successfull!</p>
  <p>Check your document below:</p>
</div>
<div class="doc-preview">Your document will be there.</div>
<div class="sender-info">
  <p><strong>Sender:</strong> {sender.name}</p>
  <p><strong>Certificate:</strong> {sender.certificateInfo}</p>
</div>

<style>
  .doc-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 800px;
    border: solid 1px black;
  }
  .sender-info {
  }
</style>
