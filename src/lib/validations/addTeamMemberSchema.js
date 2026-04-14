import * as z from "zod";

export const addTeamMemberSchema = z.object({
    fullName:z.string().min(3, { message: "Full name must be at least 3 characters." }),
    email: z.string()
    .email({
      message: "Invalid email address",
    })
    .min(1, {
      message: "Email is required",
    }),
    roles : z.string().min(3, { message: "roles must be selected." }),
});
