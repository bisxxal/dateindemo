import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import 'server-only'

export const authCheck = async () => {
    try{
        const session = await getServerSession(authOptions) 
        if (!session || !session.user) {
           return JSON.parse(JSON.stringify({status: 500, message: 'Not authorized user' })); 
          }
    }
    catch (error) {
        return { status: 500, message: 'Internal Server Error' };
    }
}