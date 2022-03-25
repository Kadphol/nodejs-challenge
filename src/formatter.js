exports.formatter = (payload) => {
    let array = [];
    for(let key in payload) {
        for(let obj of payload[key]) {
            array.push(obj);
        }
    }
    array.forEach(e => {
        if(e.parent_id) {
            array.find(p => p.id === e.parent_id).children.push(e);
        }
    });
    return array.filter(el => el.level == 0);
}