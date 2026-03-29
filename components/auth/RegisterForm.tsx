"use client";

import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerRequest } from "@/store/slices/auth";
import { RootState } from "@/store/store";
import { FormikTextField } from "../inputs/FormikTextField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(5, "Password should be of minimum 5 characters length")
    .required("Password is required"),
});

export default function RegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(registerRequest(values));
    },
  });

  if (token) return null;

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Register for MyConnect</h2>
      {error && (
        <div id="auth-register-error-alert" className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      <FormikProvider value={formik}>
        <form id="auth-register-form" onSubmit={formik.handleSubmit} noValidate>
          <FormikTextField
            id="auth-register-name-input"
            name="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
          />
          <FormikTextField
            id="auth-register-email-input"
            name="email"
            label="Email Address"
            type="email"
            placeholder="your@email.com"
          />
          <FormikTextField
            id="auth-register-password-input"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
          />
          <button
            id="auth-register-submit-button"
            type="submit"
            disabled={isLoading}
            className={`w-full mt-4 p-2 text-white font-semibold rounded transition-colors ${
              isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </FormikProvider>
      <div className="mt-4 text-center">
        <Link href="/login" id="auth-register-login-link" className="text-sm text-blue-600 hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}
