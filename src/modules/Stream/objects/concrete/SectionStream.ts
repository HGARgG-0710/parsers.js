import { MissingArgument } from "../../../../constants.js"
import type { IIndexed, IPrototypeCollection } from "../../../../interfaces.js"
import { CollectionBuilder } from "../../../../objects.js"
import type { ISectionGrabber } from "../../interfaces/SectionStream.js"
import { CurrDyssyncLinkedStream } from "../templates.js"

export class SectionStream<
	T = any,
	C extends IIndexed<T> = IIndexed<T>
> extends CurrDyssyncLinkedStream<C> {
	private readonly builder: CollectionBuilder<T, C>

	private grabNewPiece() {
		this.builder.clear()
		this.grabber.grab(this.builder)
		return this.builder.get()
	}

	private getNextItem() {
		this.curr = this.grabNewPiece()
	}

	free(): void {}

	override baseInit(): void {
		this.grabber.init(this.resource || MissingArgument)
		this.getNextItem()
	}

	next(): void {
		this.getNextItem()
	}

	isCurrEnd(): boolean {
		return this.grabber.isLastSection()
	}

	get isEnd() {
		return this.resource!.isEnd || this.grabber.noMoreSections()
	}

	constructor(
		private readonly grabber: ISectionGrabber,
		protoCollection: IPrototypeCollection<T, C>
	) {
		super()
		this.builder = new CollectionBuilder(protoCollection)
	}
}
