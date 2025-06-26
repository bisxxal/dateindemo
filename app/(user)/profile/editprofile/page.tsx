'use client'
import Back from "@/components/ui/back";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/actions/user.action";
import BackgroundPatten from "@/components/ui/backgroundPatten";
import PhotoUploadCom from "../../_components/photoUploadCom";
import EditFormCom from "../../_components/editFormCom";

export default function PhotoUploader() {
  const client = new QueryClient();
  const { isLoading, data } = useQuery({
    queryKey: ['fetchUsersProfile', client],
    queryFn: async () => {
      const data = await getUserProfile();
      return data;
    },
    staleTime: 60000,
  });
  return (
    <BackgroundPatten>

      <div className=' w-full min-h-screen mx-auto pt-5 px-10 max-md:px-2 '>

        <Back url={'/profile'} className='' />
        <h1 className="text-3xl my-5 ml-7 max-md:text-center textsecond font-bold ">Edit Profile</h1>
        <PhotoUploadCom data={data?.photos} isLoading={isLoading} />

        <EditFormCom data={data?.profile} name={data?.name} verified={data?.verified} isLoading={isLoading} />

      </div>
    </BackgroundPatten>
  );
}
