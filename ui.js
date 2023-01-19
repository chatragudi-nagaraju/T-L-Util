//const sum = a => b => a+b;
const sum = (a,b) => {
    if(b){
        return a+b;
    }
    return b => a+b;
};

var list = [{
    policy: "123"
},
{
    policy: "45",
    inc :[1,2,3]
}
];

list = {
    ...list,
    [{
        policy: "123",
        inc: [4,4,4]
    }]

}

console.log(list);