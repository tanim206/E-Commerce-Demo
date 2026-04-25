"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  FaShoppingCart, 
  FaHeart, 
  FaStar, 
  FaRegStar,
  FaTshirt,
  FaTag,
  FaCube,
  FaStore,
  FaRuler,
  FaPalette,
  FaVenusMars,
  FaBoxes
} from "react-icons/fa";
import { useParams } from "next/navigation";

const ProductDetails = ({  }) => {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/add-products/${productId}`);
    
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#931115] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center bg-red-50 p-6 rounded-xl max-w-md">
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-red-700">Failed to load product</h3>
          <p className="text-red-500 text-sm mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#931115] text-white rounded-lg hover:bg-[#7a0e12] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  // Get all images (main + variant images)
  const allImages = [
    ...(product.images || []),
    ...(product.variants?.[selectedVariant]?.images || [])
  ];

  const currentVariant = product.variants?.[selectedVariant];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column - Images */}
        <div>
          {/* Main Image */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
            <img
              src={allImages[selectedImage] || product.thumbnail || "/placeholder-image.jpg"}
              alt={product.name}
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx 
                      ? "border-[#931115] shadow-md" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div>
          {/* Category & Brand */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
              <FaTag size={10} /> {product.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
              <FaStore size={10} /> {product.brand}
            </span>
            {product.is_featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-sm" />
              ))}
            </div>
            <span className="text-gray-500 text-sm">(128 reviews)</span>
            <span className="text-green-600 text-sm font-medium">In Stock</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            {product.discount_price ? (
              <div>
                <span className="text-3xl font-bold text-[#931115]">৳ {product.discount_price}</span>
                <span className="text-lg text-gray-400 line-through ml-2">৳ {product.price}</span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Save {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-[#931115]">৳ {product.price}</span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-gray-600 border-l-4 border-[#931115] pl-4 py-2 mb-6 italic">
            {product.short_description}
          </p>

          {/* Attributes */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-800">Product Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {product.attributes?.size && (
                <div className="flex items-center gap-2 text-sm">
                  <FaRuler className="text-gray-400" />
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium text-gray-800">{product.attributes.size}</span>
                </div>
              )}
              {product.attributes?.color && (
                <div className="flex items-center gap-2 text-sm">
                  <FaPalette className="text-gray-400" />
                  <span className="text-gray-600">Color:</span>
                  <span className="font-medium text-gray-800">{product.attributes.color}</span>
                </div>
              )}
              {product.attributes?.material && (
                <div className="flex items-center gap-2 text-sm">
                  <FaTshirt className="text-gray-400" />
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium text-gray-800">{product.attributes.material}</span>
                </div>
              )}
              {product.attributes?.gender && (
                <div className="flex items-center gap-2 text-sm">
                  <FaVenusMars className="text-gray-400" />
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium text-gray-800">{product.attributes.gender}</span>
                </div>
              )}
            </div>
          </div>

          {/* Variants Selection */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Select Variant</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedVariant(idx);
                      setSelectedImage(0);
                    }}
                    className={`px-4 py-2 border rounded-lg transition-all ${
                      selectedVariant === idx
                        ? "border-[#931115] bg-[#931115] text-white shadow-md"
                        : "border-gray-300 bg-white text-gray-700 hover:border-[#931115]"
                    }`}
                  >
                    {variant.attributes?.size} / {variant.attributes?.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock & SKU */}
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FaBoxes className="text-gray-400" />
              <span className="text-sm text-gray-600">Stock:</span>
              <span className="font-semibold text-gray-800">{currentVariant?.stock || product.stock} units</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCube className="text-gray-400" />
              <span className="text-sm text-gray-600">SKU:</span>
              <span className="font-semibold text-gray-800">{currentVariant?.sku || product.sku}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-[#931115] hover:bg-[#7a0e12] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300">
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300">
              <FaHeart className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-12">
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;