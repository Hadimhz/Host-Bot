const { panel } = require('../index.js');

const fetchBotNodes = async () => {
        
    let allNodes = await panel.fetchNodes()
    let toReturn = [];

    let botNodes = allNodes.data.filter(x => x.description?.toLowerCase()?.includes('bots'));

    botNodes.forEach(n => toReturn.push(n.id))

    return toReturn;

}

const fetchGamingNodes = async () => {
        
    let allNodes = await panel.fetchNodes()
    let toReturn = [];

    let gamingNodes = allNodes.data.filter(x => x.description?.toLowerCase()?.includes('bots'));

    gamingNodes.forEach(n => toReturn.push(n.id))

    return toReturn;

}

const fetchStorageNodes = async () => {
        
    let allNodes = await panel.fetchNodes()
    let toReturn = [];

    let storageNodes = allNodes.data.filter(x => x.description?.toLowerCase()?.includes('bots'));

    storageNodes.forEach(n => toReturn.push(n.id))

    return toReturn;

}

module.exports = {
    fetchBotNodes,
    fetchGamingNodes,
    fetchStorageNodes
}