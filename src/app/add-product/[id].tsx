// app/products/edit/[slug]/page.tsx (For Edit Product)
import ProductForm from "@/components/ProductForm";
// import { getProductBySlug } from "@/lib/api";

export default async function EditProductPage({ params }: { params: { slug: string } }) {
  // Fetch product data from your API
//   const productData = await [];
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product information and specifications</p>
      </div>
      
      {/* <ProductForm 
        initialData={productData}
        isEdit={true}
        onSubmit={async (data) => {
          // Custom submit handler
          await fetch(`/api/products/${params.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        }}
      /> */}
    </div>
  );
}