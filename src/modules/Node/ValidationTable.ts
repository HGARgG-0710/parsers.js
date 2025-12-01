import { boolean } from "@hgargg-0710/one"
import type {
	ITyped,
	IValidationTable,
	IValidityMap,
	IValidNodeType
} from "../../interfaces.js"

const { T } = boolean

export class TreeValidationTable<T = any> implements IValidationTable<T> {
	validate(
		parentType: IValidNodeType,
		childType: IValidNodeType,
		x: T
	): boolean {
		const byParent = this.isValidMap.get(parentType)
		if (!byParent) return this.defaultValid(x)
		const byChild = byParent.get(childType)
		if (!byChild) return this.defaultValid(x)
		return byChild(x)
	}

	constructor(
		private readonly isValidMap: IValidityMap<T>,
		private readonly defaultValid: (x: T) => boolean = T
	) {}
}

export namespace TreeValidationTable {
	class ChildBuilder<T = any> {
		forAll(pred: (x: T) => boolean) {
			this.owner.forAllParents(this.type, pred)
			return this
		}

		for(parent: ITyped, pred: (x: T) => boolean) {
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
			private readonly owner: Builder<T>
		) {}
	}

	class ParentBuilder<T = any> {
		forAll(pred: (x: T) => boolean) {
			this.owner.forAllChildren(this.type, pred)
			return this
		}

		for(child: ITyped, pred: (x: T) => boolean) {
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
			private readonly owner: Builder<T>
		) {}
	}

	export class Builder<T = any> {
		private getParentMap(parentType: IValidNodeType) {
			let parentMap = this.isValidMap.get(parentType)
			if (!parentMap) {
				parentMap = new Map()
				this.isValidMap.set(parentType, parentMap)
			}
			return parentMap
		}

		private readonly isValidMap: IValidityMap<T> = new Map()

		protected targetInstance() {
			return new TreeValidationTable(this.isValidMap)
		}

		forChild(type: IValidNodeType) {
			return new ChildBuilder(type, this)
		}

		forParent(type: IValidNodeType) {
			return new ParentBuilder(type, this)
		}

		forOneParent(
			parentType: IValidNodeType,
			childType: IValidNodeType,
			pred: (x: T) => boolean
		) {
			this.getParentMap(parentType).set(childType, pred)
		}

		forAllChildren(parentType: IValidNodeType, pred: (x: T) => boolean) {
			const parentMap = this.getParentMap(parentType)
			for (const [childType] of parentMap) parentMap.set(childType, pred)
		}

		forAllParents(childType: IValidNodeType, pred: (x: T) => boolean) {
			for (const [, parentMap] of this.isValidMap)
				parentMap.set(childType, pred)
		}

		removeChildFor(parentType: IValidNodeType, childType: IValidNodeType) {
			this.getParentMap(parentType).delete(childType)
		}

		removeChild(type: IValidNodeType) {
			for (const [, parentMap] of this.isValidMap) parentMap.delete(type)
		}

		removeParent(type: IValidNodeType) {
			this.isValidMap.delete(type)
		}

		build() {
			return this.targetInstance()
		}

		constructor(types: readonly IValidNodeType[]) {
			for (const type of types) this.isValidMap.set(type, new Map())
		}
	}
}
