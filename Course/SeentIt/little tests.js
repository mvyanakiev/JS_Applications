let tstStr = "kura mi myTest";
let emptytStr = "";
let tstNmbr = 42;


console.log(typeof tstStr);
console.log(typeof tstNmbr);

if (typeof tstStr === "string") { // стринг може да е дума с числа вътре и всичко, което е ме/у кавички
    console.log("vliza za string");
}

if (emptytStr === "") {
    console.log("vliza kato prazen, ама е тъпо"); // не професионално така
}


if (emptytStr.length === 0) {
    console.log("vliza kato prazen");
}


if (typeof tstNmbr === "number") {
    console.log("vliza za номер");
}

if (!emptytStr) {
    console.log("emptytStr е празен"); // проверка за празност
}

function formatSender(name, username) {
    if (!name)
        return username;
    else
        return username + ' (' + name + ')';
}

console.log(formatSender("", "userName"));
console.log(formatSender("ime", "userName"));