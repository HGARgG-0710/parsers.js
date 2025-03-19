import type {
	IFreezableBuffer,
	IUnfreezableBuffer
} from "../../../../../dist/src/Collection/Buffer/interfaces.js"

import {
	ClassConstructorTest,
	classTest,
	inputDescribe,
	method,
	methodTest,
	PropertyMethodTest,
	signatures
} from "lib/lib.js"

import {
	CollectionClassTest,
	CollectionPushTest,
	type CollectionClassTestSignature
} from "Collection/lib/classes.js"

import { isFreezableBuffer } from "../../../../../dist/src/Collection/Buffer/utils.js"

import assert from "assert"

const freezableBufferPrototypeProps = ["freeze", "read"]
const freezableBufferOwnProps = ["value"]

const unfreezableBufferPrototypeProps = freezableBufferPrototypeProps.concat([
	"unfreeze"
])
const unfreezableBufferOwnProps = freezableBufferOwnProps

const FreezableBufferConstructorTest = ClassConstructorTest(
	isFreezableBuffer,
	freezableBufferPrototypeProps,
	freezableBufferOwnProps
)

const UnfreezableBufferConstructorTest = ClassConstructorTest(
	isFreezableBuffer,
	unfreezableBufferPrototypeProps,
	unfreezableBufferOwnProps
)

const FreezableBufferFreezeTest =
	PropertyMethodTest("isFrozen")<IFreezableBuffer>("freeze")

const FreezableBufferReadTest = methodTest<IFreezableBuffer>("read")

function FreezableBufferPostFreezePushTest(
	instance: IFreezableBuffer,
	...input: any[]
) {
	method(`.push [.isFrozen] (${inputDescribe(input)})`, () => {
		const oldSize = instance.size
		instance.push(...input)
		assert.strictEqual(instance.size, oldSize)
	})
}

const UnfreezableBufferUnfreezeTest =
	PropertyMethodTest("isFrozen")<IFreezableBuffer>("unfreeze")

type FreezableBufferClassTestSignature<Type = any> = {
	readTests: [number, Type][]
} & CollectionClassTestSignature

function FreezableBufferClassTest<Type = any>(
	className: string,
	bufferConstructor: new (...input: any[]) => IFreezableBuffer<Type>,
	testSignatures: FreezableBufferClassTestSignature<Type>[]
) {
	CollectionClassTest(className, bufferConstructor, testSignatures)
	classTest(`(FreezableBuffer) ${className}`, () => {
		signatures(testSignatures, ({ input, readTests, pushed }) => () => {
			const bufferInstance = FreezableBufferConstructorTest(
				bufferConstructor,
				input
			)

			// .read
			for (const [index, value] of readTests)
				FreezableBufferReadTest(bufferInstance, value, index)

			// .freeze
			FreezableBufferFreezeTest(bufferInstance, true)

			// .push() post-.freeze()
			FreezableBufferPostFreezePushTest(bufferInstance, pushed)
		})
	})
}

type UnfreezableBufferClassTestSignatures<Type = any> =
	FreezableBufferClassTestSignature<Type>

export function UnfreezableBufferClassTest<Type = any>(
	className: string,
	bufferConstructor: new (...input: any[]) => IUnfreezableBuffer<Type>,
	testSignatures: UnfreezableBufferClassTestSignatures<Type>[]
) {
	FreezableBufferClassTest(className, bufferConstructor, testSignatures)
	classTest(`(UnfreezableBuffer) ${className}`, () => {
		signatures(
			testSignatures,
			({ input, pushed, expectedPushValue, pushCompare }) =>
				() => {
					const bufferInstance = UnfreezableBufferConstructorTest(
						bufferConstructor,
						input
					)

					// .freeze
					FreezableBufferFreezeTest(bufferInstance, true)

					// .unfreeze
					UnfreezableBufferUnfreezeTest(bufferInstance, false)

					// .push
					CollectionPushTest(
						bufferInstance,
						expectedPushValue,
						pushed,
						pushCompare
					)
				}
		)
	})
}
