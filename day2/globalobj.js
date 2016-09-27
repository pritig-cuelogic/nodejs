console.log(__filename);
console.log(__dirname);

console.log("user 1");
setTimeout(callback,3000);

console.log("user 2");
setTimeout(callback,3000);

console.log("user 3");
setTimeout(callback,3000);

function callback(){
	console.log("callbak finish");
}

