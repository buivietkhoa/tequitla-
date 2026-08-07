"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "@/lib/api-client";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", gender: "nam", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const { data } = await api.get("/categories");
        if (!ignore) setCategories(data.categories);
      } catch (error) {
        if (!ignore) toast.error(getErrorMessage(error));
      }
    }

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/categories", form);
      toast.success("Đã tạo danh mục");
      setForm({ name: "", gender: "nam", description: "" });
      const { data } = await api.get("/categories");
      setCategories(data.categories);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Xóa danh mục này?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Đã xóa danh mục");
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Danh mục</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex max-w-xl flex-wrap gap-3">
        <input
          required
          placeholder="Tên danh mục"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="nam">Nam</option>
          <option value="nu">Nữ</option>
          <option value="unisex">Unisex</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white disabled:bg-neutral-300"
        >
          Thêm
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{cat.name}</p>
              <p className="text-xs text-neutral-500">
                {cat.gender === "nam" ? "Nam" : cat.gender === "nu" ? "Nữ" : "Unisex"} · /{cat.slug}
              </p>
            </div>
            <button
              onClick={() => handleDelete(cat._id)}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
