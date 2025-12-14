import { Pools } from "../../../../global.js"
import { mixin } from "../../../../mixin.js"
import { ObjectPool, Poolable } from "../../../../objects.js"
import { CurrDyssyncLinkedStream } from "../templates.js"
import { FiniteStream } from "./FiniteStream.js"

export const FlattenerStream = new mixin(
	{
		name: "FlattenerStream",
		static: {
			pool: (classObj) => Pools.Stream.add(new ObjectPool(classObj))
		},
		properties: {
			reviveDelegate() {
				this.delegate.init(...this.resource.curr)
				this.curr = this.delegate.curr
			},

			baseNextIter() {
				this.delegate.next()
				this.curr = this.delegate.curr
			},

			get isEnd() {
				return this.resource.isEnd && this.delegate.isEnd
			},

			get pool() {
				return this.constructor.pool
			},

			isCurrEnd() {
				return this.resource.isEnd && this.delegate.isCurrEnd()
			},

			next() {
				if (this.isEnd || this.isCurrEnd()) return
				if (this.delegate.isCurrEnd()) this.reviveDelegate()
				else this.baseNextIter()
			},

			baseInit() {
				this.reviveDelegate()
			}
		},
		constructor(resource) {
			this.delegate = new FiniteStream()
			this.super.CurrDyssyncLinkedStream.constructor.call(this, resource)
		}
	},
	[CurrDyssyncLinkedStream, Poolable]
).toClass()
