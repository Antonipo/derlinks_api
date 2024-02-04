import {z} from 'zod';

export const linkSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim(),
  url: z
    .string({
      required_error: "Email is required",
    })
    .url({
        message: "Invalid url",
    }).trim(),
  group_id: z.number(),
});

export const groupSchema = z.object({
  group_name: z
    .string({
      required_error: "Name is required",
    }).trim(),
});