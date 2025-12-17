const fs = require('fs');
const path = require('path');
const https = require('https');

const heavytypes = [
    { name: "Slime Boxbinder", value: "boxbinder_slime" },    
    { name: "Slime Catsuit", value: "catsuit_slime" },
    { name: "Slime Encasement", value: "encasement_slime" },    

    { name: "Sticky Rubber Boxbinder", value: "boxbinder_rubber" },    
    { name: "Sticky Rubber Catsuit", value: "catsuit_rubber" },
    { name: "Sticky Rubber Encasement", value: "encasement_rubber" },    

    { name: "Latex Boxbinder", value: "boxbinder_latex" },
    { name: "Latex Catsuit", value: "catsuit_latex" },
    { name: "Latex Encasement", value: "encasement_latex" },    

    { name: "Resin Boxbinder", value: "boxbinder_resin" },
    { name: "Resin Catsuit", value: "catsuit_resin" },
    { name: "Resin Encasement", value: "encasement_resin" },    
];

const convertheavy = (type) => {
    let convertheavyarr
    for (let i = 0; i < heavytypes.length; i++) {
        if (convertheavyarr == undefined) { convertheavyarr = {} }
        convertheavyarr[heavytypes[i].value] = heavytypes[i].name
    }
    return convertheavyarr[type];
}

const assignHeavy = (user, type) => {
    if (process.heavy == undefined) { process.heavy = {} }
    process.heavy[user] = {
        type: convertheavy(type),
        typeval: type
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/heavyusers.txt`, JSON.stringify(process.heavy));
}

const getHeavy = (user) => {
    if (process.heavy == undefined) { process.heavy = {} }
    return process.heavy[user];
}

const removeHeavy = (user) => {
    if (process.heavy == undefined) { process.heavy = {} }
    delete process.heavy[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/heavyusers.txt`, JSON.stringify(process.heavy));
}

exports.assignHeavy = assignHeavy
exports.getHeavy = getHeavy
exports.removeHeavy = removeHeavy
exports.commandsheavy = heavytypes
exports.convertheavy = convertheavy