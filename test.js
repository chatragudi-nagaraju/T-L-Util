
const {phase2RawData} = require("./rawData");
const {phaseINonStandardPolicies} = require("./submit-claim-nonstandard-travel-lodging-policies")
const {phaseIStandardPolicies} = require("./submit-claim-standard-travel-lodging-policies")
var fs = require("fs")

var dict = [];
var newPoliciesAddedInPhase2 = [];
const phaseINonStdPolocies = phaseINonStandardPolicies();
const phaseIStdPolocies = phaseIStandardPolicies();


['NonStandard'].forEach(formType => {
    phase2RawData().filter(x=>x.FormType === formType).forEach(x=> 
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
            const oldPolicy = phaseINonStdPolocies.find(phaseI => phaseII.policy === phaseI.policyNumber);
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
                newPoliciesAddedInPhase2.push(obj);
            }
        })
        fs.writeFile('./NonStandard.json',JSON.stringify([...phaseINonStdPolocies, ...newPoliciesAddedInPhase2]), err => {});
        
});


