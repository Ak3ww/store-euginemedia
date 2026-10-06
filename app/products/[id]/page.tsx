import { prisma } from "@/lib/prisma";
import ProductDetailPage from "@/app/products/[id]/product-detail";
import { notFound } from "next/navigation";

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
