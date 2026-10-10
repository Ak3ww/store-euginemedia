import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductDetailPage from "@/app/products/[id]/product-detail";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://store.euginemediagroup.com";
  let productName = "Perangkat Jaringan - EugineStore";
  let description = "Perangkat jaringan berkualitas resmi dari Eugine Media Group.";
  let imageUrl = `${appUrl}/images/og-default.png`;
  let price: number | null = null;
  try {
    const { prisma } = await import("@/lib/prisma");
    const product = await prisma.product.findFirst({
      where: { OR: [{ slug: id }, { id }], isActive: true },
      select: { name: true, description: true, imageUrl: true, price: true },
    });
    if (product) {
      productName = `${product.name} — EugineStore`;
      if (product.description) description = product.description.slice(0, 160);
      if (product.imageUrl) imageUrl = product.imageUrl.startsWith("http") ? product.imageUrl : `${appUrl}${product.imageUrl}`;
      price = product.price;
    }
  } catch {
    // fallback
  }
  const priceText = price ? ` | Harga: Rp ${price.toLocaleString("id-ID")}` : "";
  return {
    title: productName,
    description: `${description}${priceText}`,
    openGraph: {
      title: productName,
      description: `${description}${priceText}`,
      images: [{ url: imageUrl, width: 800, height: 600, alt: productName }],
      type: "website",
      siteName: "EugineStore",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description: `${description}${priceText}`,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Query database first by slug or by id
  let product: any = null;
  try {
    product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: id }, { id: id }],
        isActive: true,
      },
      include: {
        category: true,
      },
    });
  } catch (err) {
    console.warn("DB query error in product page, fallback:", err);
  }

  // Fallback to static mock products if db product not found yet
  if (!product) {
    const { products } = await import("@/lib/data");
    const mock = products.find((p) => p.id === id);
    if (!mock) return notFound();

    product = {
      ...mock,
      slug: mock.id,
      imageUrl: mock.image,
      stock: 30,
      weight: 500,
      specifications: {
        "Garansi": "1 Tahun Resmi",
        "Kondisi": "Baru (Original Box)",
        "Distribusi": "Eugine Media Group",
      },
    };
  }

  // Related products
  let relatedProducts: any[] = [];
  try {
    if (product.categoryId) {
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        take: 3,
      });
    }
  } catch {
    // silently ignore
  }

  return <ProductDetailPage product={product} relatedProducts={relatedProducts} />;
}
