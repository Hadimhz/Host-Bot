const fetch = require('node-fetch');
const { toPush, toIncludes } = require('../utils');

/**
 * 
 * @param {Number} ID User ID you're trying to fetch.
 * @param {Object}  [options] What to include with request.
 * @param {Boolean} [options.servers] Include all serrvers owned by that user.
 */
function getUser(ID, options) {
    if (options == null || typeof options != "object") options = {};

    let cred = require('../Application').cred();
    let start = Date.now();

    let include = toIncludes(options);

    return new Promise(async (resolve, reject) => {
        let res = await fetch(cred.url + "/api/application/users/" + ID + (include.length > 0 ? "?include=" + include.join(',') : ""), {
            headers: {
                "Content-Type": 'application/json',
                "Authorization": 'Bearer ' + cred.APIKey,
                "Accept": 'application/json'
            }
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
        };
        return resolve(toPush(data, start));
    });
}

module.exports = getUser;