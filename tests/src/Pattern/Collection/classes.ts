import { CollectionClassTest } from "./lib/classes.js"
import {
	StringCollection,
	ArrayCollection,
	AccumulatingPatternCollection
} from "../../../../dist/src/Pattern/Collection/classes.js"

CollectionClassTest("StringCollection", StringCollection, {})
CollectionClassTest("ArrayCollection", ArrayCollection, {})
CollectionClassTest("AccumulatingPatternCollection", AccumulatingPatternCollection, {})
