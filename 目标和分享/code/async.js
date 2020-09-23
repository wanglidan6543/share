async function asyncFunction() {
    let r1 = await function1();
    let r2 = await function2();

    let result = r1 + r2;
    console.log(result);
    return 'result is:' +  result; 
}

function function1() {
    return 100;
}

function function2() {
    return 200;
}

asyncFunction().then(res => {
    console.log(res);
});