const fetch = require('node-fetch');
let getUser = require('./getUser');
const { toPush } = require('../utils');

/**
 * @param {Number} userID User's ID
 * @param {object} data things you want to update
 * @param {String?} data.username Users username
 * @param {String?} data.password Users password
 * @param {String?} data.email Users email
 * @param {String?} data.first_name Users first name
 * @param {String?} data.last_name Users last name
 * @param {Boolean?} data.root_admin Is the user admin? (true/false)
 * @param {String?} data.language Language, Normally [en/fr]
 */
async function createUser(UserID, data) {
    let cred = require('../Application').cred();
    let start = Date.now();

    return new Promise(async (resolve, reject) => {

        let old = await getUser(UserID);
        if (old.error != null) {
            return resolve({
                success: false,
                error: (old.error.length == 1 ? old.error[0] : old.error),
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

        let resData = await res.json();
        if (resData.errors != null) {
            return resolve({
                success: false,
                error: (resData.errors.length == 1 ? resData.errors[0] : resData.errors),
                info: {
                    startedAt: start,
                    endedAt: Date.now(),
                }
            });
        } else return resolve(toPush(resData, start))
    });
}

module.exports = createUser;