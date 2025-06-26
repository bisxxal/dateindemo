'use client'
import { PopUpPropsExtended } from "@/util/constant";
import { AiOutlineHome } from "react-icons/ai";
import { LuLanguages } from "react-icons/lu";
import { LuUniversity } from "react-icons/lu";
import { BsBuildings } from "react-icons/bs";
import { MdOutlineInterests, MdKeyboardDoubleArrowDown } from "react-icons/md";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { RiVerifiedBadgeLine } from "react-icons/ri";
const KeywordButton = dynamic(() => import("./ui/keywordButton"), { ssr: false });
const AnimatedSwipe = dynamic(() => import("./ui/animatedSwipe"), { ssr: false });

const PopUp = ({ current, displayed, setDisplayed, user }: PopUpPropsExtended) => {

  return (
    <motion.div key="details-panel"
      initial={{ y: 500, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 500, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="text-white h-[80vh] shadow-xl absolute z-[20] border-t border-white/70 bg-[#0000002e] py-3 backdrop-blur-[10px] justify-between w-[450px] max-md:w-[95%] mt-4 px-5 bottom-0 pt-[5px] rounded-3xl flex">

      <div className="  flex text-lg flex-col gap-5 w-full  rounded-3xl scrollbar overflow-y-auto">
        <button onClick={() => setDisplayed(!displayed)} className={` ${displayed ? ' flex ' : ' hidden '} w-1/2 text-white mx-auto center cursor-pointer  w-14 h-14   text-3xl `}>
          <AnimatedSwipe text={<MdKeyboardDoubleArrowDown size={23} />} /> </button>

        <div className="mb-5 center gap-3">
          <h1 className=" text-3xl max-md:text-2xl center font-bold">{current.name}  {current.verified === true && <span className=" text-2xl ml-1 text-green-600"><RiVerifiedBadgeLine /></span>}  </h1> <span className=" font-bold max-md:text-xl text-2xl"> , {current.profile.age}</span>
        </div>

        {current.profile.bio && <div className="  glass4  px-6 max-md:px-5 py-3">
          <p className=" font-semibold text-xl">About Me</p>
          <h1 className=" mt-2 text-sm ">{current.profile.bio}</h1>
        </div>}

        {current.profile.lookingFor && <div className=" glass4  px-6 max-md:px-5 py-3">
          <p>Looking for</p>
          <h1 className=" text-base ">{current.profile.lookingFor} </h1>
        </div>}

        {current.profile.livingIn && <div className=" glass4  px-6 max-md:px-5 py-3">
          <p className=" center gap-2 mb-2 !justify-start"> <AiOutlineHome size={22} /> Living in </p>
          <h1 className=" text-base ">{current.profile.livingIn}</h1>
        </div>
        }

        {current.profile.age && <div className=" glass4  px-6 max-md:px-5 py-3">
          <p>Age</p>
          <h1 className=" text-base ">{current.profile.age}</h1>
        </div>
        }

        {current.profile.batch && <div className=" glass4  px-6 max-md:px-5 py-3">
          <p className=" center gap-2 mb-2 !justify-start"><LuUniversity size={21} />Batch</p>
          <h1 className=" text-base ">{current.profile.batch}</h1>
        </div>}

        {current.profile.job && <div className=" glass4  px-6 max-md:px-5 py-3">
          <p className=" center gap-2 mb-2 !justify-start"><BsBuildings size={18} />Working at</p>
          <h1 className=" text-base ">{current.profile.job}</h1>
        </div>}
        {current.profile.height && current.profile.height >= 18 && <div className=" glass4  px-6 max-md:px-5 py-3">
          <p >Height</p>
          <h1 className=" text-base ">{current.profile.height}</h1>
        </div>}
        {current.profile.languages && <div className=" glass4  px-6 max-md:px-5 py-3">
          <p className=" center gap-2 mb-2 !justify-start"><LuLanguages size={22} />Language</p>
          <h1 className=" text-base ">{current.profile.languages}</h1>
        </div>}

        <div className=" glass4  px-6 max-md:px-5 py-3">
          <p className="flex items-center gap-3 my-2 "><MdOutlineInterests size={21} /> Interests</p>
          <KeywordButton current={current} user={user} />
        </div>
        <Link href={`/report/${current.id}?userid=${user.id}`} className=" bg-[#b34d4d9c] block my-4 border border-red-500 rounded-3xl px-5 py-4 ">
          <p className=" text-center ">Block & Report {current.name}</p>
        </Link>

      </div>
    </motion.div>
  )
}
export default PopUp;