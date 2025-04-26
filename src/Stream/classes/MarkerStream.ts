import type { IOwnedStream } from "../interfaces.js"
import type { IMarkerStream } from "../interfaces/MarkerStream.js"
import { WrapperStream } from "./WrapperStream.js"

export function MarkerStream<Type = any, MarkerType = any>(
	marker: (stream: IMarkerStream<Type, MarkerType>) => MarkerType
): new () => IMarkerStream<Type> {
	return class
		extends WrapperStream<Type>
		implements IMarkerStream<Type, MarkerType>
	{
		currMarked: MarkerType

		private getMarker() {
			this.currMarked = marker(this)
		}

		next() {
			const curr = super.next()
			this.getMarker()
			return curr
		}

		prev() {
			const curr = super.next()
			this.getMarker()
			return curr
		}

		init(resource: IOwnedStream<Type>) {
			super.init(resource)
			this.getMarker()
			return this
		}
	}
}
