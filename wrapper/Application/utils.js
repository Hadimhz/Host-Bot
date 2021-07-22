let toPush = (input, start) => {
    if (input.length == 0) {
        return {
            success: false,
            error: {
                code: 'NotFoundHttpException',
                status: '404',
                detail: 'The requested resource does not exist on this server.'
            },
            info: {
                startedAt: start,
                endedAt: Date.now(),
            }
        };
    }

    if (input.length != null) {
        input = input.map(x => {
            x = x.attributes;
            if (x.relationships) {
                let k = Object.keys(x.relationships);
                x.extras = {};
                k.forEach(key => {
                    if (x.relationships[key].data != null)
                        x.extras[key] = x.relationships[key].data.map(a => a.attributes);
                    else
                        x.extras[key] = x.relationships[key];
                })
            }
            return x;
        })
    } else {
        if (input.attributes != null) input = input.attributes;

        if (input.relationships) {
            let k = Object.keys(input.relationships);
            input.extras = {};
            k.forEach(key => {
                if (input.relationships[key].data != null)
                    input.extras[key] = input.relationships[key].data.map(a => a.attributes);
                else
                    input.extras[key] = input.relationships[key];
            })
            delete input.relationships;
        }
    }

    let toReturn = {
        success: true
    }

    if (input != null)
        toReturn.data = (input.length == 1 ? input[0] : input);

    toReturn.info = {
        total_amount: (input != null ? (input.length != null ? input.length : 1) : 0),
        startedAt: start,
        endedAt: Date.now(),
    }

    return toReturn;
};

let toIncludes = (options) => {
    let include = [];
    if (Object.values(options).includes(true)) {
        include = [];
        const entries = Object.entries(options)
        for (const [flags, value] of entries) {
            if (value == true) include.push(flags);
        }
    }

    return include;
}

module.exports = {
    toPush: toPush,
    toIncludes: toIncludes,
}