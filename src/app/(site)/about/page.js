import AboutHero from '@/components/about/AboutHero'
import Founder from '@/components/about/Founder'
import Numbers from '@/components/about/Numbers'
import Process from '@/components/about/Process'
import Values from '@/components/about/Values'
import CTA from '@/components/CTA'
import React from 'react'

function page() {
  return (
    <div className=''>
        <AboutHero/>
        <Founder/>
        <Numbers/>
        <Values/>
        <Process/>
        <CTA/>
    </div>
  )
}

export default page