"use client";
import { useState } from "react"
import { Product } from "../interfaces/product"
import Wrapper from "./Wrapper"
import Link from "next/link";

const Products = ({data}: {data: Product[]}) => {
  const [products,setProducts] = useState(data);

  async function del(id: number) {
    if(window.confirm('Confirm delete?')) {
      await fetch(`http://localhost:8000/api/products/${id}`,{method: 'delete'})
      setProducts(prev => prev.filter(p => p.id != id))
    }
  }
  
  return (
    <Wrapper>
      <div className="table-responsive small">
        <div className="pt-3 pb-2 mb-3 border-bottom">
          <div className="btn-toolbar mb-2 mb-md-0">
            <Link href='/admin/products/create' className="btn btn-sm btn-outline-secondary">Add</Link>
          </div>
        </div>

        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image url</th>
              <th scope="col">Title</th>
              <th scope="col">Likes</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p,i) =>
              <tr key={i}>
                <td>{p.id}</td>
                <td>{p.image}</td>
                <td>{p.title}</td>
                <td>{p.likes}</td>
                <td>
                  <div className="btn-group mr-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                    <a href="#" className="btn btn-sm btn-outline-secondary"
                      onClick={()=>del(p.id)}
                    >Delete</a>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Wrapper>
  )
}

export default Products
