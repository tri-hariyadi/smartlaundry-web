import React from 'react';
import Button from '@components/Button';
import getClass from '@utils/classNames';

interface IProps {
  className?: string,
  id?: string,
  classContainer?: string
}

const IconText: React.FC<IProps> = ({ className, id, classContainer }) => {
  return (
    <div className={classContainer} id={id}>
      <Button
        className={getClass('brand-text-icon', className as string)}
        href='/' isLink isBtnLink isPrimary={false}>
        Smart<span style={{ color: '#252C5B' }}>Laundry.</span>
      </Button>
    </div>

  );
};

IconText.defaultProps = {
  className: '',
  id: '',
  classContainer: undefined
};

export default IconText;
