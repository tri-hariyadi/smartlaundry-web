
import React from 'react';
import propTypes from 'prop-types';
import Router from 'next/router';
import { Spinner } from 'reactstrap';

interface ButtonProps {
  isPrimary: boolean;
  isSecondary: boolean;
  isSuccess: boolean;
  isDanger: boolean;
  isWarning: boolean;
  isInfo: boolean;
  isLight: boolean;
  isDark: boolean;
  isLarge: boolean;
  isSmall: boolean;
  isBlock: boolean;
  hasShadow: boolean;
  isBtnLink: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  isExternal: boolean;
  isLink: boolean;
  type: 'button' | 'submit' | 'reset' | undefined;
  id: string;
  children: React.ReactNode | string;
  textLoading: string;
  href: string;
  target: string;
  className: string;
  onClick: (_e: React.MouseEvent<HTMLElement>) => void
}

const Button = ({
  isPrimary,
  isSecondary,
  isSuccess,
  isDanger,
  isWarning,
  isInfo,
  isLight,
  isDark,
  isLarge,
  isSmall,
  isBlock,
  hasShadow,
  isBtnLink,
  isDisabled,
  isLoading,
  isExternal,
  isLink,
  type,
  id,
  children,
  textLoading,
  href,
  target,
  className,
  onClick,
}: ButtonProps) => {
  const classNames: Array<string> = [];
  if (className) classNames.push(className);
  if (isPrimary) classNames.push('btn btn-primary');
  if (isSecondary) classNames[classNames.length-1] = 'btn btn-secondary';
  if (isSuccess) classNames[classNames.length-1] = 'btn btn-success';
  if (isDanger) classNames[classNames.length-1] = 'btn btn-danger';
  if (isWarning) classNames[classNames.length-1] = 'btn btn-warning';
  if (isInfo) classNames[classNames.length-1] = 'btn btn-info';
  if (isLight) classNames[classNames.length-1] = 'btn btn-light';
  if (isDark) classNames[classNames.length-1] = 'btn btn-dark';
  if (isLarge) classNames.push('btn-lg');
  if (isSmall) classNames.push('btn-sm');
  if (isBlock) classNames.push('btn-block');
  if (hasShadow) classNames.push('btn-shadow');
  if (isBtnLink) {
    classNames.push('btn-link');
    classNames.forEach((item, idx) => {
      if (item && item.includes('decoration'))
        delete classNames[idx];
    });
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onClick) onClick(e);
    else if (isLink) Router.push(href);
  };

  if (isDisabled || isLoading) {
    classNames.push('disabled');
    return (
      <span id={id} className={classNames.join(' ')}>
        {isLoading
          ? (
            <span className='d-flex align-items-center justify-content-center'>
              {isLarge
                ? <Spinner color='light' style={{ width: '1.5rem', height: '1.5rem' }} className='mr-2' />
                : <Spinner color='light' size='sm' className='mr-2' />
              }
              {textLoading !== null &&
              <span className='mt-0'>{textLoading || 'Loading...'}</span>
              }
            </span>
          )
          : (
            <span className='d-flex align-items-center justify-content-center'>
              {children}
            </span>
          )}
      </span>
    );
  }

  if (isLink) {
    if (isExternal) {
      return (
        <a
          id={id}
          href={href}
          className={classNames.join(' ')}
          target={target === '_blank' ? '_blank' : undefined}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
      );
    } else {
      return (
        <button
          id={id}
          type={type}
          className={classNames.join(' ')}
          onClick={handleClick}>
          {children}
        </button>
      );
    }
  }

  return (
    <button
      id={id}
      type={type}
      className={classNames.join(' ')}
      onClick={handleClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  isPrimary: propTypes.bool,
  isSecondary: propTypes.bool,
  isSuccess: propTypes.bool,
  isDanger: propTypes.bool,
  isWarning: propTypes.bool,
  isInfo: propTypes.bool,
  isLight: propTypes.bool,
  isDark: propTypes.bool,
  isLarge: propTypes.bool,
  isSmall: propTypes.bool,
  isBlock: propTypes.bool,
  hasShadow: propTypes.bool,
  isBtnLink: propTypes.bool,
  isDisabled: propTypes.bool,
  isLoading: propTypes.bool,
  isExternal: propTypes.bool,
  isLink: propTypes.bool,
  type: propTypes.oneOf(['button', 'submit', 'reset', undefined]),
  id: propTypes.string,
  children: propTypes.node,
  textLoading: propTypes.string,
  href: propTypes.string,
  target: propTypes.string,
  className: propTypes.string,
  onClick: propTypes.func
};

Button.defaultProps = {
  isPrimary: true,
  isSecondary: false,
  isSuccess: false,
  isDanger: false,
  isWarning: false,
  isInfo: false,
  isLight: false,
  isDark: false,
  isLarge: false,
  isSmall: false,
  isBlock: false,
  hasShadow: false,
  isBtnLink: false,
  isDisabled: false,
  isLoading: false,
  isExternal: false,
  isLink: false,
  type: 'button',
  id: undefined,
  children: null,
  textLoading: undefined,
  href: '',
  target: undefined,
  className: '',
  onClick: null
};

export default Button;
