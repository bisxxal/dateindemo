'use client'
import KitImage from '@/components/ui/KitImage';
import { useSocket } from '@/hooks/useSocket';
import moment from 'moment';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { PiArrowBendUpLeft } from "react-icons/pi";


interface Chat {
    chatId: string;
    name: string;
    image: string;
    chat: {
        participants: {
            user: {
                id: string;
                name: string;
                photos: any
            }
        }[];
        messages: {
            content: string;
            createdAt: string;
        }[];
    }
}

type ChartsProps = Chat[];
const Charts = ({ chats, userId }: { chats: ChartsProps, userId: string }) => {

    const { onlineUser } = useSocket({ userId: userId! }) as { socket: any; ready: boolean; onlineUser: string[] };

    return (
        <div className='flex flex-col w-full'>
            <p className='my-3 mt-7 pl-10 max-md:pl-2 textbase font-semibold'>Messges</p>
            {chats?.length !== 0 ?
                [...chats]
                    .sort((a, b) => {
                        const dateA = a?.chat?.messages[0]?.createdAt
                            ? new Date(a.chat.messages[0].createdAt).getTime()
                            : 0;
                        const dateB = b?.chat?.messages[0]?.createdAt
                            ? new Date(b.chat.messages[0].createdAt).getTime()
                            : 0;
                        return dateB - dateA;
                    })
                    .map((item, i) => {
                        return (
                            <Link
                                href={`/chat/${item.chatId}`}
                                key={i}
                                className='w-[95%] max-md:w-[98%] mx-auto glass rounded-3xl center mb-3 shadow-lg border-black/10 p-2 !justify-start '
                            >
                                {item.chat.participants
                                    .filter((participant) => participant.user.id !== userId)
                                    .map((participant, index) => (
                                        <div key={index} className='flex  w-full items-center pr-6 justify-between gap-2'>
                                            <div className=' flex items-center gap-2'>
                                                <KitImage
                                                    loading='lazy'
                                                    className='!w-[80px] !h-[80px] rounded-4xl border border-black/20 object-cover'
                                                    src={participant?.user?.photos[0]?.url}
                                                    alt={participant.user.name}
                                                    width={300}
                                                    height={300}
                                                />
                                                <div className=' flex flex-col'>
                                                    <h1 className='pl-1 pt-1 text-sm text-gray-900'>
                                                        {participant.user.name}
                                                    </h1>
                                                    {item?.chat?.messages[0]?.content && (
                                                        <p className=' pl-3 text-sm text-blue-300 center gap-2'>
                                                            <PiArrowBendUpLeft size={21} />
                                                            {item?.chat?.messages[0]?.content.split(' ').slice(0, 10).join(' ')}
                                                            <span className='text-xs text-gray-400 mt-1'>
                                                                {moment(item?.chat?.messages[0]?.createdAt).format(
                                                                    'LT MMM Do '
                                                                )}
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                {
                                                    onlineUser && participant.user.id && onlineUser.includes(participant?.user?.id) ? (
                                                        <span className='text-xs text-green-500'>Online</span>
                                                    ) : (
                                                        <span className='text-xs text-red-500'>Offline</span>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))}
                            </Link>
                        );
                    })
                :
                (
                    //     isLoading ?
                    //    <LoadingCom boxes={3} width=" !rounded-3xl w-full h-[100px] " margin=" !items-start !justify-between  !px-0 gap-5 flex-col " />
                    <p className='text-center text-gray-500'>No Messages found</p>
                )
            }
        </div>
    )
}

export default Charts