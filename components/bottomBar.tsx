'use client'
import { RiHome2Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Dock from './ui/docs';
import { FaUserGroup } from "react-icons/fa6";
const BottomBar = () => {
  const router = useRouter()

  const items = [
    { icon: <RiHome2Line className=" text-black/50" size={18} />, label: 'Match', onClick: () => router.push(`/match`) },
    { icon: <FaUserGroup className=" text-black/50" size={18} />, label: 'Group', onClick: () => router.push(`/group`) },
    { icon: <IoChatbubbleOutline className=" text-black/50" size={18} />, label: 'Chat', onClick: () => router.push(`/chat`) },
    { icon: <FaRegUser className=" text-black/50" size={18} />, label: 'Profile', onClick: () => router.push(`/profile`) },
  ];
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  return (
    <div className='  fixed bottom-[15px] max-md:bottom-[10px]    z-[100] left-[5%]  flex justify-center px-3    w-[90%] h-[60px]  rounded-3xl '>
     <Dock
        className=' glass2   shadow-xl  '
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={ isMobile ? 50 : 100 }
      />
    </div>

  )
}

export default BottomBar