import ContactComp from '../components/contact/ContactComp'
import ContactHero from '../components/contact/ContactHero'
import FAQ from '../components/contact/FAQ'
import Features from '../components/contact/Features'
import React from 'react'

function page() {
  return (
    <div>
        <ContactHero/>
        <ContactComp/>
        <Features/>
        <FAQ/>
    </div>
  )
}

export default page