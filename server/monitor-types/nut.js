const { MonitorType } = require("./monitor-type");
const { UP, DOWN } = require("../../src/util");
const dayjs = require("dayjs");
const jsonata = require("jsonata");
const Nut = require("node-nut");

const { log } = require("../../src/util");

class NutMonitorType extends MonitorType {

    name = "nut";

    /**
     * @inheritdoc
     */
    async check(monitor, heartbeat, _server) {
        let startTime = dayjs().valueOf();
        let expression = jsonata(monitor.jsonPath);

        const nut = new Nut(monitor.port, monitor.hostname);

        nut.on("ready", () => {
            nut.GetUPSList((upslist, err) => {
                if (err) {
                    nut.close();
                    log.error("NUT Error: " + err);
                }

                let upsname = upslist[monitor.upsName] && monitor.upsName || Object.keys(upslist)[0];

                nut.GetUPSVars(upsname, async (vars, err) => {
                    nut.close();
                    if (err) {
                        throw new Error("Error getting UPS variables");
                    } else {
                        // convert data to object
                        if (typeof vars === "string") {
                            vars = JSON.parse(vars);
                        }
                        const data = ({ ...vars }); // copy vars

                        // Check device status
                        let result = await expression.evaluate(data);

                        if (result.toString() === monitor.expectedValue) {
                            heartbeat.status = UP;
                            heartbeat.msg = "";
                            heartbeat.ping = dayjs().valueOf() - startTime;
                        } else {
                            heartbeat.status = DOWN;
                            heartbeat.msg = "Value not expected, value was: [" + result + "]";
                        }
                    }
                });
            });
        });

        nut.start();
    }
}

module.exports = {
    NutMonitorType,
};
