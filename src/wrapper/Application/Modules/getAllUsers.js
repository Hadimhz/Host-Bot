const { toIncludes, toPush } = require('../utils');
const fetch = require('node-fetch');

/**
 * @param {Object}  [options] 
 * @param {Object}  [options.filter] What to filter with.
 * @param {String}  [options.filter.key] What to filter with. [email, uuid, username, external_id]
 * @param {String}  [options.filter.value] Value to look for.
 * @param {Object}  [options.include] What to include with request.
 * @param {Boolean} [options.include.servers] Include all serrvers using that Location.
 * */

function getAllUsers(options) {
    if (options == null || typeof options != "object") options = {};


    let cred = require('../Application').cred();
    let start = Date.now();

    let filter = ((options.filter != null && options.filter.key != null && options.filter.value != null) ? `filter[${options.filter.key}]=${options.filter.value}` : "")

    let include = []
    if (options.include != null) {
        include = toIncludes(options.include);
    }

    let addon = ((filter.length > 0 || include.length > 0) ? "?" + (filter.length > 0 ? filter + (include.length > 0 ? `&include=${include.join(',')}` : "") : (include.length > 0 ? `include=${include.join(',')}` : "")) : "")
    return new Promise(async (resolve, reject) => {
        let users = []
        let res = await fetch(cred.url + "/api/application/users" + addon, {
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

        users = users.concat(data.data);
        if (data.meta.pagination.current_page != data.meta.pagination.total_pages && filter.length == 0) {
            for (let i = 2; i <= data.meta.pagination.total_pages; i++) {
                fetch(cred.url + "/api/application/users?page=" + i + (include.length > 0 ? `&include=${include.join(',')}` : ""), {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": 'Bearer ' + cred.APIKey,
                        "Accept": 'application/json'
                    }
                }).then(x => x.json()).then(x => {
                    users = users.concat(x.data);
                    if (x.meta.pagination.total == users.length) {
                        return resolve(toPush(users, start));
                    }
                });
            }
        } else
            resolve(toPush(users, start))
    });

}

module.exports = getAllUsers;