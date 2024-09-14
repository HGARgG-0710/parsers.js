import { MapClassTest } from "./lib/classes.js"
import {
	BasicMap,
	PredicateMap,
	RegExpMap,
	SetMap
} from "../../../dist/src/IndexMap/classes.js"

// TODO: write test-particulars based off 'MapClassTest';
MapClassTest("PredicateMap", PredicateMap, {})
MapClassTest("RegExpMap", RegExpMap, {})
MapClassTest("SetMap", SetMap, {})
MapClassTest("BasicMap", BasicMap, {})
