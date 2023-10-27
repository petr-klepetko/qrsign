<script>
  import Center from "../../lib/Center.svelte";
  import LoginForm from "./lib/LoginForm.svelte";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  export let data;

  console.log(data);
  $: {
    data = data;
  }

  const userStored = writable();
  $: {
    userStored.set(data?.user);
  }
  setContext("userStored", userStored);
</script>

<Center direction="column">
  <h1>Login</h1>
  <LoginForm />
</Center>
