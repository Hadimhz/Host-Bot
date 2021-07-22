const fetch = require('node-fetch');
const { toPush } = require('../utils');

function getAllServers() {
    let cred = require('../Application').cred();
    let start = Date.now();

    return new Promise(async (resolve, reject) => {
        let servers = []
        let res = await fetch(cred.url + "/api/application/servers", {
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
        servers = servers.concat(data.data);
        if (data.meta.pagination.current_page != data.meta.pagination.total_pages) {
            for (let i = 2; i <= data.meta.pagination.total_pages; i++) {
                fetch(cred.url + "/api/application/servers?page=" + i, {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": 'Bearer ' + cred.APIKey,
                        "Accept": 'application/json'
                    }
                }).then(x => x.json()).then(x => {
                    if (x.errors != null) {
                        return resolve({
                            success: false,
                            error: (x.errors.length == 1 ? x.errors[0] : x.errors),
                            info: {
                                startedAt: start,
                                endedAt: Date.now(),
                            }
                        });
                    };
                    servers = servers.concat(x.data);
                    if (x.meta.pagination.total == servers.length) {
                        return resolve(toPush(servers, start));
                    }
                });
            }
        } else
            return resolve(toPush(servers, start));
    });
}
module.exports = getAllServers;