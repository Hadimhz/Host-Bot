const { panel } = require('../index');

const fetchBotNodes = async () => {
    let toReturn = [];

    let allNodes = await panel.fetchNodes();

    let botNodes = allNodes.data.filter(x => x.description?.toLowerCase()?.includes('bots'));

    botNodes.forEach(n => toReturn.push(n.id))

    return toReturn;
}

module.exports = fetchBotNodes;