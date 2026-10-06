import type { MetadataRoute } from "next";

// Produto interno da MRV: não disputa com as páginas oficiais em mrv.com.br.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
