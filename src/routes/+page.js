import axios from "axios";

import {
  PUBLIC_BE_URL as BE_URL,
  PUBLIC_BE_PORT as BE_PORT,
  PUBLIC_USER_FROM_COOKIE_ENDPOINT as USER_FROM_COOKIE_ENDPOINT,
} from "$env/static/public";

const getUserFromCookies = async () => {
  try {
    const options = {
      method: "GET",
      // url: `http://localhost:8079/${entityEndpoint}/${uuid}`,
      url: `${BE_URL}:${BE_PORT}${USER_FROM_COOKIE_ENDPOINT}`,
      withCredentials: true,
    };
    const response = await axios.request(options);
    return response.data;

    // userInitials = user.name.split(" ")[0][0] + user.name.split(" ")[1][0];
  } catch (error) {
    console.log("error: ", error);
    // userInitials = null;
  }
};

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const user = await getUserFromCookies();
  return { user };
}
