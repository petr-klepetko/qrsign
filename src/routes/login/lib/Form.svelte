<script>
  export let action;
</script>

<form on:submit={action}>
  <slot />
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 15px 15px 15px;
    background-color: rgb(202, 202, 202);
  }
</style>
