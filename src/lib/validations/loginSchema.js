import * as z from "zod";

export const emailPasswordSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .min(1, {
      message: "Email is required",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one Uppercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    }),
});

export const forgotpasswordSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .min(1, {
      message: "Email is required",
    }),
});

export const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one Uppercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      }),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one Uppercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    profileAvatar: z.custom().optional(),
    // verificationCode: z.string().optional(),
  })

  .refine(
    (data) => {
      if (data.currentPassword) {
        return (
          data.currentPassword.length >= 8 &&
          /[A-Z]/.test(data.currentPassword) &&
          /[0-9]/.test(data.currentPassword)
        );
      }
      return true;
    },
    {
      message:
        'Current password must be at least 8 characters long, contain at least one uppercase letter and one number',
      path: ['currentPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword) {
        return (
          data.newPassword.length >= 8 &&
          /[A-Z]/.test(data.newPassword) &&
          /[0-9]/.test(data.newPassword)
        );
      }
      return true;
    },
    {
      message:
        'New password must be at least 8 characters long, contain at least one uppercase letter and one number',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.confirmPassword) {
        return (
          data.confirmPassword.length >= 8 &&
          /[A-Z]/.test(data.confirmPassword) &&
          /[0-9]/.test(data.confirmPassword)
        );
      }
      return true;
    },
    {
      message:
        'Confirm password must be at least 8 characters long, contain at least one uppercase letter and one number',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.verificationCode) {
        return /^\d{6}$/.test(data.verificationCode);
      }
      return true;
    },
    {
      message: 'Verification code must be a 6-digit number',
      path: ['verificationCode'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.currentPassword) {
        return data.newPassword !== data.currentPassword;
      }
      return true;
    },
    {
      message: 'New password must be different from the current password',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    }
  );

export const twoFASchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must be numeric'),
});