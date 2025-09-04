import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import useAuthStore from "@/store/novel-store";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { actionLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await actionLogin(formData);
      toast.success(res.message || "Login successful 🎉");
      const role = res.user.role;
      roleRedirect(role);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await actionLogin({ google_token: credentialResponse.credential });
      toast.success(res.message || "Google login success 🎉");
      const role = res.user.role;
      roleRedirect(role);
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Login with Google or your email</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 mb-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login failed ❌")}
          />
        </div>
        <div className="mb-5 mt-5 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
        <div className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <NavLink to="/register" className="underline">
            Sign up
          </NavLink>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
