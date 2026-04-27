import assert from "assert"
import {
	LineIndex,
	LineLengths,
	StringLineIndex
} from "../../../dist/src/classes/Position.js"
import { TestCounter } from "../lib.js"
import { stringLineIndexTest } from "./lib.js"

const stringLineIndexTestCounter = new TestCounter(
	([categoryCount]: number[]) => `BackupIndex(#${categoryCount})`
)

stringLineIndexTestCounter.test(
	[],
	() =>
		stringLineIndexTest.withInstance(
			new StringLineIndex().init(new LineLengths([1, 2, 3])),
			function (test) {
				test.copy(new LineIndex(4, 0))
				test.valueOf(1)

				test.nextChar()

				test.fromInvalid(new LineIndex(5, 1))
				test.fromInvalid(new LineIndex(0, 5))
				test.from(new LineIndex(0, 0))
				test.from(new LineIndex(1, 0))

				test.line(0)
				test.char(0)
			}
		),
	true
)

stringLineIndexTestCounter.test(
	[],
	() => {
		const lengths = new LineLengths([0, 2, 4, 8])
		const impureBackupIndex = new StringLineIndex(2, 2).init(lengths)
		stringLineIndexTest.withInstance(
			new StringLineIndex(4, 9).init(lengths),
			function (test) {
				impureBackupIndex.from(new LineIndex(4, 11))
				test.nextLine()
				assert.strictEqual(lengths.get(4), 11)

				test.from(new LineIndex(5, 0))
				test.line(4)
				test.char(9)

				test.valueOf(28)
			}
		)
	},
	true
)

stringLineIndexTestCounter.test(
	[],
	() => {
		const lengths = new LineLengths([0, 1, 3, 4])
		stringLineIndexTest.withInstance(
			new StringLineIndex(4, 0).init(lengths),
			function (test) {
				test.copy(new LineIndex(5, 1))
				test.nextLineTip(new LineIndex(5, 5))
				test.line(4)
				test.char(0)
				test.valueOf(13)
			}
		)
	},
	true
)

stringLineIndexTestCounter.test(
	[],
	() => {
		const lengths = new LineLengths([0, 8, 3, 4])
		stringLineIndexTest.withInstance(
			new StringLineIndex(2, 3).init(lengths),
			function (test) {
				test.from(new LineIndex(3, 3))
				test.nextCharEdge(lengths)
				test.valueOf(14)
			}
		)
	},
	true
)
