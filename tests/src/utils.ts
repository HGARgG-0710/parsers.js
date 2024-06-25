import { delimited, skip, read, eliminate, nested } from "../../dist/src/parsers.js"
import { InputStream, StringPattern } from "../../dist/src/types.js"
import type { Concattable, Indexed } from "../../dist/src/types.js"

// * 'delimited'
const readString = InputStream("KaaaaarTAAAAAAa" as unknown as Indexed<string>)
const testRead = read((input) => input.curr().charCodeAt(0) <= 97)
console.log(testRead(readString, "READ: " as unknown as Concattable<string>))
console.log(readString.next())
console.log(readString.isEnd())
console.log(testRead(readString, "READ: " as unknown as Concattable<string>))
console.log(readString.isEnd())

const delimString = "SKAR,Rag;LUFF;MURR\nTORK\n;DORK;SIEG"
const delimTest = InputStream(delimString as unknown as Indexed<string>)
console.log(
	delimited(
		[(input, i) => input.curr() !== "M", (input, i) => input.curr() !== "D"],
		(input, i) => {
			console.log("Inside 'isdelim'!")
			console.log(input.curr())
			console.log(i)
			console.log()
			return [",", ";", "\n"].includes(input.curr())
		}
	)(delimTest, (input, i) => {
		console.log("Inside 'handler'!")
		console.log(input.curr())
		console.log(i)
		console.log()
		return [input.curr()]
	})
)
console.log(delimTest.curr())

// * 'skip'
const skipString = "LAR012340124015016a97a27a54a99K"
const skipTest = InputStream(skipString as unknown as Indexed<string>)
console.log(skipString)
console.log(skip(4)(skipTest))
console.log(skipTest.curr())
console.log(skip((input, i) => input.curr().charCodeAt(0) < 97)(skipTest))
console.log(skipTest.curr())
console.log(skip((input, i) => input.curr().charCodeAt(0) <= 97)(skipTest))
console.log(skipTest.isEnd())

console.log()

// * 'eliminate'
console.log(
	eliminate(["K", /x|y/g, "SIEGBRAU!"])(
		StringPattern("17171KKxyKyKxKKxKKLOGOGOGOSIEGBRAU!")
	)
)
console.log()

// * 'nested'
const nestedTest = InputStream(
	"SIEGBRAU(ROMELROMELROMELRUMMMM) CRABCRABCRABCRAB!) 'A refrigerator has arrived' is a powerfully sounding sentence." as unknown as Indexed<string>
)
console.log(
	nested(
		(input) => input.curr() === "(",
		(input) => input.curr() === ")"
	)(nestedTest)
)
