const fetch = require('node-fetch');
const { toPush, toIncludes } = require('../utils');

/**
 * 
 * @param {Number|String} ID Server ID you're trying to fetch.
 * @param {Object}  [options] What to include with request.
 * @param {Boolean} [options.allocations] Include List of allocations assigned to the server.
 * @param {Boolean} [options.user] Include Information about the server owner.
 * @param {Boolean} [options.subusers] Include all subusers on that server.
 * @param {Boolean} [options.pack] Include Information about the server pack.
 * @param {Boolean} [options.nest] Include Information about the server's egg nest.
 * @param {Boolean} [options.egg] Include Information about the server's egg.
 * @param {Boolean} [options.variables] List of server variables. (causes an error)
 * @param {Boolean} [options.location] Include Information about server's node location.
 * @param {Boolean} [options.node] Include Information about the server's node.
 * @param {Boolean} [options.databases] Include List of databases on the server.
 */
module.exports = (ID, options) => {
    if (options == null || typeof options != "object") options = {};
    if (ID == null) ID = 0;

    let cred = require('../Application').cred();
    let start = Date.now();

    let include = toIncludes(options);

    return new Promise(async (resolve, reject) => {
        let res = await fetch(cred.url + "/api/application/servers/" + ID + (include.length > 0 ? "?include=" + include.join(',') : ""), {
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