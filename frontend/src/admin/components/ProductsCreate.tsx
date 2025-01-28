'use client';
import { SyntheticEvent, useState } from 'react'
import Wrapper from '../Wrapper'
import { redirect } from 'next/navigation'

const ProductsCreate = () => {
  const [title,setTitle] = useState('')
  const [image,setImage] = useState('')

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault()
    await fetch('http://localhost:8000/api/products',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({title,image})
    })
    redirect('/admin/products')
  }

  return (
    <Wrapper>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input type='text' className='form-control' name='title'
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Image</label>
          <input type='text' className='form-control' name='image'
            onChange={e => setImage(e.target.value)}
          />
        </div>
        <button className='btn btn-outline-secondary'>Save</button>
      </form>
    </Wrapper>
  )
}

export default ProductsCreate
