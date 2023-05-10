import {
	type EngravingMask,
	type EngravingActionResult,
	type EngravingOnFinishResult,
	type EngravingValidationError,
	type EngravingValidationTarget,
} from './api-model.js';
import {createEngravingMessage} from './create-message.js';

export const createActionError = ({
	name,
	mask,
	durationMagnitude,
	message,
}: {
	name: string;
	mask: EngravingMask;
	durationMagnitude: number;
	message: string;
}): EngravingActionResult => ({
	txId: mask.txId,
	engraving: mask.name,
	durationMagnitude,
	action: name,
	metadata: {},
	messages: [createEngravingMessage('framework', message)],
});

export const createFinishError = ({
	mask,
	message,
	durationMagnitude,
}: {
	mask: EngravingMask;
	durationMagnitude: number;
	message: string;
}): EngravingOnFinishResult => ({
	txId: mask.txId,
	engraving: mask.name,
	durationMagnitude,
	metadata: {},
	messages: [createEngravingMessage('framework', message)],
});

export const createValidationError = ({
	target,
	mask,
	durationMagnitude,
	message,
	exitOnFailure,
}: {
	target: EngravingValidationTarget;
	mask: EngravingMask;
	durationMagnitude: number;
	message: string;
	exitOnFailure: boolean;
}): EngravingValidationError => ({
	txId: mask.txId,
	engraving: mask.name,
	target,
	durationMagnitude,
	metadata: {},
	messages: [createEngravingMessage('framework', message)],
	exitOnFailure,
});
