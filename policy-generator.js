
const {phase2RawData} = require("./rawData");
const {phaseINonStandardPolicies} = require("./submit-claim-nonstandard-travel-lodging-policies")
const {phaseIStandardPolicies} = require("./submit-claim-standard-travel-lodging-policies")
var fs = require("fs")


const phaseINonStdPolocies = phaseINonStandardPolicies();
const phaseIStdPolocies = phaseIStandardPolicies();

function getphaseIPolocies(formType ) {
    if(formType === 'NonStandard') return phaseINonStdPolocies;
    return phaseIStdPolocies;
}

['NonStandard', 'Standard'].forEach(formType => {
    var dict = [];
    var newPoliciesAddedInPhase2 = [];
    var phaseIPolicies = getphaseIPolocies(formType);
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
        });
        

        /*
        Dict => 
                 {
                    policyNumber: '0185002',
                },
                    {
                        policyNumber: '0902860',
                        inclusivePvrcs: [
                        '00010001',
                        '00020002',
                        '00130013',
                        '00140014',
                        }
        */
        dict.forEach(phaseII => {

            const oldPolicy = phaseIPolicies.find(phaseI => phaseII.policy === phaseI.policyNumber);
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
                var obj = isNotEmptyCode ? {
                    policyNumber: phaseII.policy,
                    inclusivePvrcs: phaseII.inclusiveCode
                } : {
                    policyNumber: phaseII.policy
                };
                newPoliciesAddedInPhase2.push(obj);
            }
        })
        console.log('new policies',newPoliciesAddedInPhase2)
        fs.writeFile('./'+formType+'.json',JSON.stringify([...phaseIPolicies, ...newPoliciesAddedInPhase2]), err => {});
});


