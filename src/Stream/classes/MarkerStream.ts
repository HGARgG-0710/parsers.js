import type { IOwnedStream } from "../interfaces.js"
import type { IMarkerStream } from "../interfaces/MarkerStream.js"
import { WrapperStream } from "./WrapperStream.js"

export function MarkerStream<Type = any, MarkerType = any>(
	marker: (stream: IMarkerStream<Type, MarkerType>) => MarkerType
): new (resource?: IOwnedStream<Type>) => IMarkerStream<Type, MarkerType> {
	return class
		extends WrapperStream<Type>
		implements IMarkerStream<Type, MarkerType>
	{
		currMarked: MarkerType

		private updateMarker() {
			this.currMarked = marker(this)
		}

		next() {
			const curr = super.next()
			this.updateMarker()
			return curr
		}

		prev() {
			const curr = super.next()
			this.updateMarker()
			return curr
		}

		init(resource: IOwnedStream<Type>) {
			super.init(resource)
			this.updateMarker()
			return this
		}
	}
}
