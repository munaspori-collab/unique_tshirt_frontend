"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductClient from "@/components/product/ProductClient";

function ProductInner() {
  const params = useSearchParams();
  const slug = params.get("slug") || undefined;
  return <ProductClient slug={slug} />;
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-premium-base pt-24 flex items-center justify-center"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div><p className="mt-4 text-gray-700">Loading product...</p></div></div>}>
      <ProductInner />
    </Suspense>
  );
}
