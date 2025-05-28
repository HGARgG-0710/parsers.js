import type { IOwnedStream } from "../../../interfaces/Stream.js"
import type { IMarkerStream } from "../interfaces/MarkerStream.js"
import { WrapperStream } from "./WrapperStream.js"

class _MarkerStream<Type = any, MarkerType = any>
	extends WrapperStream<Type, []>
	implements IMarkerStream<Type, MarkerType>
{
	private marker: () => MarkerType

	private _currMarker: MarkerType

	private set currMarker(newCurrMarked: MarkerType) {
		this._currMarker = newCurrMarked
	}

	get currMarker() {
		return this._currMarker
	}

	private updateMarker() {
		this.currMarker = this.marker()
	}

	setResource(newResource: IOwnedStream): void {
		super.setResource(newResource)
		this.updateMarker()
	}

	next() {
		super.next()
		this.updateMarker()
	}

	prev() {
		super.prev()
		this.updateMarker()
	}

	setMarker(marker: () => MarkerType) {
		this.marker = marker
		return this
	}

	copy() {
		return new this.constructor().setMarker(this.marker).init(this.resource)
	}
}

export function MarkerStream<Type = any, MarkerType = any>(
	marker: () => MarkerType
) {
	return function (
		resource?: IOwnedStream<Type>
	): IMarkerStream<Type, MarkerType> {
		return new _MarkerStream().setMarker(marker).init(resource)
	}
}
