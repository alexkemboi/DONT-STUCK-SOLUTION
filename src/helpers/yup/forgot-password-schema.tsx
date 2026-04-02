import * as yup from "yup";

export const ForgotPasswordSchema = yup.object({
    email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
});