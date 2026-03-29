import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div id="auth-register-page" className="flex flex-1 items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 w-full">
      <RegisterForm />
    </div>
  );
}
