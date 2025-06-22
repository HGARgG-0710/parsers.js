import assert from "assert"
import {
	BackupIndex,
	LineIndex,
	LineLengths
} from "../../../dist/src/classes/Position.js"
import { TestCounter } from "../lib.js"
import { backupIndexTest } from "./lib.js"

const backupIndexTestCounter = new TestCounter(
	([categoryCount]: number[]) => `BackupIndex(#${categoryCount})`
)

backupIndexTestCounter.test(
	[],
	() =>
		backupIndexTest.withInstance(
			new BackupIndex().init(new LineLengths([1, 2, 3])),
			function (test) {
				test.copy(new LineIndex(4, 0))
				test.toNumber(1)

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

backupIndexTestCounter.test(
	[],
	() => {
		const lengths = new LineLengths([0, 2, 4, 8])
		const impureBackupIndex = new BackupIndex(2, 2).init(lengths)
		backupIndexTest.withInstance(
			new BackupIndex(4, 9).init(lengths),
			function (test) {
				impureBackupIndex.from(new LineIndex(4, 11))
				test.nextLine()
				assert.strictEqual(lengths.get(4), 11)

				test.prevCharDefault()
				test.from(new LineIndex(5, 0))
				test.line(4)
				test.char(9)

				test.toNumber(28)
			}
		)
	},
	true
)

backupIndexTestCounter.test(
	[],
	() => {
		const lengths = new LineLengths([0, 1, 3, 4])
		backupIndexTest.withInstance(
			new BackupIndex(4, 0).init(lengths),
			function (test) {
				test.copy(new LineIndex(5, 1))
				test.nextLineTip(new LineIndex(5, 5))
				test.line(4)
				test.char(0)
				test.prevCharStart(3, 4)
				test.toNumber(13)
			}
		)
	},
	true
)

backupIndexTestCounter.test(
	[],
	() => {
		const lengths = new LineLengths([0, 8, 3, 4])
		backupIndexTest.withInstance(
			new BackupIndex(2, 3).init(lengths),
			function (test) {
				test.from(new LineIndex(3, 3))
				test.nextCharEdge(lengths)
				test.toNumber(14)
			}
		)
	},
	true
)
