<script>
  import Center from "../../lib/Center.svelte";
  import LoginForm from "./lib/LoginForm.svelte";
  export let user;
  export let data;

  console.log(data);
  $: {
    data = data;
  }
</script>

<Center direction="column">
  <h1>Login</h1>
  <LoginForm {user} />
</Center>
