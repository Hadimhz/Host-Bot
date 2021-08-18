const fetch = require('node-fetch');

/**
 * @param {Number} ID Server ID.
 * @param {Boolean} force if true This action will attempt to delete the server from both the panel and daemon. If the daemon does not respond, or reports an error the deletion will continue.
 */

function createUser(ID, force) {
    if (ID == null) ID = 0;
    if (force == null) force = false;

    let cred = require('../Application').cred();
    let start = Date.now();
    return new Promise(async (resolve, reject) => {

        let res = await fetch(cred.url + "/api/application/servers/" + ID + (force == true ? "/force" : ""), {
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