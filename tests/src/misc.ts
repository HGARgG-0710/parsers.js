import { misc } from "../../dist/main.js"

const { isHex, predicateChoice } = misc
console.log(isHex("8"))
console.log(isHex("f"))
console.log(isHex("F"))
console.log(isHex("h"))
console.log(isHex("08890AFEC231"))
console.log(isHex("7711K"))
console.log(isHex(""))

console.log(predicateChoice(3).toString())
console.log(predicateChoice((x: any) => x).toString())
