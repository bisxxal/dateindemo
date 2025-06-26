'use client'
import Back from '@/components/ui/back'
import BlurText from '@/components/ui/blur-text'
import SignInButton from '@/components/ui/SignInButton'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const SignInPage = () => {
  const router = useRouter()
  async function myFunction() {
    const session = await getSession()
    if (session?.user?.name) {
      router.push('/profile')
    }
  }
  useEffect(() => {
    myFunction()
  }, [])
  return (
    <div className=' w-full  h-screen '>

      <Back url='/' className='m-4' />
      <div className='w-full h-full center flex-col '>
         <BlurText
            text="Date in"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-[200px] max-md:text-[90px]  max-md:mt-[30vh] textbase font-extrabold"
          />
          <SignInButton text={'Loging with google'} />
      </div>
    </div>
  )
}

export default SignInPage