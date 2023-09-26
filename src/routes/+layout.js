import axios from "axios";

import {
  PUBLIC_BE_URL as BE_URL,
  PUBLIC_BE_PORT as BE_PORT,
  PUBLIC_USER_FROM_COOKIE_ENDPOINT as USER_FROM_COOKIE_ENDPOINT,
} from "$env/static/public";

const refreshUser = async () => {
  try {
    const options = {
      method: "GET",
      url: `${BE_URL}:${BE_PORT}${USER_FROM_COOKIE_ENDPOINT}`,
      withCredentials: true,
    };

    const response = await axios.request(options);
    let user = response.data;

    return user;
  } catch (error) {
    let user = {
      email: null,
      name: null,
      uuid: null,
      anonymous: true,
    };
    return {
      user,
    };
  }
};

export async function load({ params }) {
  const user = await refreshUser();
  console.log("user (+layout.js): ", user);

  return { user };
}
