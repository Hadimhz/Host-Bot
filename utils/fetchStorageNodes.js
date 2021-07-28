
const fetchStorageNodes = async () => {
    let toReturn = [];

    let allNodes = await panel.fetchNodes();

    let botNodes = allNodes.data.filter(x => x.description?.toLowerCase()?.includes('storage'));

    botNodes.forEach(n => toReturn.push(n.id))

    return toReturn;
}

module.exports = fetchStorageNodes;