import { ChildrenTree } from "../../../dist/src/Tree/classes.js"
import { TreeClassTest, TreeTestSeveral } from "./lib/classes.js"

const childrenTree = ChildrenTree("children")
const valueTree = ChildrenTree("value")

// * ChilrenTree

const subTree1 = childrenTree({
	children: []
})

const subTree3 = childrenTree(["Over", "Soon", "Last?", "Bbbb"])

const subTree2 = childrenTree({
	children: ["Maer", 20, subTree3]
})

TreeClassTest("ChildrenTree", childrenTree, [
	{
		input: childrenTree({
			children: ["S", "Lael", subTree1, subTree2]
		}),
		indexTests: [
			[[0], "S"],
			[[1], "Lael"],
			[[2], subTree1],
			[[3], subTree2],
			[[3, 1], 20],
			[[3, 2], subTree3],
			[[3, 2, 2], "Last?"]
		],
		lastChildTests: [
			[[], 3],
			[[2], -1],
			[[3], 2],
			[[3, 2], 3]
		]
	}
])

const subTree4 = valueTree({ value: [20] })
const subTree6 = valueTree({ value: [5050, 4030, 90] })
const subTree5 = valueTree({ value: [subTree6, 9090] })

TreeClassTest("ChildrenTree", valueTree, [
	{
		input: valueTree([subTree6, subTree4, subTree4, subTree5, 6]),
		indexTests: [
			[[0, 2], 90],
			[[1, 0], 20],
			[[2], subTree4],
			[[3, 0], subTree6],
			[[3, 0, 0], 5050]
		],
		lastChildTests: [
			[[], 4],
			[[0], 2],
			[[1], 0],
			[[2], 0],
			[[3], 1]
		]
	}
])

// * ChlidlessTree, SingleTree, MultTree

TreeTestSeveral(
	[
		{
			propName: "children",
			childrenTrees: [
				childrenTree({ children: [20, "S"] }),
				childrenTree({ children: [] }),
				{}
			]
		},
		{
			propName: "value",
			childrenTrees: [
				childrenTree({ value: [20, "S"] }),
				childrenTree({ value: [] }),
				{}
			]
		}
	],
	[
		{
			propName: "children",
			childrenTrees: [{ value: 90 }, {}]
		},
		{
			propName: "children",
			childrenTrees: [{ value: [90, 20] }, { value: [100, 70] }],
			converter: (nums: number[]) =>
				nums.reduce((last, curr) => (last += curr ** 2), 0)
		},
		{ propName: "value", childrenTrees: [{ value: 90 }, {}] }
	],
	[
		{ propName: "children", childrenTrees: [{ value: ["Sa"] }] },
		{
			propName: "children",
			childrenTrees: [{ value: [90, 90, 20, 40] }, (x: number) => x + 3]
		},
		{ propName: "value", childrenTrees: [{ value: ["Sa"] }] }
	]
)
