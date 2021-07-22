let login = {
    url: null,
    APIKey: null
};

let createUser = require('./Modules/createUser');
let deleteUser = require('./Modules/deleteUser');
let createServer = require('./Modules/createServer');
let deleteServer = require('./Modules/deleteServer');

let getServer = require('./Modules/getServer');
let getNode = require('./Modules/getNode');
let getUser = require('./Modules/getUser');
let getNest = require('./Modules/getNest');
let getLocation = require('./Modules/getLocation');

let fetchNests = require('./Modules/getAllNests');
let fetchUsers = require('./Modules/getAllUsers');
let fetchServers = require('./Modules/getAllServers');
let fetchNodes = require('./Modules/getAllNodes');
let fetchLocations = require('./Modules/getAllLocations');

let updateUser = require('./Modules/updateUser');

let initialize = (HostURL, APIKey) => {
    HostURL = HostURL.trim();
    if (HostURL.endsWith('/')) HostURL = HostURL.slice(0, -1);
    login = {
        url: HostURL,
        APIKey: APIKey.trim()
    }
}
let credential = () => {
    return login;
}

module.exports = {
    login: initialize,
    cred: credential,

    // post Requests 
    createUser: createUser,
    deleteUser: deleteUser,
    createServer: createServer,
    deleteServer: deleteServer,

    // get Requests 
    fetchUsers: fetchUsers,
    fetchServers: fetchServers,
    fetchNodes: fetchNodes,
    fetchNests: fetchNests,
    fetchLocations: fetchLocations,

    getServer: getServer,
    getNode: getNode,
    getUser: getUser,
    getNest: getNest,
    getLocation: getLocation,

    // patch Requests
    updateUser: updateUser,
}