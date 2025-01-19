import Products from "@/src/admin/Products";
import { Product } from "@/src/interfaces/product";

export default async function Page() {
  const res = await fetch('http://localhost:8000/api/products')
  const data: Product[] = await res.json()
  
  return (
    <div className='App'>
      <Products data={data}/>
    </div>
  );
}
