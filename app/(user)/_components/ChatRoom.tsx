'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/hooks/useSocket';
import Back from '@/components/ui/back';
import { LuSend } from "react-icons/lu";
import { FiLoader } from 'react-icons/fi';
import moment from 'moment';
import PopUpCom from '@/components/ui/popUpCom';
import { deleteSelectMessages } from '@/actions/chart';
import toast from 'react-hot-toast';
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import Link from 'next/link';
import LoadingCom from '@/components/ui/loading';
import { dummyMessages, dummyUserId } from '@/util';
import { useRouter } from 'next/navigation';

type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  chatId: string;
  sender?: {
    name: string | null;
    id: string
  };
};

type Props = {
  chatId: string;
  currentUserId: string;
};
const ChatRoom: React.FC<Props> = ({ chatId, currentUserId }) => {
  const router = useRouter();
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const { socket, ready, onlineUser }: { socket: any, ready: boolean, onlineUser: string[] } = useSocket({ userId: currentUserId });
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [msgloading, setMsgLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [user, setUser] = useState<{ name: string | null, id: string } | null>(null);

  const [megSending, setMsgSending] = useState(false);

  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  useEffect(() => {
    const fetchMessages = async () => {
      setMsgLoading(true);
      const res = await fetch(`${url}/api/chart/getmessages/?chatId=${chatId}&userId=${currentUserId}`);
      const data = await res.json();

      if (data.status === 403) {
        router.push('/chat');
        return;
      }

      console.log(data)

      setMessages(data.messages || []);
      setUser(data.user.user);
      setMsgLoading(false);
    };
    fetchMessages();
  }, [chatId]);

  // Join socket room & listen when socket is ready
  useEffect(() => {
    if (!ready || !socket) return;

    socket.emit('join', chatId);

    const onNewMessage = (msg: Message) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    ///new
    const onMessageDeleted = (data: { chatId: string; messageIds: string[] }) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => prev.filter(msg => !data.messageIds.includes(msg.id)));
    };
    socket.on('new_message', onNewMessage);
    socket.on('message_deleted', onMessageDeleted);
    return () => {
      socket.off('new_message', onNewMessage);
      socket.off('message_deleted', onMessageDeleted);
    };
  }, [chatId, socket, ready]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    setMsgSending(true);
    if (!newMessage.trim()) return;

    await fetch(`${url}/api/chart/sendmessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: currentUserId,
        chatId,
        content: newMessage,
      }),
    });
    setNewMessage('');
    setMsgSending(false);
  };

  const groupedMessages = messages?.reduce<Record<string, Message[]>>((acc, message) => {
    const dateKey = moment(message.createdAt).format('YYYY-MM-DD');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(message);
    return acc;
  }, {});


  const formatDateLabel = (dateStr: string): string => {
    const date = moment(dateStr);
    if (date.isSame(moment(), 'day')) return 'Today';
    if (date.isSame(moment().subtract(1, 'day'), 'day')) return 'Yesterday';
    return date.format('D MMMM');
  };


  const handleLongPressStart = (id: string) => {
    setIsLongPressing(false);
    longPressTimeout.current = setTimeout(() => {
      setIsLongPressing(true); // flag to prevent click
      setSelectedMessages((prev) => new Set(prev).add(id));
    }, 800); // 800ms press to trigger
  };

  const handleLongPressEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  const handleMessageClick = (id: string) => {
    // If a long-press just happened, ignore the click
    if (isLongPressing) return;

    if (selectedMessages.size > 0) {
      toggleSelectMessage(id);
    }
  };

  const toggleSelectMessage = (id: string) => {
    setSelectedMessages((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const deleteSelectedMessages = async () => {
    if (selectedMessages.size === 0) return;

    const idsToDelete = Array.from(selectedMessages);

    const res = await deleteSelectMessages(idsToDelete)

    if (res.status) {
      toast.success('Messages deleted successfully');
    }

    setMessages((prev) => prev.filter((msg) => !selectedMessages.has(msg.id)));
    setSelectedMessages(new Set());

    if (socket) {
      socket.emit('message_deleted', {
        chatId,
        messageIds: idsToDelete,
      });
    }
  };

  return (
    <div className="flex relative flex-col h-screen w-full  min- h-screeen mx-auto px-4">
      <div className='fixed w-full h-[60px] z-[30] pr-4 bg-[#c2c2c240] backdrop-blur-[18px] top-0 left-0  !justify-between center shadow-xl '>
        <div className='   center gap-3'>
          <Back url={'/chat'} className='ml-2' />
          {user ? <>
            <h1 className=' text-lg textbase font-semibold'>{user.name}</h1>
            {
              onlineUser && onlineUser.includes(user?.id) ? (
                <span className='text-xs text-green-500'>Online</span>
              ) : (
                <span className='text-xs text-red-500'>Offline</span>
              )}
          </> :
            <LoadingCom width='w-60 max-md:w-38 max-md:h-8' boxes={1} margin=' w-10 h-10' />
          }
        </div>

        {selectedMessages.size <= 0 &&

          <div className='relative group'>
            <label htmlFor='is'>
              <p><PiDotsThreeCircleLight className=' text-gray-500' size={25} /></p>
            </label>
            <input type="checkbox" hidden id="is" />
            <div className='group-has-checked:flex hidden  group-hover:  absolute  py-4 w-52 flex flex-col gap-2 border  text-white p-2 border-black/30 rounded-3xl bg-black/20 backdrop-blur-[10px] -left-[180px] '>
              <p className='pl-10 border-b pb-2 border-black/20 '>Chat theme</p>
              <h1 className=' pl-10 cursor-pointer border-b pb-2 border-black/20 ' onClick={() => setShowPopUp(!showPopUp)}>Delete chat</h1>
              <Link className=' pl-10' href={`/report/${user?.id}?userid=${currentUserId}&chatid=${chatId}`}>Report & block </Link>
            </div>
          </div>
        }
        {selectedMessages.size > 0 && (
          <div className="flex justify-end  gap-5 ">
            <button className=' px-5 py-3 ' onClick={() => setSelectedMessages(new Set())}>
              <RxCross1 />
            </button>

            <button
              onClick={deleteSelectedMessages}
              className="text-sm center  px-5 py-1  gap-2 rounded" >
              <RiDeleteBin5Line className=' text-red-500' size={23} />
              {selectedMessages.size}
            </button>
          </div>
        )}
      </div>{
        showPopUp && <PopUpCom showPopUp={showPopUp} setShowPopUp={setShowPopUp} chatId={chatId} />
      }

      <div className='  bg-[url(/bg2.png)] bg-cover flex flex-col mt-[70px]  mx-auto max-w-2xl rounded-2xl max-md:border-none max-md:shadow-none border border-black/10 shadow-xl p-2  w-full max-md:h-[83vh] h-[80vh]'>

        <div className=" w-full scrollbar overflow-y-auto space-y-3 rounded-2xl h-[70vh] max-md:h-[76vh] ">
          {Object.entries(groupedMessages).length !== 0 ? Object.entries(groupedMessages).map(([dateKey, msgs]) => (
            <div key={dateKey}>
              <div className="text-center w-fit bg-[#ffffff5c] border border-white/80 mx-auto rounded-full px-3  backdrop-blur-[10px] my-4 text-sm text-gray-700 font-medium">
                {formatDateLabel(dateKey)}
              </div>
              {msgs.map((msg) => {
                const isSelected = selectedMessages.has(msg.id);
                return (
                  <div
                    key={msg.id}
                    onMouseDown={() => handleLongPressStart(msg.id)}
                    onMouseUp={handleLongPressEnd}
                    onTouchStart={() => handleLongPressStart(msg.id)}
                    onTouchEnd={handleLongPressEnd}
                    onClick={() => handleMessageClick(msg.id)}
                    className={`relative w-full mt-3 flex flex-col text-base font-normal cursor-pointer`}>

                    {isSelected && <div className=' w-full rounded-lg bas buttonbg opacity-[0.4] z-[10] h-full top-0 left-0 absolute'></div>}
                    <div className={` max-w-[80%] w-fit px-5 py-1.5 ${msg.senderId === currentUserId
                      ? 'bg-blue-60 buttonbg text-white rounded-b-2xl rounded-l-2xl ml-auto'
                      : 'bg-gray-10 sidebarbg text-black/60 rounded-b-2xl rounded-r-2xl'}`}>
                      <p className='max-w-[99%]'>{msg.content}</p>
                      <p className="text-xs opacity-70 text-right">
                        {moment(msg.createdAt).format('LT')}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>
          ))
            : (msgloading ?
              dummyMessages.map((msg) => {
                return (
                  <div
                    className={`max-w-[80%] mt-3 w-fit  h-20  flex flex-col   ${msg.senderId === dummyUserId ? '  ml-auto ' : ' '}`}>
                    <LoadingCom width={` max-md:h-10 border border-white/20 w-60 max-md:w-52`} boxes={1} margin=' w-10 h-full' />
                  </div>
                );
              }
              ) : <p className='text-white px-4 py-3 rounded-3xl  border w-fit mt-[30vh] mx-auto border-white/80 font-medium  backdrop-blur-[40px] '>say hii 👋🏻  to start message </p>
            )
          }
 
        <div ref={messagesEndRef} /></div>
        <div className=" flex justify-between items-end gap-3   max-md:pr-[2px]  ">

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={1}
            className="flex-1 px-4 py-2 w-[96%] scrollbar bg-[#ffffff61] backdrop-blur-[40px]  border rounded-3xl border-white/80  resize-none overflow-auto text-white bg-transparent focus:outline-none leading-relaxed max-h-[200px]"
            placeholder="Type a message..."
            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.currentTarget;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />


          <button
            onClick={sendMessage}
            disabled={!newMessage}
            className={` ${!newMessage && " opacity-[0.5] "} base text-white center w-12 h-12 rounded-full center  hover:bg-blue-700 `}>
            {megSending ? <FiLoader className='text-xl animate-spin ' /> : <LuSend size={21} />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatRoom;
