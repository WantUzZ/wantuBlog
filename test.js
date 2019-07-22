const Promise = require('promise');

function sleep(time_ms){
    return new Promise( resolve => {
        setTimeout(resolve(time_ms), time_ms * 1000);
    });
}

async function test(n){
    console.info('start'+n);
    await sleep(n);
    console.info('end'+n);
}

async function main(){
    let timeMsArr = [1,2,3];
    try{
        for(let t of timeMsArr){
            await test(t);
        }
    }catch(err){
        console.info(`err`+err)
    }

    console.info('ok');
}

main();