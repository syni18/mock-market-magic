
import * as z from 'zod';

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const signUpSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const phoneSchema = z.object({
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
});

export const otpSchema = z.object({
  code: z.string().min(6, { message: "Please enter a valid verification code" }),
});
