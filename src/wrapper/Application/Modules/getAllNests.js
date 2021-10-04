const { toIncludes, toPush } = require('../utils');
const fetch = require('node-fetch');

/**
 * @param {Object} [options] What to include with request.
 * @param {Boolean} [options.nodes] Include all nodes using that Location.
 * @param {Boolean} [options.servers] Include all serrvers using that Location.
 * */

function getAllNests(options) {
    if (options == null || (typeof options) != "object") options = {};

    let cred = require('../Application').cred();
    let start = Date.now();

    let include = toIncludes(options);

    return new Promise(async (resolve, reject) => {
        let nests = []
        let res = await fetch(cred.url + "/api/application/nests" + (include.length > 0 ? `?include=${include.join(',')}` : ""), {
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

        nests = nests.concat(data.data);

        if (data.meta.pagination.current_page != data.meta.pagination.total_pages) {
            for (let i = 2; i <= data.meta.pagination.total_pages; i++) {
                fetch(cred.url + "/api/application/nests?page=" + i + (include.length > 0 ? `&include=${include.join(',')}` : ""), {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": 'Bearer ' + cred.APIKey,
                        "Accept": 'application/json'
                    }
                }).then(x => x.json()).then(x => {
                    nests = nests.concat(x.data);
                    if (x.meta.pagination.total == nests.length) {
                        return resolve(toPush(nests, start));
                    }
                });
            }
        } else {
            return resolve(toPush(nests, start));
        }
    });

}

module.exports = getAllNests;