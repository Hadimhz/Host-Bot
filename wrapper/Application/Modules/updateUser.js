const fetch = require('node-fetch');
let getUser = require('./getUser');
const { toPush } = require('../utils');

/**
 * @param {Number} userID User's ID
 * @param {object} data things you want to update
 * @param {String} data.username Users username
 * @param {String} data.password Users password
 * @param {String} data.email Users email
 * @param {String} data.first_name Users first name
 * @param {String} data.last_name Users last name
 * @param {Boolean} data.root_admin Is the user admin? (true/false)
 * @param {String} data.language Language, Normally [en/fr]
 */
async function createUser(UserID, data) {
    let cred = require('../Application').cred();
    let start = Date.now();
    let old = await getUser(UserID);

    return new Promise(async (resolve, reject) => {

        if (old.errors != null) {
            return resolve({
                success: false,
                error: (old.errors.length == 1 ? old.errors[0] : old.errors),
                info: {
                    startedAt: start,
                    endedAt: Date.now(),
                }
            });
        };

        let input = {
            'username': data.username != null ? data.username : old.data.username,
            'email': data.email != null ? data.email : old.data.email,
            'first_name': data.first_name != null ? data.first_name : old.data.first_name,
            'last_name': data.last_name != null ? data.last_name : old.data.last_name,
            'password': data.password != null ? data.password : old.data.password,
            'root_admin': data.root_admin != null ? data.root_admin : old.data.root_admin,
            'language': data.language != null ? data.language : old.data.language,
        };

        let res = await fetch(cred.url + "/api/application/users/" + UserID, {
            method: 'PATCH',
            body: JSON.stringify(input),
            headers: {
                "Content-Type": 'application/json',
                "Authorization": 'Bearer ' + cred.APIKey,
                "Accept": 'application/json'
            },
        });

        let data = await res.json();
        if (data.errors != null) {
            return resolve({
                success: false,
                error: (data.errors.length == 1 ? data.errors[0] : data.errors),
                info: {
                    startedAt: start,
                    endedAt: Date.now(),
                }
            });
        } else return resolve(toPush(data, start))
    });
}

module.exports = createUser;