import {
	Initializable,
	ownerInitializer
} from "../../../classes/Initializer.js"
import type {
	IOwnedStream,
	IOwningStream,
	IResourceSettable,
	IStream
} from "../../../interfaces.js"

export abstract class IterableStream<Type = any, Args extends any[] = any[]>
	extends Initializable<Args>
	implements IStream<Type>
{
	abstract readonly isEnd: boolean
	abstract readonly isStart: boolean
	abstract readonly curr: Type

	abstract next(): void
	abstract isCurrEnd(): boolean
	abstract copy(): this

	*[Symbol.iterator]() {
		while (!this.isEnd) {
			yield this.curr
			this.next()
		}
	}

	constructor(...x: Partial<Args>) {
		super()
		this.init(...x)
	}
}

export abstract class OwnableStream<Type = any, Args extends any[] = any[]>
	extends IterableStream<Type, Args>
	implements IOwnedStream<Type>
{
	private _owner?: IOwningStream

	private set owner(newOwner: IOwningStream | undefined) {
		this._owner = newOwner
	}

	get owner() {
		return this._owner
	}

	setOwner(newOwner: IOwningStream): void {
		this.owner = newOwner
	}
}

export abstract class SolidStream<
	Type = any,
	Args extends any[] = any[]
> extends OwnableStream<Type, Args> {
	private _curr: Type
	private _isEnd: boolean = false
	private _isStart: boolean = true

	protected set curr(newCurr: Type) {
		this._curr = newCurr
	}

	get curr() {
		return this._curr
	}

	protected set isEnd(newIsEnd: boolean) {
		this._isEnd = newIsEnd
	}

	get isEnd() {
		return this._isEnd
	}

	protected set isStart(newIsStart: boolean) {
		this._isStart = newIsStart
	}

	get isStart() {
		return this._isStart
	}
}

export abstract class OwningStream<Type = any, Args extends any[] = []>
	extends OwnableStream<Type, [IOwnedStream<Type>, ...(Args | [])]>
	implements IResourceSettable
{
	private _resource?: IOwnedStream<Type>

	protected set resource(newResource: IOwnedStream<Type> | undefined) {
		this._resource = newResource
	}

	get resource() {
		return this._resource
	}

	protected get initializer() {
		return ownerInitializer
	}

	init(resource?: IOwnedStream<Type>, ...args: Partial<Args>): this {
		return super.init(resource, ...args)
	}

	setResource(newResource: IOwnedStream) {
		this.resource = newResource
	}
}
