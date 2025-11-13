import CardSection from '@/component/Cardsection'
import Footer from '@/component/Footer'
import Header from '@/component/Header'
import Hero from '@/component/Hero'
import Navbar from '@/component/Navbar'
import UserList from '@/component/userList'
import { Button } from '@/components/ui/button'
// Clerk imports removed
import React from 'react'

export default function page() {
  return (
    <div>

      <Hero />
      <div className="bg-warning text-warning-foreground" />

      <Button />
      <Navbar />
      <Header />
      <CardSection />
      <Footer />
      {/* Clerk auth UI removed. Add your own user/account UI here if needed. */}
    
      <UserList />

    </div>
  )
}

