import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      // Login action
      actionLogin: async (formData) => {
        const res = await api.post("/user/login.php", formData);
        set({
          user: res.data.user,
          token: res.data.token || null,
        });
        return res.data;
      },

      // Logout action
      actionLogout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "novel-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
