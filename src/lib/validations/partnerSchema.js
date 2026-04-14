import * as z from 'zod';

export const editPartnerSchema = z.object({
  partnerImage: z.custom().optional(),
  businessName: z
    .string()
    .min(2, { message: 'Business name must be at least 2 characters.' }),
  businessType: z.string({ message: 'business type must be selected' }),
  partnerEmail: z
    .string()
    .email({
      message: 'Invalid email address',
    })
    .min(1, {
      message: 'Email is required',
    }),
  contactPersonName: z.string().min(3, {
    message: "Contact person's name must be at least 3 characters.",
  }),
  contactPersonPhoneNumber: z
    .string()
    .min(1, { message: 'phone number is required' })
    .regex(/^(07|08|09)\d{9}$/, { message: 'Invalid phone number' }),
  country: z.string().min(1, { message: 'Country is required' }),
  businessAddress: z
    .string()
    .min(1, { message: 'Business Address is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
});
