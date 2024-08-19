import {
	StringCollection,
	ArrayCollection,
	AccumulatingTokenCollection
} from "../../../dist/src/types/Collection.js"

const sct = StringCollection("SASREAOIL")
console.log(sct)
console.log(sct.push("BABBABABAB"))
console.log(sct.push("ARAERE", "MOMOOMORREO", "And a third and athir anarit"))
console.log(...sct)
console.log()

const arr = [0, 1, 3, "bub"]
const act = ArrayCollection(arr)
console.log(act)
act.push(998)
console.log(arr)
act.push(55313, 10983402, "bobobobo")
console.log(...act)
console.log(act)
console.log()

const atct = AccumulatingTokenCollection({ type: "Mar", value: "k" })
console.log(atct)
console.log(...atct)
atct.push(
	...["i", "l", "i", "b", "r", "i", "n", "booo", "r"].map((x) => ({
		type: "other",
		value: x
	}))
)
console.log(atct)
console.log(...atct)
