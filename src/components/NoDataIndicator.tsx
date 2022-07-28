import { FaTimesCircle } from 'react-icons/fa';
import getClass from '@utils/classNames';

interface IProps {
  message?: string | null | undefined | boolean,
  wrapperClass?: string
}

const NoDataIndicator: React.FC<IProps> = ({ message, wrapperClass='' }) => {
  return (
    <div className={getClass('text-center', wrapperClass)}>
      <div style={{ margin: '5px', color: 'Red' }}>
        <FaTimesCircle style={{ fontSize: '2.75rem' }} />
      </div>
      <h6 className='mb-4 mt-2'>{message || 'Data Tidak Ditemukan'}</h6>
    </div>

  );
};

export default NoDataIndicator;
