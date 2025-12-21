import { boolean } from "@hgargg-0710/one"
import type {
	IStringPairs,
	ITreeMap,
	ITyped,
	IValidNodeType,
	IValidationTable,
	IValidityMap
} from "../../interfaces.js"

const { T } = boolean

export abstract class TreeTable<T = any, R = any> {
	hasType(typeName: IValidNodeType) {
		return this.types.has(typeName)
	}

	has(parentType: IValidNodeType, childType: IValidNodeType) {
		const parentMap = this.items.get(parentType)
		if (!parentMap) return false
		const childMap = parentMap.get(childType)
		if (!childMap) return false
		return true
	}

	get(parentType: IValidNodeType, childType: IValidNodeType) {
		return this.has(parentType, childType)
			? this.items.get(parentType)!.get(childType)!
			: this.defaultItem
	}

	constructor(
		private readonly types: Set<IValidNodeType>,
		protected readonly items: ITreeMap<T, R>,
		private readonly defaultItem: (x: T) => R
	) {}
}

export namespace TreeTable {
	class ChildBuilder<T = any, R = any> {
		forAll(pred: (x: T) => R) {
			this.owner.forAllParents(this.type, pred)
			return this
		}

		for(parent: ITyped, pred: (x: T) => R) {
			this.owner.forOneParent(parent.type, this.type, pred)
			return this
		}

		toDefaultFor(parent: ITyped) {
			this.owner.removeChildFor(parent.type, this.type)
			return this
		}

		erase() {
			this.owner.removeChild(this.type)
			return this
		}

		finish() {
			return this.owner
		}

		constructor(
			private readonly type: IValidNodeType,
			private readonly owner: BaseBuilder<T, R>
		) {}
	}

	class ParentBuilder<T = any, R = any> {
		forAll(pred: (x: T) => R) {
			this.owner.forAllChildren(this.type, pred)
			return this
		}

		for(child: ITyped, pred: (x: T) => R) {
			this.owner.forOneParent(this.type, child.type, pred)
		}

		toDefaultFor(child: ITyped) {
			this.owner.removeChildFor(this.type, child.type)
		}

		erase() {
			this.owner.removeParent(this.type)
		}

		finish() {
			return this.owner
		}

		constructor(
			private readonly type: IValidNodeType,
			private readonly owner: BaseBuilder<T>
		) {}
	}

	export abstract class BaseBuilder<T = any, R = any> {
		private getParentMap(parentType: IValidNodeType) {
			let parentMap = this.items.get(parentType)
			if (!parentMap) {
				parentMap = new Map()
				this.items.set(parentType, parentMap)
			}
			return parentMap
		}

		protected readonly types: Set<IValidNodeType>
		protected readonly items: ITreeMap<T, R> = new Map()

		abstract build(): TreeTable<T, R>

		forChild(child: ITyped) {
			return new ChildBuilder(child.type, this)
		}

		forParent(parent: ITyped) {
			return new ParentBuilder(parent.type, this)
		}

		forOneParent(
			parentType: IValidNodeType,
			childType: IValidNodeType,
			item: (x: T) => R
		) {
			this.getParentMap(parentType).set(childType, item)
		}

		forAllChildren(parentType: IValidNodeType, item: (x: T) => R) {
			const parentMap = this.getParentMap(parentType)
			for (const [childType] of parentMap) parentMap.set(childType, item)
		}

		forAllParents(childType: IValidNodeType, item: (x: T) => R) {
			for (const [, parentMap] of this.items)
				parentMap.set(childType, item)
		}

		removeChildFor(parentType: IValidNodeType, childType: IValidNodeType) {
			this.getParentMap(parentType).delete(childType)
		}

		removeChild(type: IValidNodeType) {
			for (const [, parentMap] of this.items) parentMap.delete(type)
		}

		removeParent(type: IValidNodeType) {
			this.items.delete(type)
		}

		constructor(types: readonly IValidNodeType[]) {
			for (const type of types) this.items.set(type, new Map())
			this.types = new Set(types)
		}
	}
}

export class TreeValidationTable<T = any>
	extends TreeTable<T, boolean>
	implements IValidationTable<T>
{
	private readonly isValidSingle: (x: T) => boolean

	validateSingle(item: T): boolean {
		return this.isValidSingle(item)
	}

	validate(
		parentType: IValidNodeType,
		childType: IValidNodeType,
		x: T
	): boolean {
		const isValid = this.get(parentType, childType)
		return isValid(x)
	}

	// ! pre-test: the 'isValidSingle' MUST have access to `this` [ensure that...]
	constructor({
		types,
		isValidMap,
		isValidSingle,
		defaultValid
	}: TreeValidationTable.Args) {
		super(types, isValidMap, defaultValid)
		this.isValidSingle = isValidSingle
	}
}

export namespace TreeValidationTable {
	export class Args<T = any> {
		constructor(
			readonly types: Set<IValidNodeType>,
			readonly isValidMap: IValidityMap<T>,
			readonly isValidSingle: (x: T) => boolean,
			readonly defaultValid: (x: T) => boolean
		) {}
	}

	export class Builder<T = any> extends TreeTable.BaseBuilder<T, boolean> {
		private defaultValid: (x: T) => boolean = T
		private isSingleValid: (x: T) => boolean = T

		withSingleValidator(isValid: (x: T) => boolean) {
			this.isSingleValid = isValid
			return this
		}

		withDefault(defaultValid: (x: T) => boolean) {
			this.defaultValid = defaultValid
			return this
		}

		build() {
			return new TreeValidationTable(
				new Args(
					this.types,
					this.items,
					this.isSingleValid,
					this.defaultValid
				)
			)
		}
	}
}

export class TreePairGenerationTable<T = any> extends TreeTable<
	T,
	IStringPairs
> {
	generate(parentType: IValidNodeType, childType: IValidNodeType) {
		if (!this.has(parentType, childType)) return false
		return this.get(parentType, childType)
	}

	constructor(types: Set<IValidNodeType>, items: ITreeMap<T, IStringPairs>) {
		super(types, items, () => [["", ""]])
	}
}

export namespace TreePairGenerationTable {
	export class Builder<T = any> extends TreeTable.BaseBuilder<
		T,
		IStringPairs
	> {
		build() {
			return new TreePairGenerationTable(this.types, this.items)
		}
	}
}
