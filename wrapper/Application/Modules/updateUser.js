const fetch = require('node-fetch');
let getUser = require('./getUser');
const { toPush } = require('../utils');

/**
 * @param {Number} UserID User's ID
 * @param {String} Username Users username
 * @param {String} Password Users password
 * @param {String} Email Users email
 * @param {String} FirstName Users first name
 * @param {String} LastName Users last name
 * @param {Boolean} IsAdmin Is the user admin? (true/false)
 * @param {String} Language Language, Normally [en/fr]
 */
async function createUser(UserID, Username, Password, Email, FirstName, LastName, IsAdmin, Language) {
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
            'username': Username != null ? Username : old.data.username,
            'email': Email != null ? Email : old.data.email,
            'first_name': FirstName != null ? FirstName : old.data.first_name,
            'last_name': LastName != null ? LastName : old.data.last_name,
            'password': Password != null ? Password : old.data.password,
            'root_admin': IsAdmin != null ? IsAdmin : old.data.root_admin,
            'language': Language != null ? Language : old.data.language,
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