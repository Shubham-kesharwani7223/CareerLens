import { z } from "zod";

// Login validation
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

// Registration validation
export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be less than 100 characters"),

    confirmPassword: z.string(),

    role: z.enum([
      "fresher",
      "developer",
      "software_engineer",
      "ai_engineer",
      "ai_ml_engineer",
      "other",
    ]),

    customRole: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "other") {
        return (
          typeof data.customRole === "string" &&
          data.customRole.trim().length >= 2 &&
          data.customRole.trim().length <= 50
        );
      }

      return true;
    },
    {
      message: "Please specify your role (2–50 characters)",
      path: ["customRole"],
    },
  );
