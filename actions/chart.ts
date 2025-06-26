'use server'
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"

interface MatchesProps {
    id: string;
    name: string;
    photos: { url: string }[]
}

export const getMatches = async () => {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'Not authorized user' }));
        }
        const chats = await prisma.chatParticipant.findMany({
            where: {
                userId: session.user.id
            },
            select: {
                chatId: true,
                chat: {
                    select: {
                        messages: {
                            orderBy: {
                                createdAt: 'desc'
                            },
                            select: {
                                content: true,
                                createdAt: true,
                            },
                            take: 1
                        },
                        participants: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                        id: true,
                                        photos: {
                                            select: {
                                                url: true
                                            },
                                            take: 1,
                                        }
                                    }
                                }
                            }
                        },
                    }

                }
            }
        })

        const alluseres: MatchesProps[] = []

        if (chats && chats.length > 0) {
            chats.forEach((chat: any) => {
                chat.chat.participants.forEach((participant: any) => {
                    if (participant.user.id !== session.user.id) {
                        alluseres.push(participant.user);
                    }
                });
            });
        }
        const matches = await prisma.like.findMany({
            where: {
                OR: [
                    { giverId: session.user.id },
                    { receiverId: session.user.id }
                ],
            },
            include: {
                giver: {
                    select: {
                        id: true,
                        name: true,
                        photos: {
                            take: 1,
                            select: {
                                url: true
                            }
                        }
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        photos: {
                            take: 1,
                            select: {
                                url: true
                            }
                        }
                    }
                }
            },
        })
        const chattedUserIds = new Set(alluseres.map(user => user.id));
        const filteredMatches = matches.filter(match => {
            const otherUser = match.giver.id === session.user.id ? match.receiver : match.giver;
            return !chattedUserIds.has(otherUser.id);
        });
        if (session.user.id && matches) {
            return JSON.parse(JSON.stringify({ matches: filteredMatches, userId: session.user.id, chats: chats }));
        }
    } catch (error) {

    }
}

export const createChartparticipent = async (receiverId: string) => {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'Not authorized user' }));
        }

        const chat = await prisma.chat.create({
            data: {
                participants: {
                    create: [
                        { user: { connect: { id: session?.user?.id } } },
                        { user: { connect: { id: receiverId } } },
                    ],
                },
            },
        });

        return JSON.parse(JSON.stringify({ chatId: chat.id }));

    } catch (error) {

    }
}

export const deleteAllMessages = async (chatId: string) => {
    try {
        const res = await prisma.message.deleteMany({
            where: {
                chatId
            }
        })
        if (!res) {
            return JSON.parse(JSON.stringify({ res: false }));
        }
        return JSON.parse(JSON.stringify({ res: true }));
    } catch (error) {
 return JSON.parse(JSON.stringify({ status: false }));
    }
}
export const deleteSelectMessages = async (messageId:string[]) => {
    try {
        const res = await prisma.message.deleteMany({
            where: {
                id: {
                    in: messageId
                }
            }
        })
        if (!res) {
            return JSON.parse(JSON.stringify({ status: false }));
        }

        return JSON.parse(JSON.stringify({ status: true }));
    } catch (error) {
 return JSON.parse(JSON.stringify({ status: false }));
    }
}

// To be implemented for group chat creation
// async function createGroupChat(  userIds: string,  ) {
//   const chat = await prisma.chat.create({
//     data: { 
//     participants:{
//         user:   { connect: { id: userIds } },
//     }
//     },
//     include: {
//       participants: true,
//     },
//   });

//   return chat;
// }
// async function addUserToGroupChat(chatId: string, userId: string) {
//   try {
//     // First, check if user is already a participant
//     const existing = await prisma.chatParticipant.findUnique({
//       where: {
//         userId_chatId: {
//           userId,
//           chatId,
//         },
//       },
//     });

//     if (existing) {
//       throw new Error('User is already in the group chat');
//     }

//     const participant = await prisma.chatParticipant.create({
//       data: {
//         user: { connect: { id: userId } },
//         chat: { connect: { id: chatId } },
//         role: 'MEMBER',
//       },
//     });

//     return participant;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }
