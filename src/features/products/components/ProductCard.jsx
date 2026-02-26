import { Link } from "react-router-dom";
import useCartStore from "../../cart/hooks/useCartStore";
import useWishlistStore from "../../wishlist/hooks/useWishlistStore";
import useCompareStore from "../../compare/hooks/useCompareStore";
import { Scale } from "lucide-react";
export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const { isInCompareList, removeFromCompareList, addToCompareList } =
    useCompareStore();
  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-amber-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      } else if (i === full && hasHalf) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${product.id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${product.id})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>,
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-300 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      }
    }
    return stars;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary-100 transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link
        to={`/products/${product.id}`}
        className="relative overflow-hidden aspect-square bg-gray-50"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        {/* Wishlist button */}
        <button
          aria-label={`${isInWishlist(product.id) ? "Remove from" : "Add to"} wishlist`}
          onClick={(e) => {
            e.preventDefault();
            isInWishlist(product.id)
              ? removeFromWishlist(product.id)
              : addToWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${
            isInWishlist(product.id)
              ? "bg-accent-500 text-white"
              : "bg-white/90 text-gray-400 hover:text-accent-500"
          }`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* Comparison button */}
        <button
          aria-label={`${isInCompareList(product.id) ? "Remove from" : "Add to"} compare list`}
          onClick={(e) => {
            e.preventDefault();
            isInCompareList(product.id)
              ? removeFromCompareList(product.id)
              : addToCompareList(product);
          }}
          className={`absolute bottom-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${
            isInCompareList(product.id)
              ? "bg-black text-yellow-400"
              : "bg-gray-500 text-white hover:text-amber-500"
          }`}
        >
          <Scale className="w-5 h-5 fill-current" />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-1">
          {product.category}
        </span>
        <Link
          to={`/products/${product.id}`}
          className="text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2 mb-2"
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
