const nodemailer = require('nodemailer');
const config = require('../config.json');

class transporter {

    /**
     * 
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

    setHTML = (htlm) => { this.email.html = htlm; return this; }

    send = async () => await this.transporter.sendMail(this.email);
}

module.exports = transporter;