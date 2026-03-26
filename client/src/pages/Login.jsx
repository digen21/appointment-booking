import { useFormik } from "formik";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useLogin";
import { useProfile } from "@/hooks/useProfile";
import { loginSchema } from "@/validators/login.validators";
import { AuthForm } from "@/components/ui/AuthForm";

const Login = () => {
  const { mutate } = useLogin();
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useProfile();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (data) =>
      mutate(data, {
        onSuccess: () => navigate("/host"),
      }),
  });

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }
  if (profileData?.data) {
    return <Navigate to="/host" replace />;
  }

  return (
    <AuthForm title="Login" description="Enter your email">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          onChange={formik.handleChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Your password"
          onChange={formik.handleChange}
        />
        <Button type="submit">Login</Button>
        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </p>
      </form>
    </AuthForm>
  );
};
export default Login;
