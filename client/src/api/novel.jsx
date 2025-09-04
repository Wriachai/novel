import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" }, // Default สำหรับ JSON
});

// อ่านนิยายทั้งหมดของ user พร้อม pagination
export const readNovelsByUser = async (user_id, page = 1, limit = 10) => {
  return await api.get("/novel/read_user.php", { params: { user_id, page, limit } });
};

// สร้างนิยายใหม่
export const createNovel = async (novelData) => {
  return await api.post("/novel/create.php", novelData);
};

// อัปโหลดรูป cover image
export const uploadCoverImage = async (formData) => {
  // formData ต้องถูกสร้างใน React แบบ FormData() และ append("file", file)
  return await api.post("/novel/upload.php", formData, {
    headers: { "Content-Type": "multipart/form-data" }, // บังคับ multipart/form-data
  });
};

// อ่านนิยายตาม novel_id
export const readNovelById = async (novel_id) => {
  return await api.get("/novel/read_one.php", { params: { novel_id } });
};

// อัปเดตนิยาย
export const updateNovel = async (novelData) => {
  // ส่ง JSON ให้ PHP อ่านด้วย json_decode(file_get_contents("php://input"))
  return await api.put("/novel/update.php", {
    ...novelData,
    categories: Array.isArray(novelData.categories)
      ? novelData.categories
      : [], // ✅ แปลงให้แน่ใจว่าเป็น array
  });
};
