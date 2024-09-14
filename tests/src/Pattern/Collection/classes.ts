import { CollectionClassTest } from "./lib/classes.js"
import {
	StringCollection,
	ArrayCollection,
	AccumulatingTokenCollection
} from "../../../../dist/src/Pattern/Collection/classes.js"

CollectionClassTest("StringCollection", StringCollection, {})
CollectionClassTest("ArrayCollection", ArrayCollection, {})
CollectionClassTest("AccumulatingTokenCollection", AccumulatingTokenCollection, {})
