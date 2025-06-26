import React from 'react'
import TinderCardsCom from '@/components/matchCard';
import UserNavbar from '@/components/Navbar';


const MatchPage = () => {

  return (
    <div className='w-full !h-screen overflow-hidden flex flex-col items-center justify-'>
      <UserNavbar />
      <TinderCardsCom />
    </div>
  );
};


export default MatchPage