const fs = require('fs');
console.log("hello1")
try {
    const payload1=JSON.parse(fs.readFileSync('./payload.json'))
    console.log(payload1);

    
} catch (error) {
    console.log(error);
}
console.log("hello2")
