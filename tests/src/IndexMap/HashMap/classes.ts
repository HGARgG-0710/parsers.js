import { Pairs } from "../../../../dist/src/IndexMap/classes.js"
import {
	BasicHash,
	LengthHash,
	TokenHash,
	TypeofHash
} from "../../../../dist/src/IndexMap/HashMap/classes.js"

import {
	MapInternalHash,
	ObjectInternalHash
} from "../../../../dist/src/IndexMap/HashMap/InternalHash/classes.js"
import { TokenInstance } from "../../../../dist/src/Token/classes.js"

import { HashMapClassTest } from "./lib/classes.js"

// * BasicHash

const obj = {}

HashMapClassTest("BasicHash", BasicHash, [
	{
		input: new MapInternalHash(Pairs([obj, 10], [9, obj], ["C", true]), 90),
		indexTests: [
			[10, 90],
			[2, 90],
			[9, obj],
			["C", true],
			[obj, 9]
		],
		setTests: [
			[obj, 3],
			[3, 40],
			[40, false]
		],
		deleteTests: [9, "C"],
		replaceKeyTests: [
			[3, 20],
			[obj, function () {}]
		]
	}
])

// * LengthHash

HashMapClassTest("LengthHash", LengthHash, [
	{
		input: new MapInternalHash(
			new Map(Pairs([2, "Ra"], [3, "Set"], [7, "Bahamas"], [14, "Kinpu said hi!"])),
			"Length unset"
		),
		indexTests: [
			["Re", "Ra"],
			["ASM", "Set"],
			["Go", "Ra"],
			["Tethra", "Length unset"],
			["Lorien'", "Bahamas"],
			["Hoar", "Length unset"],
			["Bahamas", "Bahamas"],
			["DOSALOSROSGOLU", "Kinpu said hi!"]
		],
		setTests: [
			["I am a string!", "Burp"],
			["Newlen", "works"],
			["Quat", "re"]
		],
		deleteTests: ["De", "113"],
		replaceKeyTests: [
			["Sundown", "Soondo"],
			["Rock hit earth", "Sixlen"]
		]
	}
])

// * TokenHash

const [Anubis, Seth, Ra, Osiris] = ["anubis", "seth", "ra", "osiris"].map((name) =>
	TokenInstance(name)
)

HashMapClassTest("TokenHash", TokenHash, [
	{
		input: new ObjectInternalHash({
			seth: "disorder",
			anubis: "underworld",
			ra: "sun"
		}),
		indexTests: Pairs(
			[new Anubis(), "underworld"],
			[new Ra(), "sun"],
			[new Seth(), "disorder"]
		),
		setTests: [
			[new Seth(), "[missing entry]"],
			[Osiris, "ressurection"]
		],
		deleteTests: [new Seth(), new Osiris()],
		replaceKeyTests: [[Anubis, Ra]]
	}
])

// * TypeofHash

HashMapClassTest("TypeofHash", TypeofHash, [
	{
		input: new MapInternalHash(
			Pairs(["string", 10], ["number", 4], ["bigint", 11], ["boolean", 2]),
			-1
		),
		indexTests: [
			["ARG", 10],
			["Dale", 10],
			[5n, 11],
			[109098090123n, 11],
			[true, 2],
			[false, 2],
			[false, 2],
			[113, 4],
			[4, 4],
			[20, 4],
			[function () {}, -1]
		],
		setTests: [
			[function () {}, 7],
			[10, 5],
			[Symbol("???"), 9]
		],
		deleteTests: [true, 7n],
		replaceKeyTests: [
			[function () {}, "I am a string"],
			[Symbol.iterator, "string"]
		]
	}
])
