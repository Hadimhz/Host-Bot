const fetch = require('node-fetch');

/**
 * @param {String} Username Users username
 * @param {String} Password Users password
 * @param {String} Email Users email
 * @param {String} FirstName Users first name
 * @param {String} LastName Users last name
 * @param {Boolean} IsAdmin Is the user admin? (true/false)
 * @param {String} Language Language, Normally [en/fr]
 */
function createUser(Username, Password, Email, FirstName, LastName, IsAdmin, Language) {
    let cred = require('../Application').cred();
    let start = Date.now();


    let input = {
        'username': Username,
        'email': Email,
        'first_name': FirstName,
        'last_name': LastName,
        'password': Password,
        'root_admin': IsAdmin,
        'language': Language,
    };
    return new Promise(async (resolve, reject) => {

        let res = await fetch(cred.url + "/api/application/users", {
            method: 'POST',
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