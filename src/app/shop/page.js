import Filters from '@/components/shop/Filters'
import ShopHero from '@/components/shop/ShopHero'
import ShopProducts from '@/components/shop/ShopProducts'
import React from 'react'

function page() {
  return (
    <div className="bg-white">
        <ShopHero/>
        <Filters/>
        <ShopProducts/>
    </div>
  )
}

export default page
