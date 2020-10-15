import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

// let worker = new Worker("worker.js");
navigator.serviceWorker
  .register("/worker.js")
  .then((swr) => {
    return navigator.serviceWorker.ready;
  })
  .then((swr) => {
      const worker = swr.active;
    if (worker) {
        console.log("got a worker");
        worker.postMessage(window.location.origin);
    }
  });

navigator.serviceWorker.addEventListener('message', (event) => {
    console.log("New Message or error :) ", event.data);
});


