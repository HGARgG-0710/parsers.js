import { mixin } from "../../../mixin.js"
import { LimitStream } from "./LimitStream.js"
import { ProxyStream } from "./ProxyStream.js"
import { StatefulStream } from "./StatefulStream.js"

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
		[ProxyStream, StatefulStream]
	).toClass()
}

export class LimitDepthMarks {
	get() {
		return [this.mainMark, ...this.restMarks]
	}

	constructor(mainMark, restMarks) {
		this.mainMark = mainMark
		this.restMarks = restMarks
	}
}

export function RecursiveLimitStream(depthMarks, from, longAs) {
	;[from, longAs] = LimitStream.ensureLimitsPair(from, longAs)
	const { mainMark } = depthMarks
	
	const delegateStream = LimitStream(from, function (resource) {
		const proxyStream = this.owner
		return (
			!proxyStream.isSameGlobalDepthFor(mainMark) ||
			longAs.call(this, resource)
		)
	})

	const recursiveProxyStream = RecursiveProxyStream(depthMarks.get())

	function R(resource) {
		return new recursiveProxyStream(delegateStream(resource))
	}

	return R
}
