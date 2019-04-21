let tstStr = "myTest";
let emptyStr = "";
let testNumber = 42;


console.log(typeof tstStr);
console.log(typeof testNumber);

if (typeof tstStr === "string") {
    console.log("enter as string");
}

if (emptyStr === "") {
    console.log("enter as empty, but is not good");
}


if (emptyStr.length === 0) {
    console.log("enter as empty");
}


if (typeof testNumber === "number") {
    console.log("enter as number");
}

if (!emptyStr) {
    console.log("emptyStr is empty");
}

function formatSender(name, username) {
    if (!name)
        return username;
    else
        return username + ' (' + name + ')';
}

console.log(formatSender("", "userName"));
console.log(formatSender("name", "userName"));