const fetch = require('node-fetch');

/**
 * @param {Number} ID User ID
 */
function createUser(ID) {
    let cred = require('../Application').cred();
    let start = Date.now();
    return new Promise(async (resolve, reject) => {

        let res = await fetch(cred.url + "/api/application/users/" + ID, {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": 'Bearer ' + cred.APIKey,
                "Accept": 'application/json'
            },
        });

        let data = await res.json().catch(x => {
            return resolve({
                success: true,
                info: {
                    startedAt: start,
                    endedAt: Date.now(),
                }
            })
        });

        if (data != null && data.errors != null) {
            return resolve({
                success: false,
                error: (data.errors.length == 1 ? data.errors[0] : data.errors),
                info: {
                    startedAt: start,
                    endedAt: Date.now(),
                }
            });
        }
    })
}

module.exports = createUser;