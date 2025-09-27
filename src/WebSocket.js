class SocketConnection {
  constructor(url = "wss://echo.websocket.org", retryDelay = 3000) {
    this.url = url;
    this.ws = null;
    this.retryDelay = retryDelay;
    this.connect();
  }

  logger(message, logLevel = "LOW") {
    console.log(message, logLevel);
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener("open", () => {
      this.logger("connected");
    });
    this.ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        this.logger(JSON.stringify(`Data Recieved : ${data}`));
      } catch (err) {
        this.logger(JSON.stringify(`Invalid JSON received: ${err}`), "HIGH");
        this.ws.dispatchEvent(new MessageEvent("close"));
      }
    });
    this.ws.addEventListener("close", (event) => {
      if (event.code === 1000) {
        this.logger("Connection Closed normally", "normal");
      } else {
        this.logger(JSON.stringify(`Connection Closed, ${event}`), "normal");
        setTimeout(() => this.connect(), this.retryDelay);
      }
    });
    this.ws.addEventListener("error", (error) => {
      this.logger(JSON.stringify(`Socket Error ${error}`), "HIGH");
      this.ws.close();
    });
  }
}

const wsClient = new SocketConnection();
