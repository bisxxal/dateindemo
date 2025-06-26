'use client'
import { getVerified } from '@/actions/other.actions'
import Back from '@/components/ui/back'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FiLoader } from 'react-icons/fi'
import { VscVerified } from 'react-icons/vsc'

const VerifiedPage = () => {
  const [show, setShow] = useState(false)
  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await getVerified(formData)
    } catch (error) {

    }
    verified(formData);
  }
  const { mutate: verified, isPending, isError, data } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await getVerified(formData);
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        setShow(true)
        toast.success('User verified successfully')
      }
    },

    onError: (error, data) => {
      toast.error('Failed to verified user');
    },
  });


  return (
    <div className=' w-full h-screen overflow-hidden'>
      <Back url={'/profile'} className=' m-5' />
      {!show ? <div className="flex flex-col w-full items-center justify-center mt-20">
        <h1 className="text-3xl center gap-4 font-bold">Get verified! <VscVerified className=' text-green-500' /></h1>
        <p className="mt-4 text-gray-500 text-centertext-lg">get verified by entering your role no of your batch.</p>
        <p className="mt-2 text-gray-400 text-lg">This will help us to verify you.</p>

        <form action={handleSubmit} className='w-full flex flex-col items-center justify-center mt-10'>
          <input name='roll' required className='textbase uppercase border-2 outline-none bg-white/70 text-2xl px-5 max-md:px-3 my-10 w-[500px] max-md:w-[80%] max-md:text-base rounded-3xl h-14 max-md:h-12' type="text" placeholder=' eg : 232313bfjnvjewg3' />
          <button type='submit' className='w-[500px] center max-md:w-[80%] buttonbg2 text-white px-10 py-3 rounded-full text-xl'>
            {isPending ? <FiLoader className='text-xl animate-spin ' /> : 'verify'}</button>
        </form>

        {
          data?.status === 429 && <p className=' text-red-500 text-sm border border-red-500/30 w-[70%] mx-auto py-5 rounded-2xl center bg-red-500/20  mt-5'>{data?.message}</p>
        }
      </div>

        :
        <div className=' mt-[100px]  center flex-col gap-5'>
          <p className=' text-center text-green-500 text-3xl font-semibold'>Thanks for  verifying !</p>
          <p className=' text-gray-500'>We will review your roll no to verified you</p>
          <Link className=' textbase text-lg hover:underline  ' href={'/match'}>Continue Find your match.</Link>
        </div>
      }

    </div>
  )
}

export default VerifiedPage