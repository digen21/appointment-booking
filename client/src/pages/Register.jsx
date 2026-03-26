import { useFormik } from "formik";

import { AuthForm } from "@/components/ui/AuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/useRegister";
import { registerSchema } from "@/validators/register.validators";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { mutate } = useRegister();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: registerSchema,
    onSubmit: (data) =>
      mutate(data, {
        onSuccess: () => navigate("/"),
      }),
  });

  return (
    <AuthForm title="Register" description="Create account">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <Input
          name="name"
          placeholder="Full name"
          onChange={formik.handleChange}
        />
        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          onChange={formik.handleChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Create a password"
          onChange={formik.handleChange}
        />
        <Button type="submit">Register</Button>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="underline">
            Login
          </Link>
        </p>
      </form>
    </AuthForm>
  );
};

export default Register;
