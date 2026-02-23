import products from "../../../data/products";
import reviews from "../../../data/reviews";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts() {
  await wait(500);
  return Promise.resolve(products);
}

export async function getProductById(id) {
  await wait(500);
  const product = products.find((p) => p.id === Number(id));
  return Promise.resolve(product || null);
}

export async function getProductsByIds(ids) {
  await wait(500);
  const numericIds = ids.map(Number);
  const found = products.filter((p) => numericIds.includes(p.id));
  return Promise.resolve(found);
}

export async function getCategories() {
  await wait(500);
  const categories = [...new Set(products.map((p) => p.category))];
  return Promise.resolve(categories);
}

export async function getReviewsByProductId(productId) {
  await wait(500);
  const productReviews = reviews.filter(
    (r) => r.productId === Number(productId),
  );
  return Promise.resolve(productReviews);
}

export async function filterProducts({
  search = "",
  category = "",
  minPrice = 0,
  maxPrice = Infinity,
  sortBy = "title",
  sortOrder = "asc",
  page = 1,
  limit = 8,
} = {}) {
  await wait(500);
  let filtered = [...products];

  // Apply search
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower),
    );
  }

  // Apply category filter
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  // Apply price range filter
  filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "price":
        comparison = a.price - b.price;
        break;
      case "rating":
        comparison = a.rating - b.rating;
        break;
      case "title":
      default:
        comparison = a.title.localeCompare(b.title);
        break;
    }
    return sortOrder === "desc" ? -comparison : comparison;
  });

  // Calculate pagination AFTER filtering
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const data = filtered.slice(startIndex, startIndex + limit);

  return Promise.resolve({
    data,
    total,
    page,
    totalPages,
    limit,
  });
}
