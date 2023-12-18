const fs = require('fs');
console.log("hello1");
console.log("webhooks enabled once again")
//const payload=JSON.parse(process.env.PAYLOAD);
try {
    const payload1=JSON.parse(fs.readFileSync('./payload.json'))
    console.log(payload1);

    
} catch (error) {
    console.log(error);
}
console.log("hello2");
//console.log(payload)



