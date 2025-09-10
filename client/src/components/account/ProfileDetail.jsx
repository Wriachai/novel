"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile, updateUserPassword, updateUserRole } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import useAuthStore from "@/store/novel-store";
import { toast } from "react-toastify";

const ProfileDetail = () => {
  const { user, actionSetUser } = useAuthStore();
  const navigate = useNavigate();
  const userId = user?.user_id;

  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    display_name: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getUserProfile(userId);
        setProfile(prev => ({
          ...prev,
          firstname: res.data.firstname || "",
          lastname: res.data.lastname || "",
          display_name: res.data.display_name || "",
          email: res.data.email || ""
        }));
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้ ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateUserProfile(userId, profile);
      toast.success(res.data.message || "อัปเดตโปรไฟล์เรียบร้อยแล้ว ✅");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "ไม่สามารถอัปเดตโปรไฟล์ได้ ❌");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!profile.password) {
      toast.error("รหัสผ่านไม่สามารถเว้นว่างได้ ❌");
      return;
    }
    if (profile.password !== profile.confirm_password) {
      toast.error("รหัสผ่านไม่ตรงกัน ❌");
      return;
    }

    setSaving(true);
    try {
      const res = await updateUserPassword(userId, profile.password);
      toast.success(res.data.message || "อัปเดตรหัสผ่านเรียบร้อยแล้ว ✅");
      setProfile({ ...profile, password: "", confirm_password: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "ไม่สามารถอัปเดตรหัสผ่านได้ ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-6">กำลังโหลด...</div>;
  if (error) return <div className="text-center text-red-500 py-6">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={() => navigate("/")} className="hover:text-gray-900 transition-colors cursor-pointer">
                หน้าแรก
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={() => navigate("/profile")} className="hover:text-gray-900 transition-colors cursor-pointer">
                โปรไฟล์
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile Form */}
        <Card className="w-full mx-auto grid gap-1">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">โปรไฟล์</CardTitle>
            <CardDescription>แก้ไขข้อมูลส่วนตัวของคุณ</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="grid gap-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="firstname">ชื่อจริง</Label>
                  <Input id="firstname" value={profile.firstname} onChange={handleChange} required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastname">นามสกุล</Label>
                  <Input id="lastname" value={profile.lastname} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="display_name">ชื่อที่แสดง</Label>
                <Input id="display_name" value={profile.display_name} onChange={handleChange} required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">อีเมล</Label>
                <Input id="email" type="email" value={profile.email} onChange={handleChange} required />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" onClick={() => navigate(-1)} variant="outline">
                  ยกเลิก
                </Button>
                <Button type="submit">
                  บันทึก
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Reset Password Form */}
        <Card className="w-full mx-auto grid gap-1">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">เปลี่ยนรหัสผ่าน</CardTitle>
            <CardDescription>ตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSave} className="grid gap-4 mt-4">

              <Label htmlFor="password">รหัสผ่านใหม่</Label>
              <Input
                id="password"
                type="password"
                value={profile.password}
                onChange={handleChange}
                placeholder="ปล่อยว่างหากไม่ต้องการเปลี่ยน"
              />
              <Label htmlFor="confirm_password">ยืนยันรหัสผ่าน</Label>
              <Input
                id="confirm_password"
                type="password"
                value={profile.confirm_password}
                onChange={handleChange}
                placeholder="ปล่อยว่างหากไม่ต้องการเปลี่ยน"
              />

              <div className="flex justify-end space-x-2 mt-4">
                <Button type="submit">
                  อัปเดตรหัสผ่าน
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 w-full">
        {user?.role === "user" ? (
          <Dialog>
            <DialogTrigger asChild>
              <div
                className="flex flex-row items-center justify-center space-x-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition px-4 py-3"
              >
                <span className="text-gray-600 font-bold">สมัครนักเขียน</span>
              </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg w-full p-4 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>ยืนยันการสมัครเป็นนักเขียน</DialogTitle>
                <DialogDescription>
                  คุณต้องการสมัครเป็นนักเขียนใช่หรือไม่? โปรดยืนยันว่าคุณยินยอมปฏิบัติตามกฎและเงื่อนไขของเว็บไซต์
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-2">
                <p>การสมัครนักเขียนจะเปิดสิทธิ์ในการสร้างและเผยแพร่นิยายของคุณ</p>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" id="agreeTerms" />
                  <span>ฉันยินยอมและยอมรับกฎระเบียบของเว็บไซต์</span>
                </label>
              </div>

              <DialogFooter className="mt-4 flex justify-end space-x-2">
                <DialogClose asChild>
                  <div className="px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    ยกเลิก
                  </div>
                </DialogClose>
                <div
                  onClick={async () => {
                    if (!userId) return toast.error("ไม่พบผู้ใช้งาน ❌");
                    const checkbox = document.getElementById("agreeTerms");
                    if (!checkbox?.checked) {
                      toast.error("คุณต้องยืนยันว่าตกลงกฎก่อนสมัครนักเขียน ❌");
                      return;
                    }

                    try {
                      await updateUserRole(userId, "writer");
                      toast.success("คุณได้สมัครนักเขียนเรียบร้อยแล้ว ✅");

                      actionSetUser({ role: "writer" });

                      document.querySelector("[role='dialog'] button[aria-label='Close']")?.click();
                    } catch (err) {
                      console.error(err);
                      toast.error(err.response?.data?.message || "ไม่สามารถสมัครนักเขียนได้ ❌");
                    }
                  }}

                  className="flex flex-row items-center justify-center space-x-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition px-4 py-3"
                >
                  <span className="text-gray-600 font-medium">ยืนยันสมัคร</span>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="text-center text-gray-400"></div>
          // <div className="text-center text-gray-400">สิทธิ์สมัครนักเขียนจำกัดเฉพาะผู้ใช้ที่มี role เป็น 'user' เท่านั้น</div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;
