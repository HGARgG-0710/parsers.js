import type { IOwnedStream } from "../../../interfaces/Stream.js"
import type { IMarkerStream } from "../interfaces/MarkerStream.js"
import { WrapperStream, WrapperStreamAnnotation } from "./WrapperStream.js"

class MarkerStreamAnnotation<
	T = any,
	Marker = any
> extends WrapperStreamAnnotation<T> {
	get currMarker(): Marker {
		return null as Marker
	}

	setMarker(marker: () => Marker): this {
		return this
	}
}

function BuildMarkerStream<T = any, Marker = any>() {
	return class
		extends WrapperStream.generic!<T, []>()
		implements IMarkerStream<T, Marker>
	{
		private marker: () => Marker

		private _currMarker: Marker

		private set currMarker(newCurrMarked: Marker) {
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

		setMarker(marker: () => Marker) {
			this.marker = marker
			return this
		}

		copy() {
			return new this.constructor()
				.setMarker(this.marker)
				.init(this.resource)
		}
	} as unknown as typeof MarkerStreamAnnotation<T, Marker>
}

let markerStream: typeof MarkerStreamAnnotation | null = null

function PreMarkerStream<
	T = any,
	Marker = any
>(): typeof MarkerStreamAnnotation<T, Marker> {
	return markerStream
		? markerStream
		: (markerStream = BuildMarkerStream<
				T,
				Marker
		  >() as typeof MarkerStreamAnnotation)
}

export function MarkerStream<T = any, Marker = any>(marker: () => Marker) {
	const markerStream = PreMarkerStream<T, Marker>()
	return function (resource?: IOwnedStream<T>): IMarkerStream<T, Marker> {
		return new markerStream().setMarker(marker).init(resource)
	}
}
