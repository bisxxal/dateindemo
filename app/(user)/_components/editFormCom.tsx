'use client'
import Link from 'next/link'
import { updateProfile } from '@/actions/user.action'
import { createProfileForm, TCreateProfileForm } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import GlareHover from '@/components/ui/glassHover'
import { VscVerified } from 'react-icons/vsc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiLoader } from 'react-icons/fi'
import { useEffect } from 'react'

interface UserProfileProps {
    age?: number,
    batch?: number,
    gender?: string,
    bio?: string,
    height?: number,
    job?: string,
    keywords?: {
        name: string
    }[],
    languages?: string,
    livingIn?: string,
    lookingFor?: string,
    photos?: {
        url: string
    }[],
}

const EditFormCom = ({ data, name, verified, isLoading }: { data: UserProfileProps, name: string, verified: boolean, isLoading: boolean }) => {
    const interest = data?.keywords?.map((i: { name: string }) => i.name).join(',')
    const { register, handleSubmit, reset,
        formState: { errors, isSubmitting, isDirty }, } = useForm<TCreateProfileForm>
            ({
                resolver: zodResolver(createProfileForm),

                defaultValues: {
                    name: name || "",
                    bio: data?.bio || "",
                    age: data?.age || undefined,
                    batch: data?.batch || "bca",
                    gender: data?.gender || "male",
                    height: data?.height || undefined,
                    languages: data?.languages || "",
                    job: data?.job || "",
                    livingIn: data?.livingIn || "",
                    relationshipGoals: data?.lookingFor || "short-term",
                },
            })

    useEffect(() => {
        if (data) {
            reset({
                name: name || "",
                bio: data?.bio || "",
                age: data?.age || undefined,
                batch: data?.batch  || "bca",
                gender: data?.gender || "male",
                height: data?.height || undefined,
                languages: data?.languages || "",
                job: data?.job || "",
                livingIn: data?.livingIn || "",
                relationshipGoals: data?.lookingFor || "short-term",
            });
        }
    }, [data, name, reset]);
    const queryClient = useQueryClient();

    const updatedMutation = useMutation({
        mutationFn: async (data: TCreateProfileForm) => {
            return await updateProfile(data);
        },
        onSuccess: (data) => {
            toast.success(data?.message)
            queryClient.invalidateQueries({ queryKey: ['fetchUsersProfile'] });
        },

        onError: (error) => {
            toast.error('Failed to update Profile ')
        },
    });
    const onSubmit = (data: TCreateProfileForm) => {
        updatedMutation.mutate(data);
    }
    return (
        <div className=' px-5 my-6 w-full flex flex-col gap-6'>

            {!verified && !isLoading && <div>
                <GlareHover
                    glareColor="#ffffff"
                    glareOpacity={0.4}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={1000}
                    playOnce={false}
                    className="bg-transparent  !rounded-3xl mx-auto  w-full text-white flex-col !h-[300px]">

                    <Link href={'/verified'} className=" w-full px-5 flex-col h-full border-2 border-green-600 bg-green-600/30  rounded-3xl center">
                        <p className=" center my-4 max-md:my-1 text-3xl max-md:text-xl gap-4">  Get Verified <VscVerified /></p>
                        <p className=" max-md:text-xs">Not Verified yet.</p>
                    </Link>
                </GlareHover>
            </div>}

            <form onSubmit={handleSubmit(onSubmit)} className=' flex flex-col gap-6'>

                <div>
                    <p className=' text-xl font-semibold '>About me</p>
                    <input className='p-3 w-full my-5 rounded-xl bg-[#00000014] backdrop-blur-[10px] '   {...register("bio")} placeholder='Write something about yourself...' />
                    {errors?.bio && <span className=' text-red-500'>{errors?.bio?.message}</span>}
                </div>

                <div>
                    <p className=' text-xl font-semibold  ' >Name</p>
                    <div className='p-3 w-full h-12 px-6 center !justify-between rounded-xl bg-[#00000014] backdrop-blur-[10px] '>
                        <input className='w-full h-full  outline-none placeholder:text-gray-400 textbase' {...register("name")} type="text" placeholder='jhone deo' />
                    </div>
                    {errors?.name && <span className=' text-red-500'>{errors?.name?.message}</span>}
                </div>

                <div>
                    <p className=' text-xl font-semibold '>Age</p>
                    <div className='p-3 w-full h-12 px-6 center !justify-between rounded-xl bg-[#00000014] backdrop-blur-[10px] '>
                        <input className='w-full h-full outline-none placeholder:text-gray-400 textbase'  {...register("age")} type="number" placeholder='20' />
                    </div>
                    {errors?.age && <span className=' text-red-500'>{errors?.age?.message}</span>}
                </div>
                <div>
                    <p className=' text-xl font-semibold '>Intrests</p>
                    <Link className=' bg-[#00000014] backdrop-blur-[10px]  flex justify-between items-center p-2 px-5 h-12 mt-4 rounded-xl' href={`/profile/editprofile/interest?interest=${interest}`}>
                        <div> {data?.keywords?.length !== 0 ? data?.keywords?.map((i: { name: string }, index: number) => (<span key={index} className='textbase mx-1'>{i?.name} ,</span>)) : 'Add your intrests'}</div>
                        <span className='tex-xl block'> &gt; </span>
                    </Link>
                </div>

                <div>
                    <p className=' max-md:text-base text-xl mb-5 font-bold'>Relationship Goals</p>
                    <div className='p-3 px-6 center !justify-between rounded-xl bg-[#00000014] backdrop-blur-[10px] '>
                        <h1>Looking for</h1>

                        <select className=' textbase' {...register("relationshipGoals")} >
                            <option value="short-term">Short-term Partner</option>
                            <option value="long-term">Long-term Partner</option>
                        </select>

                        {errors?.relationshipGoals && <span className=' text-red-500'>{errors?.relationshipGoals?.message}</span>}
                    </div>
                </div>

                <div>

                    <div className='p-3 w-full h-12 px-3 center !justify-between rounded-xl bg-[#00000014] backdrop-blur-[10px] '>
                        <p className=' max-md:text-base text-xl '>Batch</p>
                        <select className='captialize textbase' {...register("batch")} >
                            <option value="bca">Bca</option>
                            <option value="mca">Mca</option>
                            <option value="btech">btech</option>
                            <option value="law">law</option>
                            <option value="bba">Bba</option>
                        </select>
                    </div>
                    {errors?.batch && <span className=' text-red-500'>{errors?.batch?.message}</span>}
                </div>

                <div className='bg-[#00000014] backdrop-blur-[10px]  rounded-xl'>
                    <div className='p-3 w-full h-12 px-3 center !justify-between items-end   '>
                        <p className=' max-md:text-base text-xl '>Gender </p>

                        <select className=' textbase' {...register("gender")} >
                            <option value="male">male</option>
                            <option value="female">female</option>

                        </select>
                    </div>
                    {errors?.gender && <span className=' text-red-500'>{errors?.gender?.message}</span>}
                </div>

                <div>
                    <p className=' max-md:text-base text-xl mb-5 font-bold'>Height</p>

                    <div className='p-3 w-full h-12 px-6 center !justify-between rounded-xl bg-[#00000014] backdrop-blur-[10px] '>
                        <input className='w-full h-full outline-none placeholder:text-gray-400 textbase'  {...register("height")} type="number" placeholder='3.3 ft' />ft
                    </div>
                    {errors?.height && <span className=' text-red-500'>{errors?.height?.message}</span>}
                </div>

                <div>
                    <p className=' max-md:text-base text-xl mb-5 font-bold'>language i know</p>

                    <div className='p-3 w-full h-12 px-6 center !justify-between rounded-xl bg-[#00000014] backdrop-blur-[10px] '>
                        <input className='w-full h-full outline-none placeholder:text-gray-400 textbase' {...register("languages")} type="text" placeholder='hindi , english' />
                    </div>
                    {errors?.languages && <span className=' text-red-500'>{errors?.languages?.message}</span>}
                </div>

                <div>
                    <p className=' max-md:text-base text-xl mb-5 font-bold'>Job title <span className='bg-blue-500  font-normal max-md:text-sm text-white rounded-full px-2'>IMPORTANT</span> </p>

                    <div className='p-3 w-full h-12 px-6 center !justify-between rounded-xl bg-[#00000014] backdrop-blur-[10px] '>
                        <input className='w-full h-full outline-none placeholder:text-gray-400 textbase' {...register("job")} type="text" placeholder='google ' />
                    </div>
                    {errors?.job && <span className=' text-red-500'>{errors?.job?.message}</span>}
                </div>

                <div>
                    <p className=' max-md:text-base text-xl mb-5 font-bold'>Living in </p>
                    <div className='p-3 w-full h-12 px-6 center !justify-between rounded-xl bg-[#00000014] backdrop-blur-[10px] '>
                        <input className='w-full h-full outline-none placeholder:text-gray-400 textbase ' {...register("livingIn")} type="text" placeholder='Bhubaneswar' />
                    </div>
                    {errors?.livingIn && <span className=' text-red-500'>{errors?.livingIn?.message}</span>}
                </div>

                <button disabled={updatedMutation.isPending || !isDirty} className={` ${!isDirty || isSubmitting ? ' opacity-[0.5] ' : ' '} center disabled:cursor-notallowed py-2 w-[300px w-full mx-auto !rounded-3xl  buttonbg2`} type="submit">
                    {updatedMutation.isPending ? <FiLoader className='text-xl animate-spin ml-2' /> : 'Save Changes'}
                </button>
            </form>
        </div>
    )
}

export default EditFormCom

