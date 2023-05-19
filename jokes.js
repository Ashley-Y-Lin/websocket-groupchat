"use strict";

const axios = require("axios");

const ICANHASDADJOKE_ENDPOINT = "https://icanhazdadjoke.com/";

async function getJoke() {
  const response = await axios.get(
    ICANHASDADJOKE_ENDPOINT,
    {
      headers: {
        Accept: "application/json"
      }
    }
  );

  return response.data.joke;
}

module.exports = { getJoke };