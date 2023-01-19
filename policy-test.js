var fs = require("fs");
const {phase2RawData} = require("./rawData");

function getFileContent(formType) {
    if(formType === 'Standard') {
       return fs.readFileSync('./Standard.json', {encoding:'utf8', flag:'r'});
    } 
    return fs.readFileSync('./NonStandard.json', {encoding:'utf8', flag:'r'});
}

['Standard', 'NonStandard'].forEach(formType => {
    var fileContent = getFileContent(formType);
    phase2RawData().filter(tlData=>tlData.FormType === formType).forEach(data => {
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