import { useState, useEffect } from "react";
import {
  filterProducts,
  getCategories,
} from "../features/products/services/productService";
import ProductCard from "../features/products/components/ProductCard";

import { useSearchParams } from "react-router-dom";
export default function ProductsPage() {
  // Server States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    limit: 8,
    page: 1,
  });
  // Persist filters/sorting/pagination in URL search params
  const [searchParams, setSearchParams] = useSearchParams({});
  const searchFromParams = searchParams.get("search") || "";
  const categoryFromParams = searchParams.get("category") || "";
  const sortByFromParams = searchParams.get("sortBy") || "title";
  const sortOrderFromParams = searchParams.get("sortOrder") || "asc";
  const pageFromParams = parseInt(searchParams.get("page")) || 1;
  // helper to update search params
  const updateParams = (updates, replace = false) => {
    setSearchParams(
      (searchParams) => {
        Object.entries(updates).forEach(([key, value]) => {
          value !== null
            ? searchParams.set(key, value)
            : searchParams.delete(key);
        });
        return searchParams;
      },
      { replace },
    );
  };
  // handlers
  const handleSearchChange = (e) => {
    // remove history for search queries to avoid cluttering back button
    updateParams({ search: e.target.value || null }, { replace: true });
  };

  const handleCategoryChange = (e) => {
    updateParams({ category: e.target.value || null });
  };

  const handleSortChange = (e) => {
    updateParams({
      sortBy: e.target.value.split("-")[0] || null,
      sortOrder: e.target.value.split("-")[1] || null,
    });
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await filterProducts({
        search: searchFromParams,
        category: categoryFromParams,
        sortBy: sortByFromParams,
        sortOrder: sortOrderFromParams,
        page: pageFromParams,
        limit: pagination.limit,
      });
      setProducts(result.data);
      setPagination((prev) => ({
        ...prev,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit: result.limit,
      }));
      const cats = await getCategories();
      setCategories(cats);
      // Simulate a short loading time so the spinner is visible
      setTimeout(() => setLoading(false), 600);
    }
    load();
  }, [
    searchFromParams,
    categoryFromParams,
    sortByFromParams,
    sortOrderFromParams,
    pageFromParams,
    pagination.limit,
  ]);

  //// Basic client-side pagination (not using filterProducts — student task)
  const { totalPages, total } = pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-500">
          Browse our collection of {total} premium products
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchFromParams}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFromParams}
            onChange={handleCategoryChange}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortByFromParams}-${sortOrderFromParams}`}
            onChange={handleSortChange}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="title-asc">Name: A → Z</option>
            <option value="title-desc">Name: Z → A</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating-desc">Rating: Best First</option>
          </select>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  handlePageChange(Math.max(1, pageFromParams - 1))
                }
                disabled={pageFromParams === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      pageFromParams === pageNum
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, pageFromParams + 1))
                }
                disabled={pageFromParams === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
