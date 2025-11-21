import type { IDebugNamed } from "./Debug.js"
import type { INode, IValidNodeType } from "./Node.js"

export type IXMLAttributeGenerator = (node: INode) => [string, string][]

export type IXMLAttrMapValue = false | IXMLAttributeGenerator

export type IXMLAttrMap = Map<
	IValidNodeType,
	Map<IValidNodeType, IXMLAttrMapValue>
>

export type IXMLTagMap = Map<IValidNodeType, Set<IValidNodeType>>

export interface IXMLGenerationTable {
	toAttr(
		parentType: IValidNodeType,
		childType: IValidNodeType
	): false | IXMLAttributeGenerator
	isTag(parentType: IValidNodeType, childType: IValidNodeType): boolean
}

export interface IXMLAttrTable {
	get(
		parentType: IValidNodeType,
		childType: IValidNodeType
	): false | IXMLAttributeGenerator
}

export interface IXMLTagTable {
	get(parentType: IValidNodeType, childType: IValidNodeType): boolean
}

export interface IXMLSerializable {
	toXML?(table: IXMLGenerationTable): string[]
}

export type IXMLDebuggable = IXMLSerializable & IDebugNamed

export interface IXMLSimple {
	toXML(): string[]
}

export type IXMLVersion = "1.0" | "1.1"

export interface IXMLOpenableNode {
	pre(): string[]
	tag(): [string, string]
	post(): string[]
}
