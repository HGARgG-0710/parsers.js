import { CollectionClassTest } from "./lib/classes.js"
import { ArrayCollection } from "../../../dist/src/Collection/classes.js"
import { arraysSame } from "lib/lib.js"

// * ArrayCollection

const arrayTestEndvalue = new Array(14).fill(0).map((_x, i) => i)

CollectionClassTest(
	"ArrayCollection",
	ArrayCollection,
	[
		{
			input: [1, 2, 3, 4],
			pushed: arrayTestEndvalue.slice(3),
			expectedPushValue: arrayTestEndvalue,
			pushCompare: arraysSame,
			iteratedOver: arrayTestEndvalue
		}
	],
	true
)
