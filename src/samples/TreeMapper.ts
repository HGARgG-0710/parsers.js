import { DepthStream, HandlerStream } from "../classes/Stream.js"
import type { IHandler, IPushable, IWalkable } from "../interfaces.js"
import { consume } from "../utils/Stream.js"

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
export function TreeMapper<In extends IWalkable<In> = IWalkable, Out = any>(
	map: IHandler<In, Out>,
	intoMaker: () => IPushable<Out>
) {
	const mapperStream = HandlerStream(map)
	return function (from: In) {
		const into = intoMaker()
		return consume(
			mapperStream(new (DepthStream.generic!<In>())(from)),
			into
		)
	}
}
