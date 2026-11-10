import { differenceInYears } from "date-fns";
import z from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().trim().min(2, "Name Is Required").max(20, "Max Chars are 20"),
    username: z.string().trim().min(2, "username Is Required").max(20, "Max Chars are 20"),
    email: z.string().trim().min(2, "Email Is Required").email("Invalid email address"),
    dateOfBirth: z
      .string()
      .min(1, "DOB Is Required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
      .refine((value) => {
        const [y, m, d] = value.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
      }, "Invalid date")
      .refine((value) => new Date(value) <= new Date(), "Not In the future !")
      .refine((value) => differenceInYears(new Date(), new Date(value)) >= 16, "at least 16YO"),
    gender: z.enum(["male", "female"]),
    password: z
      .string()
      .min(1, "Password Is Required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "minimum of 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character.",
      ),
    rePassword: z.string().min(1, "rePassword Is Required"),
  })
  .refine((formvalues) => formvalues.rePassword === formvalues.password, {
    path: ["rePassword"],
    message: "repassword not match password",
  });

export const LoginSchema = z.object({
  email: z.string().trim().min(2, "Email Is Required").email("Invalid email address"),
  password: z.string().min(2, "Password Is Required"),
});

export const ChangePasswordSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "minimum of 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character.",
      ),
    rePassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((formValues) => formValues.newPassword === formValues.rePassword, {
    path: ["rePassword"],
    message: "Passwords don't match",
  });

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export type LoginFormData = z.infer<typeof LoginSchema>;

export type RegisterFormData = z.infer<typeof RegisterSchema>;
