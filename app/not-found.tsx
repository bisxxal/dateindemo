import Back from "@/components/ui/back";
import FuzzyText from "@/components/ui/notfound";

export default function NotFound() {
  return (
    <div className=" flex flex-col items-center  justify-center h-screen">
      <Back url={'/match'} className='' />
      <h1 className=" textbase font-bold text-4xl mb-2 ">Date with.</h1>
  <FuzzyText
  baseIntensity={0.2} 
  hoverIntensity={0.5} 
  enableHover={true}>
    404</FuzzyText>

    <div className=" mt-10 "></div>
<FuzzyText
  baseIntensity={0.2} 
  hoverIntensity={0.5} 
  enableHover={true}>
    Page No Found
</FuzzyText>
 
    </div>
  )
}