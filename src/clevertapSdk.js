class CleverTab {
  constructor(deviceInfo, regId) {
    this.deviceInfo = deviceInfo;
    this.regId = regId;
    this.eventsInfo = [];
    this.inervalId = null;
    if (this.instance) {
      return this.instance;
    }
    this.instance = new CleverTab();
  }

  sendLog(eventName, payLoad) {
    this.eventsInfo.push({
      eventName: eventName,
      ...payLoad,
      timeStamp: new Date(),  
    });
  }

  callApi() {
    if (this.eventsInfo.length > 0) {
      //call an API
      this.eventsInfo = [];
    }
  }

  startSendingInfo() {
    setInterval(() => {
      callApi();
    }, 20000);
  }
  onBackGround() {
    clearInterval();
    this.sendLog("APP BACKGROUND", "");
    callApi();
  }

  onForeGround() {
    startSendingInfo();
  }

  onAppKill() {
    clearInterval();
  }
}
