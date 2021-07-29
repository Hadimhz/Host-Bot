const { panel } = require('../index.js');

const fetchNodes = async () => await panel.fetchNodes();

const fetchBotNodes = (allNodes) => allNodes.data.filter(x => x.description?.toLowerCase()?.includes('bots')).map(node => node.id);


const fetchGamingNodes = (allNodes) => allNodes.data.filter(x => x.description?.toLowerCase()?.includes('gaming')).map(node => node.id);


const fetchStorageNodes = (allNodes) => allNodes.data.filter(x => x.description?.toLowerCase()?.includes('storage')).map(node => node.id);



const parse = (nodes) => ({
    botNodes: fetchBotNodes(nodes),
    gamingNodes: fetchGamingNodes(nodes),
    storageNodes: fetchStorageNodes(nodes)
});


module.exports = {
    fetchNodes,
    fetchBotNodes,
    fetchGamingNodes,
    fetchStorageNodes,
    parse
}