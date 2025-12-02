import { Pools } from "../../../../global.js"
import type {
	ICommonStream,
	IDepthMark,
	IDepthMarkStream,
	IOwnedStream
} from "../../../../interfaces.js"
import { ObjectPool } from "../../../../objects.js"
import { IdentityStream } from "./IdentityStream.js"

type IDepthMarkStreamForPool<T = any> = IDepthMarkStream<T> &
	ICommonStream<T> &
	IdentityStream<T>

function BuildDepthMarkStream<T = any>(marks: readonly IDepthMark[]) {
	return class DepthMarkStream
		extends IdentityStream<T>
		implements IDepthMarkStream<T>
	{
		static readonly pool = Pools.Stream.add(
			new ObjectPool<IDepthMarkStreamForPool<T>>(DepthMarkStream)
		)

		get depthMarks() {
			return marks
		}
	}
}

export function DepthMarkStream<T = any>(marks: readonly IDepthMark[]) {
	const _DepthMarkStream = BuildDepthMarkStream(marks)

	function D(
		resource?: IOwnedStream<T>
	): IDepthMarkStream<T> & ICommonStream<T> {
		return _DepthMarkStream.pool.create(resource)
	}

	D.pool = _DepthMarkStream.pool

	return D
}
