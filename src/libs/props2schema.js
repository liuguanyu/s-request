const BASE_TYPE = ["string", "number", "boolean", "date", "symbol"];

const toStr = val => Object.prototype.toString.call(val).slice(8, -1)

const getType = (value) => {
    const str = typeof value;

    if (str === 'object') {
        return value === null ? null : toStr(value).toLowerCase();
    }

    return str;
}

const dealWithNode = (node) => {
    let type = getType(node);

    switch (type) {
        case "boolean":
        case "number":
        case "date":
        case "symbol":
        case "string":
            return {
                "type": type
            };
            break;
        case "object":
            if (node.type) {
                return {
                    type: getType(node.type) === "array" ?
                        node.type.map(el => el.name.toLowerCase()) : node.type.name.toLowerCase()
                }
            } else {
                return {
                    ...props2schema(node)
                };
            }
            break;
        case "array":
            return node.map(el => el.name.toLowerCase())
            break;
        case "function":
            return {
                type: node.name.toLowerCase()
            };
            break;
    }
}

const props2schema = (props) => {
    let ret = {};
    let required = [];

    let keys = Object.keys(props);

    keys.forEach(el => {
        ret[el] = dealWithNode(props[el])
        if (props[el] && props[el]["required"] && props[el]["required"] === true) {
            required.push(el);
        }
        if (props[el] && props[el]["default"] !== undefined) {
            ret[el]["default"] = props[el]["default"];
        }
    })

    return {
        "type": "object",
        properties: {
            ...ret
        },
        required
    };
}

export default props2schema;