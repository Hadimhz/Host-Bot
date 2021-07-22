const fetch = require('node-fetch');
const { toPush, toIncludes } = require('../utils');

/**
 * 
 * @param {Number} ID Node ID you're trying to fetch.
 * @param {Object}  [options] What to include with request.
 * @param {Boolean} [options.allocations] List of allocations added to the node.
 * @param {Boolean} [options.location] Information about the location the node is assigned to.
 * @param {Boolean} [options.servers] List of servers on the node.
 */
module.exports = (ID, options) => {
    if (options == null || typeof options != "object") options = {};
    if (ID == null) ID = 0;

    let cred = require('../Application').cred();
    let start = Date.now();

    let include = toIncludes(options);

    return new Promise(async (resolve, reject) => {
        let res = await fetch(cred.url + "/api/application/nodes/" + ID + (include.length > 0 ? "?include=" + include.join(',') : ""), {
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