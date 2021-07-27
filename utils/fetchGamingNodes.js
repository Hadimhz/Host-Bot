const { panel } = require('../index');

const fetchGamingNodes = async () => {
    let toReturn = [];

    let allNodes = await panel.fetchNodes();

    let botNodes = allNodes.data.filter(x => x.description?.toLowerCase()?.includes('gaming'));

    botNodes.forEach(n => toReturn.push(n.id))

    return toReturn;
}

module.exports = fetchGamingNodes;