"use client";

import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, logoutSuccess } from "@/store/slices/auth";
import { RootState } from "@/store/store";
import { FormikTextField } from "../inputs/FormikTextField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string(),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, token } = useSelector(
    (state: RootState) => state.auth,
  );

  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  useEffect(() => {
    // If the component mounts and we have a token, but haven't attempted login,
    // the Redux token is stale (cookie expired/missing, so middleware let us through).
    if (token && !hasAttemptedLogin) {
      dispatch(logoutSuccess());
    }
  }, [token, hasAttemptedLogin, dispatch]);

  useEffect(() => {
    if (token && hasAttemptedLogin) {
      router.push("/");
    }
  }, [token, hasAttemptedLogin, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setHasAttemptedLogin(true);
      dispatch(loginRequest(values));
    },
  });

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Login to MyConnect
      </h2>
      {error && (
        <div
          id="auth-login-error-alert"
          className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded"
        >
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
              isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </FormikProvider>
      <div className="mt-4 text-center">
        <Link
          href="/register"
          id="auth-login-register-link"
          className="text-sm text-blue-600 hover:underline"
        >
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
}
