const nodemailer = require('nodemailer');
const config = require('../config.json');
const chalk = require('chalk');

class transporter {

    /**
     * @param {object} emailData 
     * @param {string} emailData.from 
     * @param {string} emailData.to
     * @param {string} emailData.subject
     * @param {string?} emailData.text
     * @param {string?} emailData.html
     */
    constructor(emailData) {
        this.transporter = nodemailer.createTransport({
            host: config.email.host,
            port: config.email.port,
            auth: {
                user: config.email.user,
                pass: config.email.password
            }
        });
        this.email = emailData || {};
    }

    setSender = (sender) => { this.email.from = sender; return this; }

    setReceiver = (receiver) => { this.email.to = receiver; return this; }

    setSubject = (subject) => { this.email.subject = subject; return this; }

    setText = (txt) => { this.email.text = txt; return this; }

    setHTML = (html) => { this.email.html = html; return this; }

    send = async () => {

        if (this.email.to == null) throw new Error("EmailReceiver can't be null.");
        if (this.email.subject == null) throw new Error("EmailSubject can't be null.");
        if (this.email.text == null && this.email.html == null) throw new Error("EmailContent can't be null.");

        if (config.email.verbose) console.log(chalk.blueBright("[Email]"), `Email sent to ${this.email.to} (${this.email.subject})`);

        return await this.transporter.sendMail(this.email);
    };
}

module.exports = transporter;