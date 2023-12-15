console.log("hello1");
//const payload=JSON.parse(process.env.PAYLOAD);
try {
    const payload1=JSON.parse(fs.readFileSync('./payload.json'))
    console.log(payload1);

    
} catch (error) {
    console.log(error);
}
console.log("hello2");
//console.log(payload)



