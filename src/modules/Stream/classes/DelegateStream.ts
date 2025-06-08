import type { IResourcefulStream } from "../../../interfaces.js"
import { mixin } from "../../../mixin.js"
import { OwningStream, OwningStreamAnnotation } from "./OwningStream.js"

export abstract class DelegateStreamAnnotation<T = any, Args extends any[] = []>
	extends OwningStreamAnnotation<T, Args>
	implements IResourcefulStream<T>
{
	next(): void {}
	prev(): void {}

	isCurrEnd(): boolean {
		return false
	}

	isCurrStart(): boolean {
		return true
	}
}

const DelegateStreamMixin = new mixin<IResourcefulStream>(
	{
		name: "DelegateStream",
		properties: {
			prev() {
				this.resource.prev!()
			},

			next() {
				this.resource.next()
			},

			isCurrStart() {
				return this.resource.isCurrStart!()
			},

			isCurrEnd() {
				return this.resource.isCurrEnd()
			}
		}
	},
	[],
	[OwningStream]
)

function PreDelegateStream<T = any, Args extends any[] = any[]>() {
	return DelegateStreamMixin.toClass() as typeof DelegateStreamAnnotation<
		T,
		Args
	>
}

export const DelegateStream: ReturnType<typeof PreDelegateStream> & {
	generics?: typeof PreDelegateStream
} = PreDelegateStream()

DelegateStream.generics = PreDelegateStream
