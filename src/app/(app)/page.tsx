import Featured from '@/Components/Featured'
import FeaturedTopics from '@/Components/FeaturedTopics'
import BestGuide from '@/Components/Guide'
import HomeContent from '@/Components/HomeContent'
import LatestReview from '@/Components/LatestReview'
import MedicalExpertBoard from '@/Components/MedicalExpert'
import ProductCategories from '@/Components/ProductCategory'
import TopPicks from '@/Components/TopPicks'
import React from 'react'

export default function page() {
  return (
    <>
    <HomeContent/>
    <ProductCategories/>
    <Featured/>
    <BestGuide/>
    <TopPicks/>
    <LatestReview/>
    <MedicalExpertBoard/>
    <FeaturedTopics/>
    </>
  )
}
