"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>();
  const [weight, setWeight] = useState(500);
  const [stock, setStock] = useState(50);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [shopeeUrl, setShopeeUrl] = useState("");
  const [tokopediaUrl, setTokopediaUrl] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      if (prodData.products) setProducts(prodData.products);
      if (catData.categories) {
        setCategories(catData.categories);
        if (catData.categories.length > 0 && !categoryId) {
          setCategoryId(catData.categories[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setSku("");
    setPrice(0);
    setOriginalPrice(undefined);
    setWeight(500);
    setStock(50);
    setImageUrl("");
    setDescription("");
    setShopeeUrl("");
    setTokopediaUrl("");
    if (categories.length > 0) setCategoryId(categories[0].id);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setSku(prod.sku || "");
    setCategoryId(prod.categoryId);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice || undefined);
    setWeight(prod.weight || 500);
    setStock(prod.stock || 0);
    setImageUrl(prod.imageUrl || "");
    setDescription(prod.description || "");
    setShopeeUrl(prod.shopeeUrl || "");
    setTokopediaUrl(prod.tokopediaUrl || "");
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sku: sku || undefined,
      categoryId,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      weight: Number(weight),
      stock: Number(stock),
      imageUrl: imageUrl || undefined,
      description,
      shopeeUrl: shopeeUrl || undefined,
      tokopediaUrl: tokopediaUrl || undefined,
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsSaving(false);

      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menyimpan produk");
        return;
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setIsSaving(false);
      setErrorMsg("Terjadi kesalahan saat menyimpan produk");
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Yakin ingin menonaktifkan produk "${prodName}"?`)) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Gagal menghapus produk");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Overview
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Katalog Produk</h1>
          <p className="text-xs text-slate-500">Kelola daftar perangkat, stok, harga, dan tautan marketplace resmi</p>
        </div>

        <Button onClick={openCreateModal} className="bg-[#002c60] hover:bg-[#001f44] text-white text-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" /> Tambah Produk Baru
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk, SKU, atau kategori..."
            className="pl-9 h-10 text-xs border-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* Datatable */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#002c60] mb-2" />
            <span className="text-xs">Memuat katalog...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">Tidak ada produk yang cocok dengan pencarian.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga (IDR)</th>
                  <th className="py-3 px-4">Berat</th>
                  <th className="py-3 px-4">Stok</th>
                  <th className="py-3 px-4">Marketplace</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                          {prod.imageUrl ? (
                            <img src={prod.imageUrl} alt={prod.name} className="h-full w-full object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1 max-w-xs">{prod.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{prod.sku || prod.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold">
                        {prod.category?.name || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#002c60]">Rp {prod.price.toLocaleString("id-ID")}</td>
                    <td className="py-3 px-4 font-medium">{prod.weight}g</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${prod.stock > 10 ? "text-emerald-600" : "text-amber-600"}`}
                      >
                        {prod.stock} pcs
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {prod.shopeeUrl && (
                          <a
                            href={prod.shopeeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Shopee Link"
                            className="p-1 rounded bg-[#EE4D2D]/10 hover:bg-[#EE4D2D]/20 transition-colors"
                          >
                            <img src="/images/marketplaces/shopee.svg" alt="Shopee" className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {prod.tokopediaUrl && (
                          <a
                            href={prod.tokopediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Tokopedia Link"
                            className="p-1 rounded bg-[#03AC0E]/10 hover:bg-[#03AC0E]/20 transition-colors"
                          >
                            <img src="/images/marketplaces/tokopedia.svg" alt="Tokopedia" className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {!prod.shopeeUrl && !prod.tokopediaUrl && <span className="text-slate-300">-</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-[#002c60] transition-colors"
                          title="Edit Produk"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-white border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingProduct ? "Edit Perangkat Jaringan" : "Tambah Perangkat Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Isi data detail spesifikasi, harga, stok, dan link marketplace resmi
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">{errorMsg}</div>
          )}

          <form onSubmit={handleSaveProduct} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Produk *</label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: MikroTik RB750Gr3 (hEX)"
                className="h-10 text-xs border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SKU / Kode Barang</label>
                <Input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="MK-HEX-750"
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Harga (IDR) *</label>
                <Input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Coret (Opsional)</label>
                <Input
                  type="number"
                  value={originalPrice || ""}
                  onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0"
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Berat (Gram) *</label>
                <Input
                  type="number"
                  required
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  placeholder="500"
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stok Tersedia *</label>
                <Input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Gambar Produk</label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... atau /uploads/..."
                  className="h-10 text-xs border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Marketplace URLs Section */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Tautan Toko Marketplace Resmi (Opsional)
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Link Produk Shopee</label>
                <Input
                  value={shopeeUrl}
                  onChange={(e) => setShopeeUrl(e.target.value)}
                  placeholder="https://shopee.co.id/product/..."
                  className="h-9 text-xs border-slate-200 bg-white rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Link Produk Tokopedia</label>
                <Input
                  value={tokopediaUrl}
                  onChange={(e) => setTokopediaUrl(e.target.value)}
                  placeholder="https://tokopedia.com/..."
                  className="h-9 text-xs border-slate-200 bg-white rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi & Spesifikasi Produk *</label>
              <Textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rincian fitur, jumlah port, chipset, kelengkapan adaptor..."
                className="text-xs border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#002c60] hover:bg-[#001f44] text-white text-xs font-semibold"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                {editingProduct ? "Simpan Perubahan" : "Tambahkan Produk"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
