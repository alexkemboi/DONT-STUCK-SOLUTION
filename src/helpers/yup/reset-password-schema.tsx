import * as yup from "yup";

export const ResetPasswordSchema = yup.object().shape({
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(20, "Password must be at most 20 characters long")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords do not match")
        .required("Confirm Password is required"),
});