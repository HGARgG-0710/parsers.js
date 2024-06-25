import { skip, type ParserFunction } from "../../dist/src/parsers.js"
import { DynamicPredicateMap, InputStream, type Indexed } from "../../dist/src/types.js"
import { StreamLocator } from "../../dist/src/validate.js"

const locA = StreamLocator((input) => ["A", "B"].includes(input.curr()))
const locB = StreamLocator(
	DynamicPredicateMap(
		new Map([
			[(x: string) => x.charCodeAt(0) <= 102, () => false],
			[(x) => x.charCodeAt(0) >= 111, () => true]
		] as [Function, ParserFunction][]),
		() => false
	)
)

const streamA = InputStream("AtererereTBbAABAAAAAAAA" as unknown as Indexed<string>)
console.log(locA(streamA))
streamA.next()
console.log(locA(streamA))
streamA.next()
streamA.next()
console.log(locA(streamA))

const streamB = InputStream("ABABABABACCAAzzzionlnloC" as unknown as Indexed<string>)
console.log(locB(streamB))
streamB.next()
console.log(locB(streamB))
skip((input) => input.curr() !== "C")(streamB)
console.log(locB(streamB))
