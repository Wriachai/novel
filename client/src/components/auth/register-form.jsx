import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // เช่น http://localhost/novel/server/api
  headers: {
    "Content-Type": "application/json",
  },
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    display_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/user/register.php", {
        firstname: formData.firstname,
        lastname: formData.lastname,
        display_name: formData.display_name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(res.data.message);

      setFormData({
        firstname: "",
        lastname: "",
        display_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });

      if (res.status === 201) navigate("/login");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Something went wrong";
      toast.error(err.response?.data?.message || "Something went wrong"); // ข้อความ error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Register with your email</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="firstname">First Name</Label>
              <Input id="firstname" value={formData.firstname} onChange={handleChange} required />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" value={formData.lastname} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="display_name">Display Name</Label>
            <Input id="display_name" value={formData.display_name} onChange={handleChange} required />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input id="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} required />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>

          {/* {message && <p className="text-center text-sm mt-2 text-red-600">{message}</p>} */}

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <NavLink to="/login" className="underline underline-offset-4">
              Login
            </NavLink>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
