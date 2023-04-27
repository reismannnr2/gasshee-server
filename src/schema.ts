import z from 'zod';

const baseDataSchema = z.object({
  type: z.string(),
  system: z.string(),
  id: z.string(),
  name: z.string(),
  user: z.string(),
  tags: z.array(z.string()),
  parole: z.optional(z.string()),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const plainDataSchema = baseDataSchema.extend({
  type: z.literal('plain'),
  password: z.optional(z.string()),
  content: z.unknown(),
});
export type PlainData = z.infer<typeof plainDataSchema>;
export const cipherDataSchema = baseDataSchema.extend({
  type: z.literal('cipher'),
  password: z.optional(z.string()),
  content: z.string(),
});
export type CipherData = z.infer<typeof cipherDataSchema>;

export const deleteDataSchema = z.object({
  id: z.string(),
  password: z.optional(z.string()),
});
export type DeleteData = z.infer<typeof deleteDataSchema>;

export const dataSchema = z.union([plainDataSchema, cipherDataSchema]);
export type Data = z.infer<typeof dataSchema>;

export const newPlainDataSchema = plainDataSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const newCipherDataSchema = cipherDataSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const newDataSchema = z.union([newPlainDataSchema, newCipherDataSchema]);
export type NewData = z.infer<typeof newDataSchema>;

export const updatePlainDataSchema = plainDataSchema.omit({ createdAt: true, updatedAt: true });
export const updateCipherDataSchema = cipherDataSchema.omit({ createdAt: true, updatedAt: true });
export const updateDataSchema = z.union([updatePlainDataSchema, updateCipherDataSchema]);
export type UpdateData = z.infer<typeof updateDataSchema>;

export const plainDataWithoutPassword = plainDataSchema.omit({ password: true });
export const cipherDataWithoutPassword = cipherDataSchema.omit({ password: true });
export const dataWithoutPassword = z.union([plainDataWithoutPassword, cipherDataWithoutPassword]);
export type DataWithoutPassword = z.infer<typeof dataWithoutPassword>;

export const plainDataForList = plainDataWithoutPassword.omit({ content: true });
export const cipherDataForList = cipherDataWithoutPassword.omit({ content: true });
export const dataForList = z.union([plainDataForList, cipherDataForList]);
export type DataForList = z.infer<typeof dataForList>;
