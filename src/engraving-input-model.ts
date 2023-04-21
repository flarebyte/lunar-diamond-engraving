import { z } from 'zod';
import { stringy } from './field-validation.js';

export const engravingInputSchema = ({
  headers,
  payload,
}: {
  headers: z.AnyZodObject;
  payload: z.AnyZodObject;
}) =>
  z
    .object({
      name: stringy.customKey,
      headers,
      payload,
    })
    .strict();
