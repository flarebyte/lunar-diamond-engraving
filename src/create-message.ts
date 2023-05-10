import { EngravingMessage } from './api-model.js';

export const createMessage = (
  category: EngravingMessage['category'],
  message: string
): EngravingMessage => ({
  category,
  message,
});
