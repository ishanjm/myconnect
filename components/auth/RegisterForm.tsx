"use client";

import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerRequest } from "@/store/slices/auth";
import { RootState } from "@/store/store";
import { FormikTextField } from "../inputs/FormikTextField";
import { FormikSelect } from "../inputs/FormikSelect";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { SUBSCRIPTION_OPTIONS } from "@/common/auth.constants";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required"),
  lastName: Yup.string()
    .required("Last name is required"),
  subscription: Yup.string()
    .oneOf(SUBSCRIPTION_OPTIONS.map(o => o.value), 'Invalid subscription')
    .required("Subscription is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(5, "Password should be of minimum 5 characters length")
    .required("Password is required"),
  address: Yup.string(),
  mobileNumber: Yup.string(),
  profileImage: Yup.string(),
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
      firstName: "",
      lastName: "",
      subscription: "" as any,
      email: "",
      password: "",
      address: "",
      mobileNumber: "",
      profileImage: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      dispatch(registerRequest(formData as any));
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("profileImage", file);
    }
  };

  if (token) return null;

  return (
    <div className="w-full max-w-2xl p-8 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Register for MyConnect</h2>
      {error && (
        <div id="auth-register-error-alert" className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      <FormikProvider value={formik}>
        <form id="auth-register-form" onSubmit={formik.handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormikTextField
              id="auth-register-firstname-input"
              name="firstName"
              label="First Name"
              type="text"
              placeholder="John"
            />
            <FormikTextField
              id="auth-register-lastname-input"
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Doe"
            />
          </div>

          <FormikSelect
            id="auth-register-subscription-select"
            name="subscription"
            label="Subscription Plan"
            options={SUBSCRIPTION_OPTIONS as any}
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

          <FormikTextField
            id="auth-register-mobile-input"
            name="mobileNumber"
            label="Mobile Number"
            type="text"
            placeholder="+1 234 567 890"
          />

          <FormikTextField
            id="auth-register-address-input"
            name="address"
            label="Address"
            type="text"
            placeholder="123 Street, City, Country"
          />

          <div className="flex flex-col space-y-1 mb-4">
            <label htmlFor="auth-register-profile-image-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Image
            </label>
            <input
              id="auth-register-profile-image-input"
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            {formik.values.profileImage && typeof formik.values.profileImage !== 'string' && (
              <p className="text-xs text-gray-500 mt-1">Selected: {(formik.values.profileImage as File).name}</p>
            )}
          </div>

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
