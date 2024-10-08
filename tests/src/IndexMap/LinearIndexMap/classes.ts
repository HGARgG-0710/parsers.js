import { LinearMapClassTest } from "./lib/classes.js"
import {
	LinearBasicMap,
	LinearPredicateMap,
	LinearRegExpMap,
	LinearSetMap,
	OptimizedLinearMap
} from "../../../../dist/src/IndexMap/LinearIndexMap/classes.js"

// TODO: write test-particulars based off 'MapClassTest';
LinearMapClassTest("LinearPredicateMap", LinearPredicateMap, {})
LinearMapClassTest("LinearRegExpMap", LinearRegExpMap, {})
LinearMapClassTest("LinearSetMap", LinearSetMap, {})
LinearMapClassTest("LinearBasicMap", LinearBasicMap, {})
LinearMapClassTest("OptimizedLinearMap", OptimizedLinearMap, {})
