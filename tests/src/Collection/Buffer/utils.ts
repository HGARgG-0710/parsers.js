import {
	UnfreezableArray,
	UnfreezableString
} from "../../../../dist/src/Collection/Buffer/classes.js"
import { isBufferizedTest } from "./lib/utils.js"

// * isBufferized

isBufferizedTest(true, { buffer: new UnfreezableArray([true, false, true]) })
isBufferizedTest(true, { buffer: new UnfreezableString("Rudolph, Martin, Montgomery") })

isBufferizedTest(false, { V: new UnfreezableString("Rudolph, Martin, Montgomery") })
isBufferizedTest(false, { V: true })

isBufferizedTest(false, null)
