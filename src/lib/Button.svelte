<script>
  export let iconPath = null;
  export let label = null;
  export let cssClass = null;
  export let buttonType = "";

  // console.log("Class: ", cssClass);
</script>

<button on:click class={cssClass} type={buttonType}>
  {#if iconPath}<img src="iconPath" alt="icon" />{/if}
  {#if label}{label}{/if}
  <slot />
</button>

<style>
  button {
    background: rgb(239, 239, 239);
    color: black;
    border-color: black;
    text-align: center;
    font-family: inherit;
    min-width: 300px;
    height: 50px;
    border-radius: 10px;
    font-size: 20px;
    cursor: pointer;
    margin: 10px 5px;
  }
  button:hover {
    background: rgb(218, 218, 218);
  }
  button:active {
    background: black;
    color: rgb(239, 239, 239);
    border-color: rgb(239, 239, 239);
  }
  .small {
    min-width: 0px;
    width: 100px;
  }
  @media print {
    button {
      display: none;
    }
  }
</style>
