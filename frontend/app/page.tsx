import Main from "@/src/main/Main";
import { Product } from '@/src/interfaces/product';

export default async function Home() {
  const res = await fetch('http://localhost:8001/api/products')
  const data: Product[] = await res.json()

  return (
    <div className='App'>
      <Main data={data} />
    </div>
  );
}
