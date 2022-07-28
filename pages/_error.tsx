import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  statusCode?: number | null | undefined
}

const Error: NextPage<Props> = ({ statusCode }) => {
  return (
    <section className='error-area'>
      <div className='container'>
        <div className='error-content text-center'>
          <Image src={require('@image/404.png')} alt='error' />
          <h3 className='mt-3'>{statusCode} Page Not Found</h3>
          <p>
            <span>The page you are looking for might have been removed</span>
            <br />
            <span>had its name changed or is temporarily unavailable.</span>
          </p>
          <Link href='/'>
            <a className='btn btn-primary btn-shadow'>Go to Home</a>
          </Link>
        </div>
      </div>
    </section>
  );
};

Error.getInitialProps = async ({ res, err }): Promise<Props> => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode };
};

export default Error;
