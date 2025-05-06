import type { IOwnedStream } from "../interfaces.js"

// * Design:
// 1. make it a Configurator Pattern over a SEQUENCE of Stream-classes
// 		1. Works the same way as the `SingletonStream` [class + function for initialization, but NO singleton-instance (may need multiple of those)]: 
// 		2. STILL has a `resource` - the "underlying" 'Stream' to work on; 
// 			1. in practical settings INTENDED to be using the `InputStream/LazyStream`; 
// 2. the class ITSELF: 
// 		1. inherits from `GetterStream`
// 		2. keeps private variables: 
// 			1. `.composition: RecursiveList`: 
// 				1. this is a "recursive-linked-list"-like "array-like" data-structure supporting:
// 					1. "injecting" an array at position 'i'
// 						1. "replaces" IChooser at given position, + SAVES the last "chooser", to allow backing up (in case that athe Stream in question satisfies `.isEnd` - finished); 
// 						2. BACKS UP [calls a "chooser" again] *only* if one of the streams in the "intermediate" has finished; 
// 							1. Then: 
// 								1. "drill"s through the recursive-list LOOKING FOR the "reason"-Stream
// ! 							Problem [p.1]: 3 possible reasons - HOW to "restart" the composition???
// 									1. isCurrEnd() BECAUSE `.resource.isCurrEnd()` - need to replace `.resource()` [RESOURCE-reliant]
// 									2. SOLELY, because of its own limitations [Ex: `PredicateStream`, `LimitedStream`, `SingletonStream`, etc - SELF-RELIANT]
// ^ 							Solution[p.1]: provide a class-level property `readonly .isSelfEnding: boolean`; 
// !							Problem[p.2]: algorithm for restarting once finished + FINDING OUT the "faulty" Stream? 
// ^ 							Solution[p.2]: WALK from bottom-up (that is, from end to start), and do - for each of the cases:
// 									0. IF `.isEnd`:
// 										1. IF `.isSelfEnding`, roll-back to the underlying chooser OR, if none is present - `ComposedStream` IS FINISHED
// 											0. IF `ComposedStream` not finished - move on to the next one
// 											1. re-initialize the "higher" Stream-s via recursive `.init()` calls
// 												^ 1. CONCLUSION: Add `IComposableStream` - `IOwnedStream & .init(...)`; 
// 												  2. Only 'IComposableStream's would be allowed as one of the "...streams: ...[]" for the 'ComposedStream()' function; 
// 											2. walk on upwards
// 									1. ELSE: move on to the next one 
// 					2. RECURSION: 
//						1. Specifically, it allows CHANGING the IChooser-s in "sub-arrays" that are "injected": 
// 							1. Sub-arrays are "wrapped" on-adding [return values from 'IChooser's]
// 							2. Original 'IChooser's ARE KEPT INTACT
// 					3. ITERATION: 
// 						1. Specifically, the "nested" sub-arrays are "concatenated" into one when one is doing iteration. 
// 					4. MODIFICATION [big one]: 
// ! 					0. ADD LATER; [First prototype - without it...]; 
// 						1. For self-modification purposes (usable with DynamicParser, WHICH refernces + exposes the public interface for the thing)
// 					5. IT IS PRIVATE [in `internal`]; 
// *					1. ORDER-OF-CREATION: 
// 							1. 'IChooser's - place in..? [decide later, for now just in `DynamicComposition.ts`]
// 							2. 'DynamicComposition' - the "recursive-list"
// 							3. 'ComposedStream'
// 					6. EVALUATION [primary]: 
// 						1. This: 
// 							1. Calls the "Stream-Class"-chain; 
// 								1. WITH THE `firstResource` provided by the `.inputResource` [given with `.init` + constructor, NOT used for `.next()`] OF `ComposedStream`; 
// 							2. Creates the "underlying" `.resource` for `ComposedStream` [IS used for `.next()` calls]; 
// 3. On `.state` keeping: 
// 		1. This is part of the `DynamicParser`; Use util: 'attachState = (x: IStateful, state: Summat) => (x.state = state)'

class _ComposedStream<Type = any> {
	constructor(...streams: IOwnedStream<Type>[]) {}
}
