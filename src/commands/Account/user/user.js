
// Do not add a run method to it, isnt needed
const CAPSNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

let genPassword = (length = 10) => {
    var password = "";
    while (password.length < length) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }
    return password;
};


// Exporting genPassword for new and reset.
module.exports.genPassword = genPassword;

module.exports.info = {
    name: "user",
    description: "Commands related to user",
    aliases: ['u']
}