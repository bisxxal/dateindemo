import { getMatches } from '@/actions/chart';
import UserNavbar from '../../../components/Navbar';
import MatchesList from '../_components/matchesList';
import dynamic from 'next/dynamic';
import LoadingCom from '@/components/ui/loading';

const Charts = dynamic(() => import('../_components/chartsList'), {
  loading: () => <LoadingCom boxes={3} width=" !rounded-3xl w-full h-[100px] " margin=" !items-start !justify-between  !px-0 gap-5 flex-col " />,
});

interface MatchesProps {
  id: string;
  name: string;
  photos: { url: string }[]
}

const ChartMainPage = async () => {

  const data = await getMatches();
  const AllMatches: MatchesProps[] = []


  if (data?.matches && data?.matches.length > 0) {
    const uniqueUserIds = new Set();

    data.matches.forEach((match: any) => {
      let otherUser;

      if (match.giverId === data.userId) {
        otherUser = match.receiver;
      } else if (match.receiverId === data.userId) {
        otherUser = match.giver;
      }

      if (otherUser && !uniqueUserIds.has(otherUser.id)) {
        uniqueUserIds.add(otherUser.id);
        AllMatches.push(otherUser);
      }
    });
  }

  return (
    <div className=' relative w-full  min-h-screen'>
      <UserNavbar />

      <div className='px-3 w-full mt-10 '>

        {
          AllMatches.length !== 0 ? <>
            <h1 className='mb-3 pl-10 max-md:pl-2 textbase font-semibold'>New Matches</h1>
            <MatchesList AllMatches={AllMatches} />
          </> : <div>
            <p className='text-center text-gray-500'>No Matches Found</p>
          </div>
        }
        <Charts userId={data?.userId} chats={data?.chats} />
      </div>
      <div>
        <p className="logo3 ml-5 text-7xl max-md:text-6xl text-[100px]  flex flex-col font-bold my-10 text-[#8d8d8d82] block mb-10">Made</p>
        <p className=" ml-5 logo3 text-7xl max-md:text-6xl text-[100px]  flex flex-col font-bold my-10 text-[#8d8d8d82]">
          With Love ♡.</p>
      </div>
    </div>
  )
}

export default ChartMainPage

