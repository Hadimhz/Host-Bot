const { JSDOM } = require("jsdom");
const fs = require('fs');
const marked = require('marked');

class Email {

    #send = fs.readFileSync(global.ROOT_PATH + "/utils/libs/emailTemplate.html", "utf8")
    #DOM = new JSDOM(this.#send);
    #document = this.#DOM.window.document;

    constructor() { }

    setTitle(string = "") {
        let element = this.#document.getElementById("title");

        element.innerHTML = marked(string);
        return this;
    }

    setSignature(string = "") {
        let element = this.#document.getElementById("signature");

        element.innerHTML = marked(string);
        return this;
    }

    setSubText(string = "") {
        let element = this.#document.getElementById("subText");

        element.innerHTML = marked(string);
        return this;
    }

    setHeader(string = "") {
        let element = this.#document.getElementById("header");

        element.innerHTML = marked(string);
        return this;
    }

    setMessage(string = "") {
        let element = this.#document.getElementById("message");

        element.innerHTML = marked(string);
        return this;
    }

    setFooter(string = "") {
        let element = this.#document.getElementById("footer");

        element.innerHTML = marked(string);
        return this;
    }

    get() {
        return this.#DOM
    }

}

module.exports = Email;
