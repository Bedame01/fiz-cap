export function getShopifyProductId(globalId: string) {
  const segments = globalId.split("/")
  return segments.pop() ?? globalId
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number.parseFloat(amount))
}
