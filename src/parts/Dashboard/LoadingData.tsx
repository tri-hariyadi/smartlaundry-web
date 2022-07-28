import { Spinner } from 'reactstrap';
import { BsExclamationCircle } from 'react-icons/bs';
import React from 'react';

const LoadingData = (
    loadingData: boolean,
    errorData: string | boolean,
    children: React.ReactNode
) => {
  if (loadingData) return (
    <div className='d-flex align-items-center justify-content-center w-100' style={{ minHeight: 350 }}>
      <Spinner color='dark' style={{width: '1.6rem', height: '1.6rem'}} />
      <h6 className='mb-0 ms-2'>Loading...</h6>
    </div>
  );

  if (!loadingData && errorData) return (
    <div className='d-flex align-items-center justify-content-center w-100' style={{ minHeight: 350 }}>
      <BsExclamationCircle className='text-danger' style={{fontSize: '1.8rem'}} />
      <p className='mb-0 ms-2 text-danger' style={{fontSize: '1.05rem'}}>{errorData}</p>
    </div>
  );

  return children;
};

export default LoadingData;
