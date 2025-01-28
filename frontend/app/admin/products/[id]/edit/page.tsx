import ProductsEdit from "@/src/admin/components/ProductsEdit"
import { Product } from "@/src/interfaces/product";

export default async function Page({ params }: { params: Promise<{id: string}> }) {
  const { id } = await params
  const data: Product = await (await fetch(`http://localhost:8000/api/products/${id}`)).json();
  
  return (
    <ProductsEdit data={data} />
  )
}
