var fs = require("fs");
const {data} = require("./rawData");

// verify all the policies with inclusive codes included in the new list
var fileContent = fs.readFileSync('./temp.json', {encoding:'utf8', flag:'r'});

['NonStandard'].forEach(formType => {
    data().filter(tlData=>tlData.FormType === formType).forEach(data => {
        var hasPolicy = fileContent.indexOf(data.policyNumber)>=0;
        if(!hasPolicy){
            console.log('Policy:', data.policyNumber, 'not included')
            return;
        }
        var haspvrc = data.inclusivePvrcs?.toString().trim().length > 0;
        if(haspvrc){
            var isPVRCFound = fileContent.indexOf(data.inclusivePvrcs)>=0;
            //console.log('pvrc:', data.inclusivePvrcs, 'found');
            if(!isPVRCFound){
                console.log('PVRC code:',data.inclusivePvrcs,'not included for the policy:', data.policyNumber);
            }
        }
    })
});