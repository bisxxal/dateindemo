'use server'
import prisma from "@/lib/prisma";
import { getUser } from "./user.action";
import { cookies } from "next/headers";
import { rateLimit } from "@/util/rateLimit";
import { TReportABug } from "@/lib/zod";

export async function getVerified(formData: FormData) {
  // const cookieStore = await cookies();
  // const ip = cookieStore.get('user-ip')?.value || 'anonymous';

  // const rl = await rateLimit({
  //   key: ip,
  //   limit: 1,
  //   windowInSeconds: 6000,
  // });

  // if (!rl.success) {
  //   console.log(`Rate limit exceeded. Try again in ${rl.retryAfter}s.`);
  //   return JSON.parse(JSON.stringify({ status: 429, message: `Rate limit exceeded. Try again in ${rl.retryAfter}s.` }));
  // }
  const user = await getUser();
  if (!user) {
    return JSON.parse(JSON.stringify({ status: 300, message: 'unauth user' }));
  }
  const roll = formData.get('roll') as string;
  const verify = await prisma.verified.create({
    data: {
      userId: user.id,
      rollNo: roll,
    },
  })
  if (!verify) {
    return JSON.parse(JSON.stringify({ status: 300, message: 'error in saving' }));
  }
  return JSON.parse(JSON.stringify({ status: 200, message: 'success', }));
}

export const reportUser = async (receiverId: string, reason: string, giverId: string, chatId: string) => {
  try {
    const user = await getUser()
    if (!user || !user.id) {
      return { status: 401, message: 'Unauthorized' }
    }
    const res = await prisma.reportedUsers.create({
      data: {
        reporterId: user.id,
        reason: reason,
        reportedId: receiverId,
      },
    });
    const existingLike = await prisma.like.findFirst({
      where: { 
        OR: [
          { giverId, receiverId },
          { giverId: receiverId, receiverId: giverId }
        ]
      },
    });
    if (existingLike) {

      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    }
    if (chatId !== undefined && chatId !== null  && res) {
      const isChat = await prisma.chat.findUnique({
        where: {
          id: chatId,
        },
      });
      if (!isChat) {
        return JSON.parse(JSON.stringify({ status: 200, message: "User reported successfully" }));
      }
      const res = await prisma.chat.delete({
        where: {
          id: chatId,
        },
      });
      return JSON.parse(JSON.stringify({ status: 200, message: "User reported successfully" }));
    }
    if (res) {
      return JSON.parse(JSON.stringify({ status: 200, message: "User reported successfully" }));
    } else {
      return JSON.parse(JSON.stringify({ status: 300, message: "Failed to report user" }));
    }
  } catch (error) {
console.log(error)
    return JSON.parse(JSON.stringify({ status: 500, message: "Server error", error }));
  }
}

export const reportBug = async (data:TReportABug) => {
  try {

    // const cookieStore = await cookies();
    // const ip = cookieStore.get('user-ip')?.value || 'anonymous';
    // const rl = await rateLimit({
    //   key: ip,
    //   limit: 1,
    //   windowInSeconds: 6000,
    // });

    // if (!rl.success) {
    //   // console.log(`Rate limit exceeded. Try again in ${rl.retryAfter}s.`);
    //   return JSON.parse(JSON.stringify({ status: 429, message: `Rate limit exceeded. Try again in ${rl.retryAfter}s.` }));
    // }

    const user = await getUser()
    if (!user || !user.id || !data) {
      return { status: 401, message: 'Unauthorized' }
    }

    const reports = await prisma.bug.create({
      data: {
        titel: data.title,
        description: data.description,
        userId: user.id
      }
    });
    if (reports) {
      return JSON.parse(JSON.stringify({ status: 200, message: "Bug reported successfully" }));
    } else {
      return JSON.parse(JSON.stringify({ status: 300 }));
    }
  } catch (error) {
    return JSON.parse(JSON.stringify({ status: 500, message: "Server error", error }));
    return [];
  }
}