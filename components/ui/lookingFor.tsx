import { motion } from "framer-motion";
const LookingFor = ({ text }: { text: string }) => {
  return (
    <motion.div
      key="match-message"
      initial={{ scale: 0, x: 200, y: 400, opacity: 0 }}
      animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0, x: 200, y: 400 }}
      transition={{ type: "spring", duration: 1, bounce: 0.3 }}
      className="fixed center  top-[30vh] max-md:left-[30vw] max-md:top-[40vh] left-[40%] transform -translate-x-1/2 z-50  text-white text-xs  px-6 py-3  ">
      <div className=" h-[200px] blur-[2px] w-[200px] absolute left-0 top-0 rounded-full !duration-700  center backdrop-blur-[10px]  buttonbg pink animate-ping  ">
      </div>
      <div className=" h-[140px] blur-[2px] w-[140px] absolute  top-8  left-8 rounded-full !duration-700  center backdrop-blur-[10px] delay-[1.5s] buttonbg animate-ping  ">
      </div>
      <div className=" h-[80px] text-center center w-[80px] absolute  top-15 left-15 rounded-full !duration-700  center backdrop-blur-[10px] buttonbg shadow-lg  ">
        {text}
      </div>

    </motion.div>
  )
}

export default LookingFor