
import { PopUpProps } from '@/util/constant';
import React from 'react'

const KeywordButton = ({ current, user }: PopUpProps) => {
  return (
    <div className="text-base max-md:text-sm my-4 font-light flex flex-wrap">
      {current?.profile?.keywords?.map((i: { name: string }, index: number) => {
        const isMatch = user?.profile?.keywords?.some((u: { name: string }) => u.name.toLowerCase() === i.name.toLowerCase());
        return (
          <span key={index}
            className={`${isMatch ? "rounded-full bg-ra dial buttonbg2 from-pink-400  from-40% to-fuchsia-700  text-white border-red-500"
                : "bg-white/10 border border-white/40"} backdrop-blur-[8px]  px-3 py-1.5 center  rounded-full mr-2 mb-1`}>
            {i.name}
          </span>
        );
      })}
    </div>
  )
}

export default KeywordButton