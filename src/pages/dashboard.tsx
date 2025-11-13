import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const Main = dynamic(() => import('modules/dashboard'));

const Dashboard: NextPage = () => {
  return <Main />;
};

export default Dashboard;
