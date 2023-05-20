const NotificationProvider = require("./notification-provider");
const axios = require("axios");

class Pushover extends NotificationProvider {
    name = "pushover";

    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";

        let data = {
            "message": msg,
            "user": notification.pushoveruserkey,
            "token": notification.pushoverapptoken,
            "sound": notification.pushoversounds,
            "priority": notification.pushoverpriority,
            "title": notification.pushovertitle,
            "retry": "30",
            "expire": "3600",
            "html": 1,
        };

        if (notification.pushoverdevice) {
            data.device = notification.pushoverdevice;
        }

        try {
            if (heartbeatJSON == null) {
                await axios.post("https://api.pushover.net/1/messages.json", data);
                return okMsg;
            } else {
                data.message += "\n<b>Time (UTC)</b>:" + heartbeatJSON["time"];
                await axios.post("https://api.pushover.net/1/messages.json", data);
                return okMsg;
            }
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }

    }
}

module.exports = Pushover;
