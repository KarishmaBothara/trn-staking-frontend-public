import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const ValidatorsContent = dynamic(() => import('modules/validators'));

const Validators: NextPage = () => {
  return <ValidatorsContent />;
};

export default Validators;
