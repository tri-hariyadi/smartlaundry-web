import { PropsWithChildren } from 'react';

const compare = <P>(prevProps: Readonly<PropsWithChildren<P>>, nextProps: Readonly<PropsWithChildren<P>>) =>
  JSON.stringify(prevProps) === JSON.stringify(nextProps);

export default compare;
