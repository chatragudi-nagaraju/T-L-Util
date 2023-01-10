
const {data} = require("./rawData");
const {oldStandardData} = require("./submit-claim-standard-travel-lodging-policies")
var fs = require("fs")

var dict = [];

var existingPolicies = [];

var temp = [];
const oldPolicies = oldStandardData();
['NonStandard'].forEach(formType => {
    data().filter(x=>x.FormType === formType).forEach(x=> 
        {
            var policy = dict.find(y => y.policy === x.policyNumber);
            if(policy) {
                 policy.inclusiveCode.push(x.inclusivePvrcs.toString())
            }else{
                dict.push({
                    policy: x.policyNumber,
                    inclusiveCode: [x.inclusivePvrcs.toString()]
                })
            }
        })
        
        dict.forEach(phaseII => {
            const oldPolicy = oldPolicies.find(phaseI => phaseII.policy === phaseI.policyNumber);
            const isNotEmptyCode = !(phaseII.inclusiveCode.length == 1 && phaseII.inclusiveCode[0].length === 0);
            if(oldPolicy){
                if(oldPolicy.inclusivePvrcs){
                    //concat 2 pvrcs and convert to set to remove the duplicates
                    let combinedCodes = [...oldPolicy.inclusivePvrcs, ...phaseII.inclusiveCode];
                    let unique = [...new Set(combinedCodes)];
                    oldPolicy.inclusivePvrcs = unique;
                }
                else{
                    if(isNotEmptyCode){
                        oldPolicy.inclusivePvrcs = phaseII.inclusiveCode;
                    }
                }
            }else{
                // New policy, added in phase II 
                var obj = isNotEmptyCode ? [{
                    policyNumber: phaseII.policy,
                    inclusivePvrcs: phaseII.inclusiveCode
                }] : [{
                    policyNumber: phaseII.policy
                }];
                temp.push(obj);
            }
        })
        fs.writeFile('./temp.json',JSON.stringify([...oldPolicies, ...temp]), err => {});
        
});


