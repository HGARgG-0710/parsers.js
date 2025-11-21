import type { IDebugNamed } from "./Debug.js"
import type { INode, IValidNodeType } from "./Node.js"

export type IAttributeGenerator = (node: INode) => [string, string][]

export interface IXMLAttrTable {
	get(
		parentType: IValidNodeType,
		childType: IValidNodeType
	): false | IAttributeGenerator
}

export interface IXMLTagTable {
	get(parentType: IValidNodeType, childType: IValidNodeType): boolean
}

export interface IXMLSerializable {
	toXML?(attrs: IXMLAttrTable, tags: IXMLTagTable): string
}

export type IXMLDebuggable = IXMLSerializable & IDebugNamed

export interface IXMLSimple {
	toXML(): string
}

export type IXMLVersion = "1.0" | "1.1"

export interface IXMLOpenableNode {
	pre(): string[]
	tag(): [string, string]
	post(): string[]
}
