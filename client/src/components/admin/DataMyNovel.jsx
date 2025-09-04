import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Eye, List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { readAllCategory } from "@/api/category";
import { readNovelsByUser, createNovel, uploadCoverImage } from "@/api/novel";
import useAuthStore from "@/store/novel-store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

const DataMyNovel = () => {
  const { user } = useAuthStore();
  const [novels, setNovels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author_name: "",
    translator_name: "",
    description: "",
    status: "draft",
    coverImage: null,
    previewImage: "",
  });
  const [creating, setCreating] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadNovels();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await readAllCategory(1, 100);
      if (res.data.records) setCategories(res.data.records);
    } catch (err) {
      toast.error("Failed to load categories");
      console.error(err);
    }
  };

  const loadNovels = async () => {
    if (!user) return;
    try {
      const res = await readNovelsByUser(user.user_id, 1, 100);
      if (res.data.records) setNovels(res.data.records);
      console.log(res.data.records);
    } catch (err) {
      // toast.error("Failed to load novels");
      console.error(err);
    }
  };

  const handleCreateNovel = async () => {
    if (!user) return toast.warn("Please login first");

    if (selectedCategories.length === 0) {
      toast.warn("Please select at least one category");
      return;
    }

    setCreating(true);

    let imageUrl = "";
    if (form.coverImage) {
      try {
        const formData = new FormData();
        formData.append("file", form.coverImage); // ✅ key ต้องตรงกับที่ PHP รับ
        const res = await uploadCoverImage(formData);
        imageUrl = res.data?.url || "";
      } catch (err) {
        toast.error("Failed to upload cover image");
        setCreating(false);
        return;
      }
    }

    const payload = {
      user_id: user.user_id,
      title: form.title,
      author_name: form.author_name || null,
      translator_name: form.translator_name || null,
      description: form.description,
      cover_image_url: imageUrl,
      status: form.status,
      view_count: 0,
      categories: selectedCategories.map((c) => c.category_id),
    };

    try {
      const res = await createNovel(payload);
      loadNovels();

      // เคลียร์ฟอร์ม
      setForm({
        title: "",
        author_name: "",
        translator_name: "",
        description: "",
        status: "draft",
        coverImage: null,
        previewImage: "",
      });
      setSelectedCategories([]);

      // ปิด Dialog หลังเพิ่มข้อมูล
      setDialogOpen(false);

      toast.success("Novel created successfully!");
    } catch (err) {
      toast.error("Error creating novel");
    } finally {
      setCreating(false);
    }

  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Add Novel */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex flex-col items-center justify-center h-[260px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => setDialogOpen(true)}>
              <Plus className="h-10 w-10 text-gray-500 mb-2" />
              <span className="text-gray-600 font-medium">Add Novel</span>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] w-full max-h-[90vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg animate-fade-in"
                        style={{
                            animationDuration: "0.2s",
                            animationFillMode: "forwards",
                        }}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Add New Novel</DialogTitle>
              <DialogDescription>เพิ่มข้อมูลนิยายใหม่ของคุณ</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateNovel();
              }}
            >
              <div className="flex flex-col sm:flex-row gap-4 py-2">
                {/* Left: File + Preview */}
                <div className="w-full sm:w-1/3 flex flex-col items-center">
                  <label className="block mb-1 font-medium text-sm">Cover Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setForm({
                        ...form,
                        coverImage: file,
                        previewImage: URL.createObjectURL(file),
                      });
                    }}
                  />
                  {form.previewImage && (
                    <img
                      src={form.previewImage}
                      alt="Preview"
                      className="mt-2 w-full h-60 object-cover rounded-md shadow-md"
                    />
                  )}
                </div>

                {/* Right: Form */}
                <div className="w-full sm:w-2/3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      placeholder="Enter novel title"
                      value={form.title}
                      required
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Author Name</label>
                    <Input
                      placeholder="Enter author name"
                      value={form.author_name}
                      onChange={(e) =>
                        setForm({ ...form, author_name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Translator Name</label>
                    <Input
                      placeholder="Enter translator name"
                      value={form.translator_name}
                      onChange={(e) =>
                        setForm({ ...form, translator_name: e.target.value })
                      }
                    />
                  </div>

                  {/* Categories multi-select */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Categories
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full text-left">
                          {selectedCategories.length
                            ? selectedCategories.map((c) => c.name).join(", ")
                            : "Select categories"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-60 max-h-48 overflow-y-auto">
                        <DropdownMenuLabel>Categories</DropdownMenuLabel>
                        {categories.map((cat) => (
                          <DropdownMenuCheckboxItem
                            key={cat.category_id}
                            checked={selectedCategories.some(
                              (c) => c.category_id === cat.category_id
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories((prev) => [...prev, cat]);
                              } else {
                                setSelectedCategories((prev) =>
                                  prev.filter(
                                    (c) => c.category_id !== cat.category_id
                                  )
                                );
                              }
                            }}
                          >
                            {cat.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      placeholder="Enter novel description"
                      value={form.description}
                      required
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="h-32"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select
                      value={form.status}
                      required
                      onValueChange={(value) =>
                        setForm({ ...form, status: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">แบบร่าง</SelectItem>
                        <SelectItem value="ongoing">กำลังดำเนินการ</SelectItem>
                        <SelectItem value="completed">จบแล้ว</SelectItem>
                        <SelectItem value="paused">หยุดชั่วคราว</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={creating}>
                  {creating ? "Adding..." : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Display novels */}
        {novels.map((novel) => (
          <div
            key={novel.novel_id ?? novel.id}
            className="transition cursor-pointer"
            onClick={() => navigate(`${novel.novel_id ?? novel.id}`)}
          >
            <div className="relative h-[210px] overflow-hidden rounded-xl flex items-center justify-center bg-gray-200">
              {novel.cover_image_url ? (
                <img
                  src={
                    novel.cover_image_url.startsWith("http")
                      ? novel.cover_image_url
                      : `${import.meta.env.VITE_UPLOAD_BASE}/${novel.cover_image_url}`
                  }
                  alt={novel.title || "No Title"}
                  className="w-full h-full object-cover" // กลับมาใช้ object-cover
                />
              ) : (
                <span className="text-gray-500 font-semibold">No Image</span>
              )}
            </div>

            <div className="p-2">
              <h3 className="text-sm font-bold truncate">
                {novel.title || "Untitled Novel"}
              </h3>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{novel.view_count?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <List className="w-4 h-4" />
                  <span>{novel.chapter_count || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataMyNovel;
