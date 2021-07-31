const { JSDOM } = require("jsdom");
const fs = require('fs');

class Email {

    #send = fs.readFileSync(global.ROOT_PATH + "/utils/libs/emailTemplate.html", "utf8")
    #document = new JSDOM(this.#send);
    constructor() {

    }

    setTitle(string = "", ref) {
        let element = this.#document.window.document.getElementById("title");

        element.textContent = string;
        if (ref) element.setAttribute("href", ref)
        return this;
    }

    setSignature(string, ref) {
        let element = this.#document.window.document.getElementById("signature");

        element.textContent = string;
        if (ref) element.setAttribute("href", ref)
        return this;
    }

    setSubText(string) {
        let element = this.#document.window.document.getElementById("subText");

        element.textContent = string;
        return this;
    }


    setHeader(string, ref) {
        let element = this.#document.window.document.getElementById("header");

        element.textContent = string;
        if (ref) element.setAttribute("href", ref)
        return this;
    }

    setMessage(string) {
        let element = this.#document.window.document.getElementById("message");

        element.textContent = string;
        return this;
    }

    setFooter(string, ref) {
        let element = this.#document.window.document.getElementById("footer");

        element.textContent = string;
        if (ref) element.setAttribute("href", ref)
        return this;
    }

    get() {
        return this.#document
    }

}

module.exports = Email;
