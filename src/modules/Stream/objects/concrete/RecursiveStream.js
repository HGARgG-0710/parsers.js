import { Stateful } from "../../../../objects.js"
import { mixin } from "../../../mixin.js"
import { ProxyStream } from "../templates.js"
import { LimitStream } from "./LimitStream.js"

export function RecursiveProxyStream(depthMarks) {
	return new mixin(
		{
			name: "RecursiveProxyStream",
			properties: {
				init(resource) {
					this.depthMap = this.state.parse.getCurrDepthMap()
					this.super.ProxyStream.init.call(this, resource)
				},

				get depthMarks() {
					return depthMarks
				},

				getCurrDepthMap() {
					const map = new Map()
					for (const mark of this.depthMarks)
						map.set(mark, this.currGlobalDepthFor(mark))
					return map
				},

				currGlobalDepthFor(mark) {
					return this.state.parse.getDepth(mark)
				},

				isSameGlobalDepthFor(mark) {
					return (
						this.depthMap.get(mark) === this.getCurrDepthFor(mark)
					)
				}
			},
			constructor(delegate) {
				this.super.ProxyStream.constructor.call(this, delegate)
			}
		},
		[ProxyStream, Stateful]
	).toClass()
}

export class LimitDepthMarks {
	get() {
		return [this.mainMark, ...this.restMarks]
	}

	constructor(mainMark, restMarks = []) {
		this.mainMark = mainMark
		this.restMarks = restMarks
	}
}

export function RecursiveLimitStream(depthMarks, limits) {
	const { mainMark } = depthMarks

	const delegateStream = LimitStream(
		limits.wrapLongAs(
			(longAs) =>
				function (resource) {
					const proxyStream = this.owner
					return (
						!proxyStream.isSameGlobalDepthFor(mainMark) ||
						// * Explanation: one doesn't use `longAs.call(this, resource)`
						// because `longAs` is already bound to `this`
						longAs(resource)
					)
				}
		)
	)

	const recursiveProxyStream = RecursiveProxyStream(depthMarks.get())

	function R(resource) {
		return new recursiveProxyStream(delegateStream(resource))
	}

	return R
}
