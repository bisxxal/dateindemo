'use server'
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { shuffleArray } from "@/util/algoLogic"
import { cookies } from "next/headers"
import { rateLimit } from "@/util/rateLimit"

export const AllPublicUsers = async (page:number) => {
  try {
    // console.log('featching agin',page)
    const limit = 15; 
    // const cookieStore = await cookies();
    // const ip = cookieStore.get('user-ip')?.value || 'anonymous';

    // const rl = await rateLimit({
    //   key: ip,
    //   limit: 3,
    //   windowInSeconds: 60,
    // });

    // if (!rl.success) {
    //   console.log(`Rate limit exceeded. Try again in ${rl.retryAfter}s.`);
    //   return JSON.parse(JSON.stringify({ status: 429, message: `Rate limit exceeded. Try again in ${rl.retryAfter}s.` }));
    // }
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return JSON.parse(JSON.stringify({ status: 500, message: 'Not authorized user' }));
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id!,
      },
      select: {
        id: true,
        likesGiven: {
          select: {
            receiverId: true,
          },
        },
        profile: {
          select: {
            gender: true,
            keywords: {
              select: {
                name: true
              }
            }
          }
        },
        reported: {
          select: {
            reportedId: true
          }
        }
      }
    })

    const reportedUserIds = user?.reported?.map((u: { reportedId: string }) => u.reportedId) || [];
    const likedUserIds = user?.likesGiven?.map((like:{receiverId:string}) => like.receiverId) || [];
    const gender = user?.profile?.gender === 'male' ? 'female' :'male'

    const [allUsers , total] = await prisma.$transaction([
      prisma.user.findMany({
        skip: (page - 1) * limit,  
        take: limit,
        where: {
          id: {
            notIn: [session.user.id, ...likedUserIds, ...reportedUserIds],
          },
          photos:{
            some:{}
          },
          profile:{
            gender
          }
        },
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          name: true,
          verified: true,
          createdAt: true,
          photos: {
            take: 6,
            select: {
              url: true,
            }
          },
          profile: {
            select: {
              job: true,
              batch: true,
              location: true,
              livingIn: true,
              lookingFor: true,
              height: true,
              bio: true,
              age: true,
              languages: true,

              keywords: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }),
      prisma.user.count({
        where: {
          id: {
            notIn: [session.user.id, ...likedUserIds, ...reportedUserIds],
          },
        },
      })
    ])
    //  const shuffled = shuffleArray(allUsers);
    return JSON.parse(JSON.stringify({ user, shuffled: allUsers , total }))
    // return JSON.parse(JSON.stringify({user ,allUsers , total}))

  } catch (error) {

  }
}
 