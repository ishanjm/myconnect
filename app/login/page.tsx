import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div id="auth-login-page" className="flex flex-1 items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 w-full">
      <LoginForm />
    </div>
  );
}
