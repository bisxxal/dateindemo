"use client";
import React, { useEffect, useState } from "react";
import SwiperComponent from "./ui/swiper";
import { MdOutlineRefresh, MdOutlineInterests, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSwipe from "./ui/animatedSwipe";
import KeywordButton from "./ui/keywordButton";
import { likeUser } from "@/actions/user.action";
import { AllPublicUsers } from '@/actions/match';
import { useQuery } from '@tanstack/react-query';
import LoadingCom from "./ui/loading";
import { FcLike } from "react-icons/fc";
import { shuffleArray } from "@/util/algoLogic";
import LookingFor from "./ui/lookingFor";
import dynamic from 'next/dynamic';
import { FiLoader } from "react-icons/fi";
import { useSocket } from "@/hooks/useSocket";
import { RiVerifiedBadgeLine } from "react-icons/ri";

const PopUp = dynamic(() => import('./popUpCard'), {
  loading: () => <div className="text-white">  <FiLoader className='text-lg mt-5 animate-spin ' /> </div>,
  ssr: false,
});
const TinderCardsCom = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, data } = useQuery({
    queryKey: ['fetchUsers', currentPage],
    queryFn: async () => await AllPublicUsers(currentPage),
    staleTime: Infinity,
  });

  const person = data?.shuffled || [];
  const user = data?.user;
  const [isPaginating, setIsPaginating] = useState(false);
  const { onlineUser }: { onlineUser: string[] } = useSocket({ userId: user?.id });
  const [shuffledPerson, setShuffledPerson] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [matchMessage, setMatchMessage] = useState<string | null>(null);
  const [displayed, setDisplayed] = useState(false);
  const [showPing, setShowPing] = useState(false);

  const current = index >= 0 && index < shuffledPerson.length ? shuffledPerson[index] : null;

  // On data load, set shuffled array
  useEffect(() => {
    if (person.length > 0) {
      const shuffled = shuffleArray(person);
      setShuffledPerson(shuffled);
      setIndex(shuffled.length - 1);
    }
  }, [person]);

  const handleSwipe = async (dir: "left" | "right") => {
    if (!current || index < 0) return;
    setDirection(dir);

    if (dir === "left") {
      setShowPing(true);
      const res = await likeUser(current.id);
      setShowPing(false);
      if (res?.status === "matched") {
        setMatchMessage(`🎉 It's a match with ${current.name}!`);
        setTimeout(() => {
          setMatchMessage(null);
          setIndex((prev) => prev - 1);
          setDirection(null);
        }, 2500);
        return;
      }
    }

    setTimeout(() => {
      setIndex((prev) => prev - 1);
      setDirection(null);
    }, 300);
  };

  const handleBack = () => {
    if (index < shuffledPerson.length - 1) {
      setDirection(null);
      setIndex((prev) => prev + 1);
    }
  };

  const getExitX = () => {
    if (direction === "left") return -700;
    if (direction === "right") return 700;
    return 0;
  };

  const totalPages = Math.ceil((data?.total || 0) / 15);

  useEffect(() => {
    const shouldPaginate = index < 0 && person.length > 0 && currentPage < totalPages;
    const shouldReshuffle = index < 0 && person.length > 0 && currentPage >= totalPages;

    if (shouldPaginate && !isPaginating) {
      // console.log("➡️ Fetching next page...");
      setIsPaginating(true);
      setCurrentPage((prev) => prev + 1);
    }

    if (shouldReshuffle && !isPaginating) {
      // console.log("🔄 Reshuffling cards...");
      setIsPaginating(true);
      // console.log("person in n", person,)
      const timeout = setTimeout(() => {
        const reshuffled = shuffleArray(person);
        setShuffledPerson(reshuffled);
        setIndex(reshuffled.length - 1);
        setIsPaginating(false);
      }, 500);
      return () => clearTimeout(timeout);
      // setCurrentPage(1);
    }

    // Reset pagination guard once new data arrives
    if (index >= 0 && isPaginating) {
      setIsPaginating(false);
    }
  }, [index, person, currentPage, totalPages, isPaginating]);

  return (
    <div className="flex flex-col relative items-center mt-7 max-md:mt-2 space-y-6 w-full">

      {!isLoading && <div className=" w-[380px] bottombaranimation absolute rounded-3xl top-4 bg-[#0000001f] h-[80vh] max-md:w-[90%]"></div>}

      {isLoading && <LoadingCom boxes={1} width='w-[450px] appear !rounded-3xl h-[80vh] max-md:w-[99%]' margin=' !rounded-xl' />}

      <AnimatePresence mode="wait">
        {current && !isLoading ? (
          <>
            <motion.div
              key={current.id}
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: getExitX(),
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.3 },
              }}
              className="relative max-md:w-[95%] w-[450px] rounded-3xl shadow-xl h-[80vh]"
            >

              <div className="w-full relative h-full bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col justify-between">
                <SwiperComponent photo={current} />

                {showPing && <div className=" w-[200px] h-[200px] absolute top-[35%] 70 left-[24%]  rounded-full center  z-10">
                  <FcLike className="animate-ping duration-700 pulse " size={150} />
                </div>}

                <AnimatePresence>
                  {matchMessage && (
                    <LookingFor text={matchMessage} />
                  )}
                </AnimatePresence>

                <div className="absolute z-[10] bottom-0 w-[95%] left-2.5 text-white py-2">

                  <div className="  glass  relative shadow-xl rounded-3xl px-5 py-2 text-2xl max-md:text-lg font-bold">
                    <button
                      onClick={() => setDisplayed(!displayed)}
                      className={` glass absolute   w-10 h-10 z-[30] right-[2%] center text-3xl`}>
                      <AnimatedSwipe text={<MdKeyboardDoubleArrowUp size={22} />} />
                    </button>

                    <p className=" !justify-start center">{current?.name} {current.verified === true && <span className=" text-green-500"><RiVerifiedBadgeLine /></span>} {current?.profile.age && <span>, {current?.profile.age}</span>}</p>
                    {
                      onlineUser && user.id && onlineUser.includes(current?.id) && (
                        <span className='text-xs text-green-500'>Online</span>
                      )
                    }
                    <p className="text-base max-md:text-sm flex items-center gap-3 my-2 font-normal">
                      <MdOutlineInterests size={22} /> Interests
                    </p>
                    <KeywordButton current={current} user={user} />
                  </div>

                  <div className="flex w-full  justify-between max-md:mt-2 mt-4">
                    <button onClick={() => handleSwipe("right")} className="p-2 glass   cursor-pointer rounded-full hover:bg-[#ffffff1a] transition">
                      <RxCross2 size={30} />
                    </button>
                    <button onClick={handleBack} disabled={index >= shuffledPerson.length - 1} className="px-2 glass py-1 cursor-pointer bg-[#c2c2c240] rounded-full hover:bg-[#ffffff1a] transition">
                      <MdOutlineRefresh size={30} />
                    </button>
                    <button onClick={() => handleSwipe("left")} className={` px-3  ${showPing ? '  text-red-500 ' : ' text-white '}py-1 bg-[#c2c2c240] glass text-2xl cursor-pointer rounded-full hover:bg-[#ffffff1a] transition `}>
                      ♡
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {displayed && (
                <PopUp
                  key="details-panel"
                  current={current}
                  displayed={displayed}
                  setDisplayed={setDisplayed}
                  user={user}
                />
              )}
            </AnimatePresence>
          </>
        ) : (!isLoading &&
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center  max-md:w-[95%] w-[400px] h-[80vh] text-gray-500 text-lg font-medium"
          >
            <LookingFor text={'Looking for '} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TinderCardsCom;
