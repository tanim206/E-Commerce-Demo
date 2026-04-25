// app/products/add/page.tsx (For Add Product)
import ProductForm from "@/components/ProductForm";

export  default function AddProductPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">Create a new product with detailed information and specifications</p>
      </div>
      <ProductForm />
    </div>
  );
}