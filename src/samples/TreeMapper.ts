import type {
	IBaseCollection,
	IHandler,
	IPushable,
	IWalkable
} from "../interfaces.js"
import { HandlerStream, TreeStream } from "../objects/Stream.js"
import { consume } from "../utils/Stream.js"

// ! pre-test: ENSURE that this thing WORKS with 'ArrayCollection', 'ArrayBuilder' and 'SourceBuilder'
/**
 * This is a function for creation of tree-mapping
 * operations, from the given AST-like type `In`
 * to an (arbitrary) output type `Out`.
 *
 * The result of the map (via the `map: IHandler<In, Out>`)
 * over the `new DepthStream(from)` is put through `consume`,
 * for the purpose of populating `into` (created each time via
 * `intoMaker`) with its values (or, more precisely - appending
 * them to the end of `into`, in case it is non-empty).
 *
 * This is particularly useful with `Out extends IWalkable`
 * types, which are also `IPushable<Out>`, and `intoMaker`
 * actually returns `Out` itself, in which case, one can
 * provide the given `TreeMapper` with a function-factory
 * for a container-like AST node of type `Out`. Thus,
 * one would be able to represent an AST of type `In`
 * with a new AST of type `Out` [an immensely powerful and
 * general capability, the usefulness of which is not
 * to be underestimated].
 */
export function TreeEvaluator<
	In extends IWalkable<In> = IWalkable,
	Out = any,
	CollectionType extends IPushable<Out> = IPushable<Out>
>(map: IHandler<In, Out>, intoMaker: () => CollectionType) {
	const mapperStream = HandlerStream(map)
	return function (from: In) {
		const into = intoMaker()
		return consume(mapperStream(new TreeStream<In>(from)), into)
	}
}

// ! pre-test: ENSURE that this thing WORKS with 'ArrayCollection', 'ArrayBuilder'
export function TreeMapper<
	In extends IWalkable<In> = IWalkable,
	Out extends IWalkable<Out> = IWalkable
>(
	map: IHandler<In, Out>,
	intoMaker: () => IBaseCollection<Out, readonly Out[]>,
	wrapperNode: (items: Out[]) => Out
) {
	const evaluator = TreeEvaluator(map, intoMaker)
	return function (from: In) {
		return wrapperNode(evaluator(from).get() as Out[])
	}
}
