const PORT = process.env.PORT || 8001;
const ENV = require("./environment");

const app = require("./application")(ENV, { updateAppointment });
const server = require("http").Server(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

const { Pool, Client } = require('pg')
const connectionString = 'postgres://kufuhwmnmziusu:53d334b36ec54da41e2f53b4f4aa1bee051bdc78a93e43002483699dc116c29b@ec2-54-211-238-131.compute-1.amazonaws.com:5432/d32ogb81u0l88u'

const pool = new Pool({
    connectionString: connectionString,
})
db.connect().then(() => console.log('db conected'));

wss.on("connection", socket => {
  socket.onmessage = event => {
    console.log(`Message Received: ${event.data}`);

    if (event.data === "ping") {
      socket.send(JSON.stringify("pong"));
    }
  };
});

function updateAppointment(id, interview) {
  wss.clients.forEach(function eachClient(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "SET_INTERVIEW",
          id,
          interview
        })
      );
    }
  });
}

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${ENV} mode.`);
});
