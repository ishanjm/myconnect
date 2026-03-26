"use client";

import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "@/store/slices/auth";
import { RootState } from "@/store/store";
import { FormikTextField } from "../inputs/FormikTextField";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(5, "Password should be of minimum 5 characters length")
    .required("Password is required"),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(loginRequest(values));
    },
  });

  if (token) {
    return (
      <div id="auth-login-success-message" className="p-4 bg-green-100 text-green-700 rounded mb-4">
        Successfully logged in!
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Login to MyConnect</h2>
      {error && (
        <div id="auth-login-error-alert" className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      <FormikProvider value={formik}>
        <form id="auth-login-form" onSubmit={formik.handleSubmit} noValidate>
          <FormikTextField
            id="auth-login-email-input"
            name="email"
            label="Email Address"
            type="email"
            placeholder="your@email.com"
          />
          <FormikTextField
            id="auth-login-password-input"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
          />
          <button
            id="auth-login-submit-button"
            type="submit"
            disabled={isLoading}
            className={`w-full mt-4 p-2 text-white font-semibold rounded transition-colors ${
              isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </FormikProvider>
    </div>
  );
}
