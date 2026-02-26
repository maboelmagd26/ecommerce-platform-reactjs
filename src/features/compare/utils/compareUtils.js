export default function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
export function categoryMatch(productA, productB) {
  return productA?.category === productB?.category;
}
