var Set = require("collections/set");

var codes = new Set();

let t = Array(1,2,4,5,1,3)
let t1 = Array(1,2,4,25)

let tt = [...t, ...t1];

const {phase2RawData} = require("./rawData");
const {phaseINonStandardPolicies} = require("./submit-claim-nonstandard-travel-lodging-policies")
const {phaseIStandardPolicies} = require("./submit-claim-standard-travel-lodging-policies")
var fs = require("fs")

var dict = [];

const phaseINonStdPolocies = phaseINonStandardPolicies();
const phaseIStdPolocies = phaseIStandardPolicies();

function getphaseIPolocies(formType ) {
    if(formType === 'Standard') return phaseINonStdPolocies;
    return phaseIStdPolocies;
}

console.log(getphaseIPolocies('NonStandard' ))