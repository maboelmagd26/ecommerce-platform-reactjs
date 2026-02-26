import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../features/products/services/productService";
import useCartStore from "../features/cart/hooks/useCartStore";
import useWishlistStore from "../features/wishlist/hooks/useWishlistStore";
import useCompareStore from "../features/compare/hooks/useCompareStore";
import { Scale } from "lucide-react";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const addToCart = useCartStore((s) => s.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const { isInCompareList, removeFromCompareList, addToCompareList } =
    useCompareStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const p = await getProductById(id);
      setProduct(p);
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    // Initialize countdown in seconds
    const now = Date.now();
    const offerEndsAt = now + 2 * 24 * 60 * 60 * 1000; // 2 days from now
    let remainingSeconds = Math.floor((offerEndsAt - now) / 1000);

    // Set initial value via setTimeout to avoid synchronous setState in effect
    const initTimeout = setTimeout(() => setCountdown(remainingSeconds), 0);

    const interval = setInterval(() => {
      remainingSeconds -= 1;
      if (remainingSeconds <= 0) {
        setCountdown(0);
        clearInterval(interval);
      } else {
        setCountdown(remainingSeconds);
      }
    }, 1000);

    return () => {
      clearTimeout(initTimeout);
      clearInterval(interval);
    };
  }, []);

  const formatCountdown = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds <= 0) return null;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${
            i <= Math.round(rating)
              ? "text-amber-400 fill-current"
              : "text-gray-300 fill-current"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h2>
        <Link
          to="/products"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  const time = formatCountdown(countdown);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to="/products"
          className="hover:text-primary-600 transition-colors"
        >
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-500">
              ({product.rating} rating)
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900 mb-6">
            ${product.price.toFixed(2)}
          </div>

          {/* Offer Countdown */}
          {time && (
            <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <p className="text-sm font-medium text-amber-800 mb-3">
                🔥 Limited Time Offer — Ends In:
              </p>
              <div className="flex gap-3">
                {[
                  { value: time.days, label: "Days" },
                  { value: time.hours, label: "Hours" },
                  { value: time.minutes, label: "Min" },
                  { value: time.seconds, label: "Sec" },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="text-center bg-white rounded-xl px-3 py-2 shadow-sm min-w-15"
                  >
                    <div className="text-xl font-bold text-gray-900">
                      {String(unit.value).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500">{unit.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                product.stock > 10
                  ? "bg-emerald-500"
                  : product.stock > 0
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="flex-1 px-6 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={() =>
                isInWishlist(Number(id))
                  ? removeFromWishlist(Number(id))
                  : addToWishlist(product)
              }
              className={`px-4 py-3.5 rounded-xl border-2 transition-all ${
                isInWishlist(Number(id))
                  ? "border-accent-500 text-accent-500 bg-accent-400"
                  : "border-gray-200 text-gray-400 hover:border-accent-300 hover:text-accent-500"
              }`}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              aria-label={`${isInCompareList(product.id) ? "Remove from" : "Add to"} compare list`}
              onClick={(e) => {
                e.preventDefault();
                isInCompareList(product.id)
                  ? removeFromCompareList(product.id)
                  : addToCompareList(product);
              }}
              className={`px-4 py-3.5 rounded-xl border-2 transition-all ${
                isInCompareList(product.id)
                  ? "border-blue-600 text-blue-800 bg-blue-300"
                  : "border-gray-200 text-gray-400 hover:text-amber-500"
              }`}
            >
              <Scale className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Reviews Placeholder — Student task to implement */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Customer Reviews
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                Reviews will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
