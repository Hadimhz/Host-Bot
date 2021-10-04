const fetch = require('node-fetch');
const { toPush } = require('../utils');

/**
 * @param {Object}  [options] 
 * @param {Object}  [options.] What to include with request.
 * @param {Boolean} [options.eggs] Include List of eggs in the location.
 * @param {Boolean} [options.servers] Include List of servers in the location.
 * */
module.exports = (ID, options) => {
    if (options == null || typeof options != "object") options = {};
    if (ID == null) ID = 0;

    let cred = require('../Application').cred();
    let start = Date.now();

    let include = toIncludes(options);

    return new Promise(async (resolve, reject) => {
        let data = await fetch(cred.url + "/api/application/nests/" + ID + (include.length > 0 ? "?include=" + include.join(',') : ""), {
            headers: {
                "Content-Type": 'application/json',
                "Authorization": 'Bearer ' + cred.APIKey,
                "Accept": 'application/json'
            }
        }).then(x => x.json());
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