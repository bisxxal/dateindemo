'use client';
import { CiLock } from "react-icons/ci";
import { motion } from "framer-motion";
import Link from "next/link";
import moment from "moment";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { dummyMessages, dummyUserId } from "@/util";
const GroupPage = () => {
  const isVerified = true;
 
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className=" w-full relative h-screen overflow-hidden">
      {!isVerified ?
        <>
          <div className=" w-[90%] glass mt-5 h-[60px] left-[5%] center !justify-between px-4 fixed ">
            <Link href={'/match'} className=" text-xl textbas logo font-semibold">Date in.</Link>
            <h1 className="logo4 font-semibold text-base ">Group Chat</h1>
          </div>
          <div className=" w-full h-full">

            {/* <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                className=" w-full h-full center flex-col gap-10">
                <h1 className="textbase text-3xl font-semibold">Group Chat</h1>
                <p className=" text-gray-500">Welcome to the group chat! Here you can interact with other verified users.</p>
            </motion.div> */}

            <div className='  bg-[url(/bg2.png)] bg-cover flex flex-col mt-[70px]  mx-auto max-w-2xl rounded-2xl max-md:border-none max-md:shadow-none border border-black/10 shadow-xl p-2  w-full max-md:h-[83vh] h-[80vh]'>
              <div className=" w-full overflow-y-auto space-y-3 flex flex-col !justify-between rounded-2xl h-[75vh] max-md:h-[76vh] ">
                <div>
                  {dummyMessages?.map((msg) => (
                    <div className="flex items-center gap-1 " key={msg.id}>
                      {msg.senderId !== dummyUserId && <div className="rounded-full h-12 w-12 border-black/30 border">
                      </div>}
                      <div
                        className={`max-w-[80%] shadow-xl mt-3 w-fit py-1.5 overflow-hidden flex flex-col flex-wrap text-base font-normal px-5  ${msg.senderId === dummyUserId ? 'bg-blue-60 buttonbg2 text-white rounded-b-2xl rounded-l-2xl ml-auto '
                            : 'bg-gray-10 sidebarbg text-black/60 rounded-b-2xl rounded-r-2xl'
                          }`}
                      >
                        <p className=' max-w-[99%]'>{msg.content}</p>
                        <p className="text-xs opacity-70 mt- text-right">
                          {moment(msg.createdAt).format('LT')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className=" flex justify-between  glass overflow-hidden max-md:pr-[2px] rounded-3xl">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2 w-[96%] focus:outline-none"
                    placeholder="Type a message..."
                  />
                  <button
                    disabled={!newMessage}
                    className={` ${!newMessage && " opacity-[0.5] "} base text-white px-5 max-md:px-2 rounded-3xl center  hover:bg-blue-700 `}>
                    send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>

        : <div className=" w-full center gap-20 flex-col h-full" >
          <p className=" text-gray-500 ">Only Verified Person can access Group chat</p>

          <div className=" center">
            <div className=" relative border   text-white text-xs  px-6 py-3  ">
              <div className=" h-[200px] blur-[2px] w-[200px] absolute  -left-9 -top-11 rounded-full !duration-700  center backdrop-blur-[10px] buttonbg  animate-ping  "></div>
              <div className=" h-[140px] blur-[2px] w-[140px]  absolute  -top-4  -left-1.5  rounded-full !duration-700  center backdrop-blur-[10px] delay-1  buttonbg animate-ping  "></div>
              <div className=" h-[80px] w-[80px]  shadow-xl  top-15 left-15 rounded-full !duration-700  center backdrop-blur-[10px] bg-blue-60 buttonbg   ">
                <CiLock className=" text-3xl text-blue-800" />
              </div>
            </div>
          </div>

          <Link href={'/verified'} className="buttonbg2  shadow-xl rounded-full cursor-pointer p-5 py-2 mt-20 textbase font-semibold">Verify your account</Link>
        </div>
      }
    </div>
  )
}

export default GroupPage