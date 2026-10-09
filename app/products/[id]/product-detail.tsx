"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Truck, Check, X, Minus, Plus, ShoppingBag, ExternalLink } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import ReviewCard from "@/components/product/ReviewCard";
import { BrandLogo } from "@/components/ui/brand-logo";
import "./ProductDetails.css";

interface ProductDetailPageProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    imageUrl?: string | null;
    image?: string;
    images?: string[] | any;
    description?: string;
    info?: string;
    weight?: number;
    stock?: number;
    rating?: number;
    reviews?: number;
    specifications?: Record<string, string> | any;
  };
  relatedProducts?: any[];
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Normalize image gallery list
  const imagesList = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map((img: any) => (typeof img === "string" ? img : img.url))
    : [product.imageUrl || product.image || "/images/placeholder-product.png"];

  const currentPreviewImg = imagesList[activeImgIndex] || imagesList[0];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: currentPreviewImg,
      weight: product.weight || 500,
      quantity,
    });
  };

  const increaseQuantity = () => {
    if (product.stock && quantity >= product.stock) return;
    setQuantity((q) => q + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity((q) => q - 1);
  };

  const oldPrice = product.originalPrice && product.originalPrice > product.price ? product.originalPrice : null;
  const savedPrice = oldPrice ? oldPrice - product.price : null;
  const savedDiscount = oldPrice && savedPrice ? Math.round((savedPrice / oldPrice) * 100) : null;

  const inStock = (product.stock ?? 10) > 0;
  const ratingValue = product.rating || 5;
  const reviewCount = product.reviews || 24;

  return (
    <div className="prodcutDetialsContainer">
      <div className="product_container">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 text-xs font-semibold text-neutral-500 font-['Roboto'] uppercase tracking-wider flex items-center space-x-2">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black">Products</Link>
          <span>/</span>
          <span className="text-black font-bold truncate max-w-sm">{product.name}</span>
        </div>

        {/* 1:1 Product Details Wrapper */}
        <div className="prod_details_wrapper">
          {/*=== Product Details Left-column (Gallery with vertical tabs) ===*/}
          <div className="prod_details_left_col">
            {imagesList.length > 1 && (
              <div className="prod_details_tabs">
                {imagesList.map((imgUrl: string, idx: number) => (
                  <div
                    key={idx}
                    className={`tabs_item ${activeImgIndex === idx ? "active" : ""}`}
                    onClick={() => setActiveImgIndex(idx)}
                  >
                    <img src={imgUrl} alt={`${product.name}-${idx}`} />
                  </div>
                ))}
              </div>
            )}
            <figure className="prod_details_img">
              <img src={currentPreviewImg} alt={product.name} />
            </figure>
          </div>

          {/*=== Product Details Right-column (Details & Actions) ===*/}
          <div className="prod_details_right_col_001">
            <h1 className="prod_details_title">{product.name}</h1>
            <h4 className="prod_details_info">
              {product.info || "Official certified equipment from Eugine Media Group"}
            </h4>

            {/* Ratings Bar */}
            <div className="prod_details_ratings">
              <div className="flex items-center text-black">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(ratingValue) ? "fill-black text-black" : "text-neutral-300 fill-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-neutral-400">|</span>
              <a href="#reviews" className="text-neutral-600 hover:text-[#ed1c24] font-medium">
                {reviewCount} Ratings
              </a>
            </div>

            {/* Price Box */}
            <div className="prod_details_price">
              <div className="price_box">
                <h2 className="price">
                  Rp {(Number(product.price) || 0).toLocaleString("id-ID")}
                  {oldPrice && (
                    <small className="del_price ml-2">
                      <del>Rp {(Number(oldPrice) || 0).toLocaleString("id-ID")}</del>
                    </small>
                  )}
                </h2>
                {savedPrice && savedDiscount && (
                  <p className="saved_price">
                    You save: Rp {(Number(savedPrice) || 0).toLocaleString("id-ID")} ({savedDiscount}%)
                  </p>
                )}
                <span className="tax_txt">(Inclusive of all taxes)</span>
              </div>

              {/* Stock Badge */}
              <div className="badge">
                {inStock ? (
                  <span className="instock">
                    <Check className="h-3.5 w-3.5 inline mr-1" /> In Stock
                  </span>
                ) : (
                  <span className="outofstock">
                    <X className="h-3.5 w-3.5 inline mr-1" /> Out of stock
                  </span>
                )}
              </div>
            </div>

            <div className="seprator2" />

            {/* Product Description */}
            <div className="productDescription">
              <div className="productDiscriptiopn_text">
                <h4>Description :</h4>
                <p>{product.description || "Perangkat kualitas tinggi siap pakai dengan jaminan garansi resmi."}</p>
              </div>

              {/* Offers and Discounts (Cricket-Weapon signature block) */}
              <div className="prod_details_offers">
                <h4>Offers and Discounts</h4>
                <ul>
                  <li>Gratis Ongkir se-Jabodetabek</li>
                  <li>Garansi Resmi 1 Tahun</li>
                  <li>QRIS Real-Time Payment 24/7</li>
                </ul>
              </div>

              {/* Delivery & Logistics Badges */}
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 font-['Archivo']">
                  <Truck className="h-3.5 w-3.5 text-neutral-900" />
                  <span>Ekspedisi Pengiriman Didukung:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <BrandLogo name="jne" category="courier" size="xs" variant="badge" />
                  <BrandLogo name="j-and-t-express" category="courier" size="xs" variant="badge" />
                  <BrandLogo name="sicepat-ekspres" category="courier" size="xs" variant="badge" />
                  <BrandLogo name="anteraja" category="courier" size="xs" variant="badge" />
                  <BrandLogo name="pos-indonesia" category="courier" size="xs" variant="badge" />
                </div>
              </div>

              {/* Official Marketplaces */}
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 font-['Archivo']">
                  <ShoppingBag className="h-3.5 w-3.5 text-neutral-900" />
                  <span>Juga Tersedia di Marketplace Resmi:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://shopee.co.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-neutral-50 border border-neutral-200 rounded text-xs font-medium text-neutral-800 transition-colors shadow-2xs"
                  >
                    <BrandLogo name="shopee" category="marketplace" size="xs" variant="raw" />
                    <span>Shopee Official</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                  <a
                    href="https://tokopedia.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-neutral-50 border border-neutral-200 rounded text-xs font-medium text-neutral-800 transition-colors shadow-2xs"
                  >
                    <BrandLogo name="tokopedia" category="marketplace" size="xs" variant="raw" />
                    <span>Tokopedia</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                </div>
              </div>
            </div>

            <div className="seprator2" />

            {/* Quantity Stepper & Add To Cart Button */}
            <div className="prod_details_additem">
              <div className="flex items-center space-x-2">
                <h5>QTY :</h5>
                <div className="additem">
                  <button onClick={decreaseQuantity} className="additem_decrease" title="Decrease">
                    <Minus className="h-3 w-3" />
                  </button>
                  <input
                    type="number"
                    readOnly
                    value={quantity}
                    className="additem_input"
                  />
                  <button onClick={increaseQuantity} className="additem_increase" title="Increase">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="prod_details_addtocart_btn disabled:opacity-50"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {/* User Reviews Section (Exact Cricket-Weapon ReviewCard) */}
        <div id="reviews" className="w-full">
          <ReviewCard ratings={ratingValue} numOfReviews={reviewCount} />
        </div>
      </div>
    </div>
  );
}
