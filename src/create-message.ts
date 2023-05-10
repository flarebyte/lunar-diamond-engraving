import {type EngravingMessage} from './api-model.js';

/**
 * Create a message that can be used by some of the functions
 * @param category a custom category
 * @param message a message preferrably without sensitive or even personal information
 */
export const createEngravingMessage = (
	category: EngravingMessage['category'],
	message: string,
): EngravingMessage => ({
	category,
	message,
});
