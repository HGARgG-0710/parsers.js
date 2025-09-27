import { Pools } from "../../../../main.js"
import { ObjectPool } from "../../../classes/ObjectPool.js"
import { mixin } from "../../../mixin.js"
import { PipeStream } from "./PipeStream.js"
import { PoolableStream } from "./PoolableStream.js"
import { SyncStream } from "./SyncStream.js"

export const IdentityStream = new mixin(
	{
		name: "IdentityStream",
		static: {
			pool: (classObj) => Pools.Stream.add(new ObjectPool(classObj))
		},
		properties: {
			get pool() {
				return this.class.pool
			}
		},
		constructor(resource) {
			this.super.PipeStream.constructor.call(this, resource)
		}
	},
	[PipeStream, SyncStream, PoolableStream]
).toClass()
