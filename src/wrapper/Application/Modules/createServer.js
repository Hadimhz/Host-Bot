const fetch = require('node-fetch');
const { toPush } = require('../utils');
/**
 * 
 * @param {String} ServerName Character limits: a-z A-Z 0-9 _ - . and [Space].
 * @param {Number} UserID User ID
 * @param {Number} NestID the Nest that this server will be grouped under.
 * @param {Number} EggID the Egg will define how this server should operate.
 * @param {Number} Location Node location
 * @param {Number} CPU The amount of CPU Power the server can use. (100 = 1 core)
 * @param {Number} RAM The maximum amount of memory allowed for this container.
 * @param {Number} Swap Setting this to 0 will disable swap space on this server. Setting to -1 will allow unlimited swap.
 * @param {Number} Disk This server will not be allowed to boot if it is using more than this amount of space. If a server goes over this limit while running it will be safely stopped and locked until enough space is available. Set to 0 to allow unlimited disk usage.
 * @param {Number} IO The IO performance of this server relative to other running containers on the system. Value should be between 10 and 1000 (please keep at 500).
 * @param {(String|null)} DockerImage This is the default Docker image that will be used to run this server. Can be null (if null the wrapper will get the dockerimage from the egg)
 * @param {(String|null)} StartupCmd Start Up Command. Can be null (if null the wrapper will get the default startupcmd from the egg)
 * @param {Object} environment enviroment
 * @param {Object} [option] Feature Limits. (databases, allocations, backups)
 * @param {Number} [option.databases=0] Amount of databases this server is allowed to have.
 * @param {Number} [option.allocations=0] Amount of allocations this server is allowed to have.
 * @param {Number} [option.backups=0] Amount of backups this server is allowed to have.
 */
function createServer(ServerName, UserID, NestID, EggID, Location, RAM, Swap, Disk, IO, CPU, DockerImage, StartupCmd, environment, option) {
    let cred = require('../Application').cred();
    let getNest = require('./getNest');
    let start = Date.now();

    if (option == null || option) option = {
        databases: 0,
        allocations: 0,
        backups: 0
    };
    return new Promise(async (resolve, reject) => {
        if (DockerImage == null || StartupCmd == null) {
            let egg = await getNest(NestID);
            if (egg.errors != null) {
                return resolve({
                    success: false,
                    error: (data.errors.length == 1 ? data.errors[0] : data.errors),
                    info: {
                        startedAt: start,
                        endedAt: Date.now(),
                    }
                });
            };
            egg = egg.data.extras.eggs.find(x => x.id == EggID);
        }

        const input = {
            "name": ServerName,
            "user": UserID,
            "nest": NestID,
            "egg": EggID,
            "docker_image": DockerImage == null ? (egg != null ? egg.docker_image : "") : DockerImage,
            "startup": StartupCmd == null ? (egg != null ? egg.startup : "") : StartupCmd,
            "limits": {
                "memory": RAM,
                "swap": Swap,
                "disk": Disk,
                "io": IO,
                "cpu": CPU
            },
            "environment": environment,

            "feature_limits": {
                "databases": option.databases != null ? option.databases : 0,
                "allocations": option.allocations != null ? option.allocations : 0,
                "backups": option.backups != null ? option.backups : 0
            },
            "deploy": {
                "locations": [Location],
                "dedicated_ip": false,
                "port_range": []
            },
            'oom_disabled': true,
            "start_on_completion": false
        };

        let res = await fetch(cred.url + "/api/application/servers", {
            method: 'POST',
            body: JSON.stringify(input),
            headers: {
                "Content-Type": 'application/json',
                "Authorization": 'Bearer ' + cred.APIKey,
                "Accept": 'application/json'
            },
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
        } else return resolve(toPush(data, start));
    });

}

module.exports = createServer;