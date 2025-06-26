'use client'
import Back from '@/components/ui/back'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const SettingPage = () => {
    return (
        <div className=' w-full p-10'>
            <Back url='/profile' className='' />
            <h2 className=' font-bold text-2xl mb-10'>Account Settings</h2>

            <div className=' flex flex-col gap-4'>
                <div className='p-3 px-6 center !justify-between  bg-[#00000014] border border-black/10 backdrop-blur-[10px]  rounded-xl '>
                    <h1>Interested in </h1>

                    <select name="" >
                        <option value="women">Women</option>
                        <option value="men">men</option>
                    </select>
                </div>



                <div className='p-3 px-6 center !justify-between  bg-[#00000014] border border-black/10 backdrop-blur-[10px]  rounded-xl '>
                    <h1>Block contacts</h1>
                </div>
                <div className='p-3 px-6 center !justify-between  bg-[#00000014] border border-black/10 backdrop-blur-[10px]  rounded-xl '>
                    <Link className=' textbase' href={'/report'}>Report spam</Link>
                </div>
                <div>
                    <div className='p-3 px-6 center !items-start !justify-between flex-col bg-[#00000014] border border-black/10 backdrop-blur-[10px] gap-3 rounded-xl '>
                        <h1 className='textbase font-semibold'>Contact Us</h1>
                        <p>Help & support</p>
                    </div>
                </div>
                <div>
                    <div className='p-3 px-6 center !items-start !justify-between flex-col bg-[#00000014] border border-black/10 backdrop-blur-[10px] gap-3 rounded-xl '>
                        <h1 className='textbase font-semibold'>Privacy</h1>
                        <p>Cookie policy</p>
                        <p>Privacy Policy</p>
                        <p>Privacy preferences</p>
                    </div>
                </div>
                <div>
                    <div className='p-3 px-6 center !items-start !justify-between flex-col bg-[#00000014] border border-black/10 backdrop-blur-[10px] gap-3 rounded-xl '>
                        <h1 className='textbase font-semibold'>Legal</h1>
                        <p>Terms of service</p>
                    </div>
                </div>

                <div>
                    <div className='p-3 px-6 center !justify-between  bg-[#00000014] border border-black/10 backdrop-blur-[10px]  rounded-xl '>
                        <h1 className='textbase font-semibold'>Share date in</h1>
                    </div>
                </div>

                <button className=" rounded-full buttonred p-6 py-4" onClick={() => signOut()}>Sign Out</button>

            </div>
        </div>
    )
}

export default SettingPage