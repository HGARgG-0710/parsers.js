import { Pools } from "../../../../main.js"
import { ObjectPool } from "../../../classes/ObjectPool.js"
import { mixin } from "../../../mixin.js"
import { AttachedStream } from "./AttachedStream.js"
import { PoolableStream } from "./PoolableStream.js"
import { ResourceCopyingStream } from "./ResourceCopyingStream.js"

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
			this.super.AttachedStream.constructor.call(this, resource)
		}
	},
	[AttachedStream, PoolableStream, ResourceCopyingStream]
).toClass()
