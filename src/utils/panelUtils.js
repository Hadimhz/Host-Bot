const { panel } = require('../index.js');

const fetchNodes = async () => await panel.fetchNodes();

const fetchBotNodes = (allNodes) => allNodes.data.filter(x => x.description?.toLowerCase()?.includes('bot')).map(node => node.id);

const fetchGamingNodes = (allNodes) => allNodes.data.filter(x => x.description?.toLowerCase()?.includes('gaming')).map(node => node.id);

const fetchStorageNodes = (allNodes) => allNodes.data.filter(x => x.description?.toLowerCase()?.includes('storage')).map(node => node.id);

const fetchEggs = async () => (await panel.fetchNests({eggs: true})).data.map(nest => nest.extras.eggs.map(({name, nest: nestID, id}) => ({id, nestID,name})))
.reduce((a, b) => a.concat(b), []);

const parseNodes = (nodes) => ({
    botNodes: fetchBotNodes(nodes),
    gamingNodes: fetchGamingNodes(nodes),
    storageNodes: fetchStorageNodes(nodes)
});


module.exports = {
    fetchNodes,
    fetchBotNodes,
    fetchGamingNodes,
    fetchStorageNodes,
    fetchEggs,
    parse: parseNodes
}