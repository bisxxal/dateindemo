import { authOptions } from '@/lib/auth';
import { getServerSession } from "next-auth"
import ChatRoom from '../../_components/ChatRoom';
export const dynamic = 'force-dynamic'; 

export default async function ChatPage({ params }: { params: { chatId: string } }) {

  const session = await getServerSession(authOptions)
  const currentUserId = session?.user.id as string
  return <ChatRoom chatId={params.chatId} currentUserId={currentUserId} />;
}
