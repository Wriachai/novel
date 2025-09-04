// @/api/chapter.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ตัวอย่าง: http://localhost/novel/server/api
  headers: { "Content-Type": "application/json" },
});

// อ่าน chapter ตาม novel_id
export const readChaptersByNovel = async (novel_id) => {
  return await api.get("/chapter/read.php", { params: { novel_id } });
};

// สร้าง chapter ใหม่
export const createChapter = async (chapterData) => {
  return await api.post("/chapter/create.php", chapterData);
};

// อัปเดต chapter
export const updateChapter = async (chapterData) => {
  return await api.put("/chapter/update.php", chapterData);
};


// อ่าน chapter ตาม novel_id และ chapter_number
export const readChapterByNumber = async (novel_id, chapter_number) => {
  return await api.get("/chapter/read_chapter_number.php", {
    params: { novel_id, chapter_number },
  });
};

// ลบ chapter
export const deleteChapter = async (novel_id, chapter_number) => {
  return await api.delete("/chapter/delete.php", {
    data: { novel_id, chapter_number }, // ต้องส่งใน body เพราะ axios.delete ส่ง params จะไม่เหมือน PUT/POST
  });
};
