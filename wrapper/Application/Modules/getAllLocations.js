const fetch = require('node-fetch');
const { toIncludes, toPush } = require('../utils');


/**
 * @param {Object} [options] What to include with request.
 * @param {Boolean} [options.eggs] Include all eggs in that Nest.
 * @param {Boolean} [options.servers] Include all serrvers using that Nest.
 * */

function getAllLocations(options) {
    if (options == null || (typeof options) != "object") options = {};


    let cred = require('../Application').cred();
    let start = Date.now();

    let include = toIncludes(options);


    return new Promise(async (resolve, reject) => {
        let locations = []
        let res = await fetch(cred.url + "/api/application/locations" + (include.length > 0 ? `?include=${include.join(',')}` : ""), {
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
        locations = locations.concat(data.data);
        if (data.meta.pagination.current_page != data.meta.pagination.total_pages) {
            for (let i = 2; i <= data.meta.pagination.total_pages; i++) {
                fetch(cred.url + "/api/application/locations?page=" + i + (include.length > 0 ? `&include=${include.join(',')}` : ""), {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": 'Bearer ' + cred.APIKey,
                        "Accept": 'application/json'
                    }
                }).then(x => x.json()).then(x => {
                    locations = locations.concat(x.data);
                    if (x.meta.pagination.total == servers.length)
                        return resolve(toPush(locations, start));
                });
            }
        } else
            return resolve(toPush(locations, start));

    });
}

module.exports = getAllLocations;