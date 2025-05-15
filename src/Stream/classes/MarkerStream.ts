import type { IOwnedStream } from "../../interfaces/Stream.js"
import { maybeInit } from "../../utils.js"
import type { IMarkerStream } from "../interfaces/MarkerStream.js"
import { WrapperStream } from "./WrapperStream.js"

class _MarkerStream<Type = any, MarkerType = any>
	extends WrapperStream<Type>
	implements IMarkerStream<Type, MarkerType>
{
	private marker: () => MarkerType

	currMarked: MarkerType

	private updateMarker() {
		this.currMarked = this.marker()
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

	setMarker(marker: () => MarkerType) {
		this.marker = marker
		return this
	}
}

export function MarkerStream<Type = any, MarkerType = any>(
	marker: () => MarkerType
) {
	return function (
		resource?: IOwnedStream<Type>
	): IMarkerStream<Type, MarkerType> {
		return maybeInit(new _MarkerStream().setMarker(marker), resource)
	}
}
