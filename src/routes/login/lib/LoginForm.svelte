<script>
  import Button from "../../../lib/Button.svelte";
  import Form from "./Form.svelte";
  import FormField from "./FormField.svelte";
  import Spacer from "$lib/Spacer.svelte";
  import { construct_svelte_component } from "svelte/internal";
  import axios from "axios";
  import {
    PUBLIC_BE_URL as BE_URL,
    PUBLIC_BE_PORT as BE_PORT,
    PUBLIC_LOGIN_ENDPOINT as LOGIN_ENDPOINT,
  } from "$env/static/public";

  import { redirect } from "@sveltejs/kit";
  import { goto } from "$app/navigation";
  import { createEventDispatcher } from "svelte";
  import { browser } from "$app/environment";

  // export let user;

  let email = "klepetkope3@gmail.com";
  let password = "Heslo";

  const resetValues = () => {
    password = "";
  };

  let responseError = "";

  const fetchLogin = async (data) => {
    console.log("email: ", email);
    console.log("password: ", password);

    const optionsAxios = {
      method: "POST",
      url: `${BE_URL}:${BE_PORT}${LOGIN_ENDPOINT}`,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        email,
        password,
      }),
    };

    let response;

    try {
      response = await axios.request(optionsAxios);

      if (response.message !== "success") {
        responseError = response.message;
      } else {
        responseError = "";
      }

      // user = user;
      // goto("/");
      if (browser) {
        // to prevent error window is not defined, because it's SSR
        window.location.href = "/";
      }
    } catch (error) {
      console.log("error: ", error);
    }

    resetValues();
  };
</script>

<form on:submit={fetchLogin}>
  <div class="form-field">
    <label for="email">E-mail</label>
    <input id="email" bind:value={email} autocomplete="true" />
  </div>
  <div class="form-field">
    <label for="password">Password</label>
    <input id="password" bind:value={password} />
  </div>
  {#if responseError}
    <p class="error-message">{responseError}</p>
  {/if}
  <Spacer height="10px" />
  <Button>Login</Button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 15px 5px 15px;
    background-color: rgb(202, 202, 202);
  }

  .form-field {
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

  .error-message {
    color: red;
    text-align: center;
  }
</style>
