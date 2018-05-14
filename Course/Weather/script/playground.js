class Test {

    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.c = this.calc()
    }

    // изчислявам "с" с входящите данни "а" и "b"

    calc(a, b) {
        let c = this.a * this.b;
        return c;
    }


    calcSomethingElse(a, c) {
        let newValue = a * c;
        return newValue;
    }


    //генерирам някакъв изход с данните, които имам

    reportData(a, b, c) {

        let addedValue = this.calcSomethingElse(this.a, this.c);

        console.log("Data type A = " + this.a);
        console.log("Data type B = " + this.b);
        console.log("Calculated Data C = " + this.c);
        console.log("Added value is: " + addedValue);
    }

}


let myTest = new Test(4, 5);

myTest.reportData();

console.log(myTest.c); // достъпно е отвън

myTest.c = "broke this class"; // обаче някой може да го счупи

myTest.reportData(); // "с" вече е стринг и се чупи функцията


