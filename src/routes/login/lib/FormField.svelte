<script>
  export let label = "";
  export let name = "";
  // export let inputType = "text";
  export let valueToBind = "";
</script>

<div>
  <label for={name}>{label}</label>
  <input bind:value={valueToBind} />
</div>

<style>
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
  }
  input {
    margin-left: 10px;
    height: 20px;
    width: 60%;
  }
</style>
