const { Collection, Permissions } = require('discord.js')
const fs = require('fs');
const config = require('../config.json')
let log = {
    categories: [],
    errors: [],
    stats: {
        categories: 0,
        commands: 0,
        subCommands: 0,
        errors: 0
    }
}

let merge = (x, y) => {
    for (const [key, value] of Object.entries(y)) {
        x[key] = value;
    }
    return x;
}

let checkForDuplicate = (current, commands, includePath = false) => {
    let duplicate = commands.find(x => x.name == current.name ||
        x.aliases.includes(current.name) ||
        current.aliases.includes(x.name) ||
        current.aliases.some(y => x.aliases.includes(y))) || null;

    let toReturn = {
        status: duplicate != null,
        file: (current.mainCommand != null ? current.mainCommand + "/" : "") + current.file,
        in: duplicate != null ? (duplicate.mainCommand != null ? duplicate.mainCommand + "/" : "") + duplicate.file : null,
        duplicate: []
    }

    if (duplicate != null) {

        if (includePath != null) {
            current.file = current.path + '/' + current.file
            duplicate.file = duplicate.path + '/' + duplicate.file
        }

        if (current.name == duplicate.name) {
            toReturn.duplicate.push(`${current.file} shares the same name variable with ${duplicate.file}`);
        }

        if (duplicate.aliases.includes(current.name)) {
            toReturn.duplicate.push(`${current.file}'s name was found is ${duplicate.file}'s aliases`);
        }

        if (current.aliases.includes(duplicate.name)) {
            toReturn.duplicate.push(`${duplicate.file}'s name was found is ${current.file}'s aliases`);
        }

        for (const alias of current.aliases.filter(y => duplicate.aliases.includes(y))) {
            toReturn.duplicate.push(`${current.file} and ${duplicate.file} both have the same alias ("${alias}")`);
        }
    }

    return toReturn;
}


let checkPermission = (permission) => {
    return Object.keys(Permissions.FLAGS).includes(permission);
}

let defaultCommands = {
    categories: [],
    errors: [],
    stats: {
        categories: 0,
        commands: 0,
        subCommands: 0,
        errors: 0,
        time: 0
    }
}

let findCommand = (list, commandsList, message) => {
    let cmd;
    let args = [...list];
    while (list.length > 0 && (cmd != null || args.length == list.length)) {
        let command = list.shift().toLowerCase();
        let temp;

        if (cmd == null) temp = commandsList.find(x => x.name == command || x.aliases.includes(command));
        else if (cmd != null && cmd.subCommands != null) temp = cmd.subCommands.find(x => x.name == command || x.aliases.includes(command));

        if (message != null) {
            if (temp != null && temp.requiredPermission != null && !message.member.permissions.has(temp.requiredPermission)) { // Permission check
                message.channel.send({ content: config.missing_permission.replace("{PERMISSION}", temp.requiredPermission) }); // Missing permission message
                return;
            }
        }

        if (temp != null) cmd = temp;
        if (temp == null || list.length == 0) return cmd;
    }
}

let loadCommands = (rootPath) => {
    let toReturn = {
        commandsCol: new Collection(),
        logs: defaultCommands
    }
    return new Promise((Resolve, Reject) => {

        toReturn.logs.stats.time = Date.now();

        let load = (path, parent) => {

            let _toReturn = []

            let files = fs.readdirSync(path); // Get the list of commands.
            for (const file of files) {

                let _command = {
                    name: file.split('.')[0].toLowerCase(),
                    description: "none",
                    usage: null,
                    aliases: [],
                    requiredPermission: null,
                    path: path.split('\\').pop(),
                    size: 0,
                    depth: (!parent ? 0 : parent.depth),
                    file: file,
                    errors: [],
                    // subCommands: null,
                    // run: null,
                };

                _command.depth++;

                let stats = fs.statSync(`${path}/${file}`);
                if (stats.isDirectory()) { // If the command is a folder

                    let _files = fs.readdirSync(`${path}/${file}`);
                    let main = _files.find(x => x.toLowerCase() == file.toLowerCase() + '.js')
                    if (main) {
                        let command = require(`${path}/${file}/${main}`);
                        _command = merge(_command, command.info || {})
                    }
                    _command.usage = `${parent != null ? `${parent.usage} ` : ''}${_command.name}${(_command.usage == null || _command.usage.trim().length == 0) ? '' : " " + _command.usage.trim()}`;

                    _command.subCommands = load(`${path}/${file}`, _command);
                } else {
                    _command.size = stats.size;
                    if (parent != null && (parent.file.toLowerCase() + '.js') == file.toLowerCase()) continue;
                    let command = require(`${path}/${file}`);

                    _command = merge(_command, command.info || {});
                    _command.usage = `${parent != null ? `${parent.usage} ` : ''}${_command.name}${(_command.usage == null || _command.usage.trim().length == 0) ? '' : " " + _command.usage.trim()}`;

                    _command.run = command.run || ((client, message, args) => console.log("WORKS!"));
                }

                let dirDupeCheck = checkForDuplicate(_command, (_toReturn || [])); // Checking for in this directory;
                if (dirDupeCheck.status == true) {
                    _command.errors.push({
                        path: _command.path + '/' + _command.file,
                        error: dirDupeCheck.duplicate
                    })
                }

                if (_command.requiredPermission != null && checkPermission(_command.requiredPermission) == false) {
                    _command.errors.push({
                        path: _command.path + '/' + _command.file,
                        error: `"${_command.requiredPermission}" is not a valid permission. check https://discord.com/developers/docs/topics/permissions for more information`
                    })
                }

                if (parent == null) {
                    let DupeCheck = checkForDuplicate(_command, (toReturn.commandsCol.array() || []), true); // Checking for in this directory;
                    if (DupeCheck.status == true) {
                        _command.errors.push({
                            path: _command.path + '/' + _command.file,
                            error: DupeCheck.duplicate
                        })
                    }
                }

                if (_command.errors.length == 0) {
                    delete _command.errors;
                    if (parent == null) toReturn.commandsCol.set(_command.name, _command);
                }
                else {
                    toReturn.logs.errors = toReturn.logs.errors.concat(_command.errors)
                }

                _toReturn.push(_command);
            }

            _toReturn = _toReturn.filter(x => x.errors == null);
            toReturn.logs.stats.commands = toReturn.logs.stats.commands + _toReturn.length;
            toReturn.logs.stats.subCommands = toReturn.logs.stats.subCommands + _toReturn.filter(x => x.subCommands != null && x.run == null).length;

            return _toReturn;
        }


        let files = fs.readdirSync(rootPath); // Get the list of categories.

        for (const file of files) {
            toReturn.logs.categories.push({ name: file, children: load(`${rootPath}/${file}`) });
        }

        toReturn.logs.stats.errors = toReturn.logs.errors.length;
        toReturn.logs.stats.categories = files.length;
        toReturn.logs.stats.time = Date.now() - toReturn.logs.stats.time;

        // save and output log
        log = toReturn.logs;
        module.exports.log = log;

        Resolve(toReturn);
    })
}

module.exports = {
    loadCommands,
    findCommand,
    log
}
