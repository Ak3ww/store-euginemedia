"use client";

import React, { useState } from "react";
import { Star, MessageSquare } from "lucide-react";

interface Review {
  id?: string;
  name: string;
  ratings: number;
  title: string;
  comment: string;
  recommend?: boolean;
  createdAt?: string;
}

interface ReviewCardProps {
  ratings: number;
  numOfReviews: number;
  reviews?: Review[];
}

export default function ReviewCard({ ratings, numOfReviews, reviews = [] }: ReviewCardProps) {
  const [sortValue, setSortValue] = useState<"highest" | "lowest">("highest");
  const [showModal, setShowModal] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newRev: Review = {
      id: String(Date.now()),
      name: reviewName,
      ratings: reviewRating,
      title: reviewTitle || "Produk Sangat Bagus",
      comment: reviewComment,
      recommend: true,
      createdAt: "Hari ini",
    };

    setLocalReviews([newRev, ...localReviews]);
    setShowModal(false);
    setReviewName("");
    setReviewTitle("");
    setReviewComment("");
  };

  const sortedReviews = [...localReviews].sort((a, b) => {
    if (sortValue === "highest") return b.ratings - a.ratings;
    return a.ratings - b.ratings;
  });

  return (
    <div className="w-full bg-white rounded-[4px] p-6 sm:p-10 shadow-[0_2px_6px_rgba(0,0,0,0.08)] mt-10 font-['Roboto',sans-serif]">
      {/* 1. Header (Exact Cricket-Weapon Users Reviews) */}
      <h2 className="text-[22px] sm:text-[24px] font-[700] text-black font-['Archivo'] pb-4 border-b border-neutral-100">
        Users Reviews
      </h2>

      {/* 2. Write Review Button */}
      <div className="mt-6">
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-8 h-[44px] bg-[#161616] hover:bg-[#ed1c24] text-white font-['Archivo'] font-bold text-[14px] uppercase tracking-wider rounded-[4px] transition-colors cursor-pointer"
        >
          Write your Review
        </button>
      </div>

      {/* 3. Rating Statistics */}
      <div className="flex flex-wrap items-center gap-4 mt-8 pb-6 border-b border-neutral-100">
        <div className="flex items-center text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(ratings) ? "fill-amber-500 text-amber-500" : "text-neutral-200 fill-neutral-200"
              }`}
            />
          ))}
        </div>
        <span className="text-[15px] font-[500] text-black font-['Roboto']">{ratings} stars</span>
        <span className="text-neutral-300">|</span>
        <span className="text-[14px] font-[500] text-neutral-600">
          <strong>Total Reviews :</strong> {numOfReviews || localReviews.length}
        </span>

        {/* Sort Filter */}
        <div className="ml-auto flex items-center space-x-2 text-xs">
          <span className="font-semibold text-neutral-500 font-['Roboto']">SortBy :</span>
          <select
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value as any)}
            className="h-8 px-2 border border-neutral-300 rounded-[3px] text-xs font-['Roboto'] bg-white focus:outline-none"
          >
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* 4. Review Cards List */}
      <div className="mt-6 divide-y divide-neutral-100">
        {sortedReviews.length === 0 ? (
          <div className="py-10 text-center text-neutral-400">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 text-neutral-300" />
            <p className="text-sm font-['Roboto']">Belum ada review untuk produk ini. Jadilah yang pertama!</p>
          </div>
        ) : (
          sortedReviews.map((rev, idx) => (
            <div key={idx} className="py-5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs uppercase font-['Archivo']">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black font-['Archivo']">{rev.name}</h4>
                    <p className="text-[11px] text-neutral-400 font-['Roboto']">{rev.createdAt || "Verifikasi Pembeli"}</p>
                  </div>
                </div>

                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rev.ratings ? "fill-amber-500 text-amber-500" : "text-neutral-200 fill-neutral-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h5 className="text-[14px] font-[600] text-black font-['Roboto'] pt-1">{rev.title}</h5>
              <p className="text-sm text-neutral-700 font-['Roboto'] leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[6px] max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold font-['Archivo'] text-black mb-4">Submit Review</h3>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 font-['Archivo'] mb-1">
                  Nama Anda
                </label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Contoh: Budi Pratama"
                  className="w-full h-10 px-3 border border-neutral-300 rounded-[3px] text-sm font-['Roboto']"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 font-['Archivo'] mb-1">
                  Rating Bintang
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-neutral-300 rounded-[3px] text-sm font-['Roboto'] bg-white"
                >
                  <option value={5}>5 Bintang (Sangat Puas)</option>
                  <option value={4}>4 Bintang (Puas)</option>
                  <option value={3}>3 Bintang (Cukup)</option>
                  <option value={2}>2 Bintang (Kurang)</option>
                  <option value={1}>1 Bintang (Kecewa)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 font-['Archivo'] mb-1">
                  Judul Review
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Contoh: Kualitas sangat bagus dan original"
                  className="w-full h-10 px-3 border border-neutral-300 rounded-[3px] text-sm font-['Roboto']"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 font-['Archivo'] mb-1">
                  Ulasan Lengkap
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tulis ulasan Anda mengenai barang ini..."
                  className="w-full p-3 border border-neutral-300 rounded-[3px] text-sm font-['Roboto']"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-[3px] text-xs font-bold uppercase font-['Archivo'] text-neutral-600 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black hover:bg-[#ed1c24] text-white rounded-[3px] text-xs font-bold uppercase font-['Archivo'] transition-colors"
                >
                  Kirim Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
