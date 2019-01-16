const getGUID = (() => {
    let guid = +new Date();

    return () => {
        return guid++;
    }
})();

export default {
    getGUID: getGUID
}