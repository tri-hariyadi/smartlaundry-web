import React, { ReactNode } from 'react';
import Button from '../Button';

interface IProps {
  show: boolean;
  toggle: () => void;
  onClickSubmit?: () => void;
  isLoading?: boolean;
  children?: ReactNode;
  showCancelBtn?: boolean;
  textCancel?: string;
  textConfirm?: string;
  width?: string;
  title?: string;
  footerJustify?: 'flex-end' | 'center' | 'flex-start';
}

const AlertDialog: React.FC<IProps> = ({
  show, toggle, onClickSubmit, isLoading, children,
  showCancelBtn, textCancel, textConfirm, width, title, footerJustify
}) => {
  React.useLayoutEffect(() => {
    const dialog = document.querySelector('#alert-dialog');
    const main = document.querySelector('main.main') as HTMLElement;
    const alert = document.querySelector('div.show-alert') as HTMLElement;
    if (show) {
      dialog?.classList.add('show-overlay');
      if (width && alert) alert.style.width = `${width}%`;
      if (main) main.style.zIndex = '10000';
    } else {
      dialog?.classList.remove('show-overlay');
    }
  }, [show]);

  React.useEffect(() => {
    return () => {
      const main = document.querySelector('main.main');
      main?.removeAttribute('style');
    };
  }, []);

  return (
    <div id='alert-dialog' className='alert-overlay'>
      <div className='show-alert'>
        <div className='alert-title'>{title}</div>
        {children}
        <div className='alert-footer' style={footerJustify ? { justifyContent: footerJustify } : {}}>
          {showCancelBtn &&
            <Button
              isDanger
              onClick={toggle}>
              {textCancel}
            </Button>
          }
          {showCancelBtn && <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          <Button
            isPrimary
            type='button'
            onClick={() => {
              if (onClickSubmit) onClickSubmit();
            }}
            isLoading={isLoading}>
            {textConfirm}
          </Button>
        </div>
      </div>
    </div>
  );
};

AlertDialog.defaultProps = {
  children: undefined,
  toggle: undefined,
  show: false,
  isLoading: false,
  onClickSubmit: undefined,
  showCancelBtn: true,
  textCancel: 'Cancel',
  textConfirm: 'OK',
  width: undefined,
  title: '',
  footerJustify: undefined,
};

export default AlertDialog;
