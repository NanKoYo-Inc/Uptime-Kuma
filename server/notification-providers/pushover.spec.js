// jest.mock("nodemailer", () => ({
//     createTransport: jest.fn(),
// }));

// const mockNodeMailer = require("nodemailer");

const Pushover = require("./pushover");

beforeEach(() => {
    // mockNodeMailer.createTransport.mockReset();
});

describe("notification default information", () => {
    it("should have the correct name", () => {
        let notification = new Pushover();
        expect(notification.name).toBe("pushover");
    });
});
