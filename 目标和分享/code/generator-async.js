// generator函数的用法
// 1. 可以处理异步操作,将异步操作放到yield表达式中
function* loadUI() {
    showLoading();
    yield loadUIData();
    hideLoading();
}
function showLoading() {
    console.log('show loading');
}
function hideLoading() {
    console.log('hide loading');
}
function loadUIData() {
    console.log('load ui data');
}
let loader = loadUI();
loader.next();   
loader.next();   

function* main() {
    var result = yield request("http://baidu.com");
    var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
    makeAjaxCall(url, function(response){
        it.next(response);
    });
}

function makeAjaxCall(url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();
    callback(request.response());
}

var it = main();
it.next();