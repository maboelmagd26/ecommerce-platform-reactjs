import { Scale } from "lucide-react";
import { useState, useEffect } from "react";
import { getProducts } from "../features/products/services/productService";
import useCompareStore from "../features/compare/hooks/useCompareStore";

import deepEqual, {
  categoryMatch,
} from "../features/compare/utils/compareUtils";
export default function ComparePage() {
  const [products, setProducts] = useState([]);
  const [selectedProductA, setSelectedProductA] = useState("");
  const [selectedProductB, setSelectedProductB] = useState("");
  const { compareList, removeFromCompareList, addToCompareList } =
    useCompareStore();

  useEffect(() => {
    async function load() {
      const allProducts = await getProducts();
      setProducts(allProducts);
    }
    load();
  }, []);

  const productA = products.find(
      (p) => p.id === Number(selectedProductA || compareList[0]?.id),
    ),
    productB = products.find(
      (p) => p.id === Number(selectedProductB || compareList[1]?.id),
    );

  const comparisonFields = [
    { label: "Price", key: "price", format: (v) => `$${v?.toFixed(2) || "-"}` },
    { label: "Category", key: "category", format: (v) => v || "-" },
    { label: "Rating", key: "rating", format: (v) => (v ? `${v} / 5` : "-") },
    {
      label: "Stock",
      key: "stock",
      format: (v) => (v != null ? `${v} units` : "-"),
    },
  ];

  const metricPreference = {
    price: "lower",
    rating: "higher",
    stock: "higher",
  };

  function getMetricCellClass(fieldKey, valueA, valueB, side) {
    if (!(fieldKey in metricPreference)) return "text-gray-800 bg-white";
    if (valueA == null || valueB == null) return "text-gray-800 bg-white";
    if (valueA === valueB) return "text-gray-800 bg-gray-50";

    const aIsBetter =
      metricPreference[fieldKey] === "lower"
        ? valueA < valueB
        : valueA > valueB;
    const isBetterCell = side === "a" ? aIsBetter : !aIsBetter;

    return isBetterCell ? "text-green-700" : "text-red-700";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
        <p className="text-gray-500 mt-1">
          Select two products to compare them side by side
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <div className="flex justify-between items-start">
            <label
              htmlFor="product-A"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Product A
            </label>
            <button
              onClick={() => {
                removeFromCompareList(compareList[0]?.id);
                setSelectedProductA(selectedProductB || "");
                setSelectedProductB("");
              }}
              className={`ml-2 text-md hover:text-red-700 text-red-500 focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-red-500 rounded-md ${!selectedProductA && !compareList[0] ? "hidden" : "block"}`}
            >
              Clear
            </button>
          </div>
          <select
            id="product-A"
            value={selectedProductA || compareList[0]?.id || ""}
            onChange={(e) => {
              const selectedProd = products.find(
                (p) => p.id === Number(e.target.value),
              );
              if (productB && deepEqual(selectedProd, productB)) {
                alert(
                  "Cannot compare the same product. Please select a different product.",
                );
                return;
              }
              if (productB && !categoryMatch(selectedProd, productB)) {
                alert("Cannot compare products from different categories.");
                return;
              }
              setSelectedProductA(e.target.value);
              addToCompareList(
                products.find((p) => p.id === Number(e.target.value)),
              );
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">Select a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex justify-between items-start">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product B
            </label>
            <button
              onClick={() => {
                removeFromCompareList(compareList[1]?.id);
                setSelectedProductB("");
              }}
              disabled={!selectedProductB && !compareList[1]}
              className={`ml-2 text-md hover:text-red-700 text-red-500 focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-red-500 rounded-md disabled:text-gray-300 ${!selectedProductB && !compareList[1] ? "hidden" : "block"}`}
            >
              Clear
            </button>
          </div>
          <select
            value={selectedProductB || compareList[1]?.id || ""}
            disabled={!selectedProductA && !compareList[0]}
            onChange={(e) => {
              const selectedProd = products.find(
                (p) => p.id === Number(e.target.value),
              );
              if (productA && deepEqual(selectedProd, productA)) {
                alert(
                  "Cannot compare the same product. Please select a different product.",
                );
                return;
              }
              if (productA && !categoryMatch(selectedProd, productA)) {
                alert("Cannot compare products from different categories.");
                return;
              }
              setSelectedProductB(e.target.value);
              addToCompareList(selectedProd);
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">Select a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {productA || productB ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 border-b border-gray-100">
            <div className="p-4 bg-gray-50 font-medium text-sm text-gray-500">
              Feature
            </div>
            <div className="p-4 text-center border-l border-gray-100">
              {productA ? (
                <div>
                  <img
                    src={productA.thumbnail}
                    alt={productA.title}
                    className="w-20 h-20 object-cover rounded-xl mx-auto mb-2"
                  />
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {productA.title}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-8">Select Product A</p>
              )}
            </div>
            <div className="p-4 text-center border-l border-gray-100">
              {productB ? (
                <div>
                  <img
                    src={productB.thumbnail}
                    alt={productB.title}
                    className="w-20 h-20 object-cover rounded-xl mx-auto mb-2"
                  />
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {productB.title}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-8">Select Product B</p>
              )}
            </div>
          </div>

          {comparisonFields.map((field) => {
            const valueA = productA?.[field.key];
            const valueB = productB?.[field.key];
            const cellAClass = getMetricCellClass(
              field.key,
              valueA,
              valueB,
              "a",
            );
            const cellBClass = getMetricCellClass(
              field.key,
              valueA,
              valueB,
              "b",
            );

            return (
              <div
                key={field.key}
                className="grid grid-cols-3 border-b border-gray-50 last:border-0"
              >
                <div className="p-4 bg-gray-50 text-sm font-medium text-gray-600">
                  {field.label}
                </div>
                <div
                  className={`p-4 text-center text-sm border-l border-gray-100 ${cellAClass}`}
                >
                  {productA ? field.format(productA[field.key]) : "-"}
                </div>
                <div
                  className={`p-4 text-center text-sm border-l border-gray-100 ${cellBClass}`}
                >
                  {productB ? field.format(productB[field.key]) : "-"}
                </div>
              </div>
            );
          })}

          <div className="grid grid-cols-3 border-t border-gray-100">
            <div className="p-4 bg-gray-50 text-sm font-medium text-gray-600">
              Description
            </div>
            <div className="p-4 text-sm text-gray-600 border-l border-gray-100 leading-relaxed">
              {productA?.description || "-"}
            </div>
            <div className="p-4 text-sm text-gray-600 border-l border-gray-100 leading-relaxed">
              {productB?.description || "-"}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <svg
            className="w-20 h-20 text-gray-200 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Select Products to Compare
          </h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Choose two products from the dropdowns above to see a detailed
            side-by-side comparison.
          </p>
        </div>
      )}
    </div>
  );
}
