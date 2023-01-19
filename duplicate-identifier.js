const {phase2RawData} = require("./rawData");

const {nstdData} = require("./NonStandard");

const {stdData} = require("./Standard");



var nonStd = phase2RawData().filter(x=>x.FormType === 'NonStandard').map(x=>x.policyNumber);
var std = phase2RawData().filter(x=>x.FormType === 'Standard').map(x=>x.policyNumber);

;
console.log('Total Non Std', [...new Set(nonStd)].length);
console.log('Total std', [...new Set(std)].length);
var dups =[]
nonStd.forEach(nstd => {
    var policy = std.find(std => std === nstd);
    if(policy && !dups.find(x=>x === policy)){
        dups.push(policy);
    }
})

std.forEach(std => {
    var policy = nonStd.find(nstd => nstd === std);
    if(policy && !dups.find(x=>x === policy)){
        dups.push(policy);
    }
})

console.log('dups from raw data', dups);

dups = []
nstdData().forEach(nstd => {
    var policy  = stdData().find(std => std.policyNumber === nstd.policyNumber);

    if(policy && !policy.inclusivePvrcs){
        dups.push(policy.policyNumber)
        
    }
})

console.log('dups in both files with no inclusive codes', dups);