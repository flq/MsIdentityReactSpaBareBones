importScripts("signalr.js");

let connection = null;

self.addEventListener("message", function () {
  if (connection === null) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:3000/pushHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();
    connection
      .start()
      .then(() => {
        connection.on("notification", (payload) => {
          // goes to client
          postTheMessage(payload);

          //...and notification
          try {
            self.registration
              .then((reg) => {
                const timestamp = Math.floor(Date.now());
                reg.showNotification("Hi, User!", {
                  body: payload,
                  tag: "myUniqueId",
                  icon: "logo192.png",
                  timestamp,
                });
              })
              .catch((error) => postTheMessage(error));
          } catch (error) {
            postTheMessage(error);
          }
        });
      })
      .catch((error) => postTheMessage(error));
  }
});

function postTheMessage(payload) {
  self.clients.matchAll({ type: "window" }).then(function (clientList) {
    if (clientList.length > 0) {
      clientList[0].postMessage(payload);
    }
  });
}
