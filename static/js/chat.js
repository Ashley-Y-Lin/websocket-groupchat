"use strict";

/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);

const name = prompt("Username? (no spaces)");
const $messageArea = $("#m");

/** called when connection opens, sends join info to server. */

ws.onopen = function (evt) {
  console.log("open", evt);

  let data = { type: "join", name: name };
  ws.send(JSON.stringify(data));
};

/** called when msg received from server; displays it. */

ws.onmessage = function (evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let item;
  console.log("msg received", msg);

  //TODO: use the global object with the type keys, and find some way to
  // store the messages here

  if (msg.type === "note") {
    item = $(`<li><i>${msg.text}</i></li>`);
  } else if (msg.type === "chat") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  } else if (msg.type === "get-joke") {
    item = $(`<li><i>${msg.joke}</i></li>`);
  } else if (msg.type === "get-members") {
    item = $(`<li><i>${msg.members.map(m => m.name).join(", ")}</i></li>`);
  } else if (msg.type === "priv") {
    item = $(`<li><i>${msg.text}</i></li>`);
  } else if (msg.type === "newUsername") {
    item = $(`<li><i>${msg.text}</i></li>`);
  } else {
    return console.error(`bad message: ${msg}`);
  }

  $("#messages").append(item);
};

/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};

/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};

/** send message when button pushed. */

$("form").on("submit", function (evt) {
  evt.preventDefault();

  const submittedText = $messageArea.val();
  let data;

  if (submittedText === "/joke") {
    data = { type: "get-joke" };
  } else if (submittedText === "/members") {
    data = { type: "get-members" };
  } else if (submittedText.startsWith("/priv")) {
    const submittedWords = submittedText.split(' ');
    data = {
      type: "priv",
      recipient: submittedWords[1],
      text: submittedWords.slice(2).join(' ')
    };
  } else if (submittedText.startsWith("/name")){
    const submittedWords = submittedText.split(' ');
    data = {
      type: "newUsername",
      newName: submittedWords[1]
    };
  } else {
    data = { type: "chat", text: submittedText };
  }

  ws.send(JSON.stringify(data));

  $messageArea.val("");
});
