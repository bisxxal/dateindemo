
import BlurText from "@/components/ui/blur-text";
import MagnetLines from "@/components/ui/magnetline";
import ShinyText from "@/components/ui/shiny";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session?.user?.email) {
    redirect('/match');
  }
  return (
    <>

      {session ?
        <>
          <Link className="textbase text-5xl font-bold center h-[50vh]" href={'/match'}>Find your match</Link>
        </> : 
        
        <div className=" min-h-screen bg-  flex flex-col   text-3xl font-bold w-full ">
          <div className=" fixed z-[100]  flex px-10 backdrop-blur-[50px]  sh adow-xl items-center justify-between w-full h-[60px]">
            <h1 className=" textsecond">Date in</h1>
            <Link href={'/sign-in'} className="text-gray-100 glass4 hover:text-gray-300 px-10 py-3 font-bold  text-lg  "> sign-in</Link>
          </div>

          <div className="  h-screen  relative  flex items-center justify-center">

            <img className=" w-full h-full object-cover" src="https://images.unsplash.com/photo-1548051072-b34898021f8b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
              <div className=" absolute top-[60px] max-md:-[30vh] left-0 w-full h-full  text-[300px] text-white textshadow flex items-  justify-center">
                <BlurText
                    text="Date in"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    // onAnimationComplete={handleAnimationComplete}
                    className="text-[300px] max-md:text-[90px]  blurtext max-md:mt-[30vh]"
                  /> 
              </div>
          </div>
          {/* <h1 className=" text-gray-500 text-center text-3xl font-bold w-full h-full flex items-center justify-center">
            Sign In to find your match
          </h1> */}


          <div className=" base3 flex items-center justify-center w-full h-[50vh]">

              <div>
                <h1>Date in.</h1>

                <div>

                </div>
              </div>

            <MagnetLines
  rows={13}
  columns={13}
  containerSize="40vmin"
  lineColor="#6366F1"
  lineWidth="0.2vmin"
  lineHeight="3vmin"
  baseAngle={0}
  style={{ margin: "2rem auto" }}
/>

          </div>
        </div>
      }
    </>
  );
}
