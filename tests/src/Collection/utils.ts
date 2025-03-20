import {
	UnfreezableArray,
	UnfreezableString
} from "../../../dist/src/Collection/Buffer/classes.js"

import { ArrayCollection } from "../../../dist/src/Collection/classes.js"
import { isCollectionTest } from "./lib/utils.js"

// * isCollection

isCollectionTest(true, new ArrayCollection<any>([10, "s", false]))
isCollectionTest(true, new UnfreezableArray<any>(["a", "b", "c"]))
isCollectionTest(true, new UnfreezableString("Sesame"))

isCollectionTest(false, null)
isCollectionTest(false, "string")
isCollectionTest(false, { X: true })

isCollectionTest(true, { value: "S", push: function () {} })
isCollectionTest(false, { push: function () {} })
isCollectionTest(false, { value: "S" })
