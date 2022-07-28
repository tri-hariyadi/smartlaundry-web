import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import { GiWashingMachine } from 'react-icons/gi';
import getClass from '@utils/classNames';
import Header from '@components/Header';
import Nav from '@configs/nav';

const Layout: React.FC<{ children: React.ReactChild }> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const main = document.querySelector('main#layout-main');
    sideBarRemover(main);
    window.addEventListener('resize', () => sideBarRemover(main));
    return () => window.removeEventListener('resize', () => sideBarRemover(main));
  }, []);

  const sideBarRemover = (main: Element | null) => {
    if (window.screen.width < 1024) main?.addEventListener('click', removeSideBar);
    else main?.removeEventListener('click', removeSideBar);
  };

  const removeSideBar = () => {
    document.querySelector('body')?.classList.remove('show-sidebar');
  };

  const onBarsClick = () => {
    document.querySelector('body')?.classList.toggle('show-sidebar');
    document.querySelector('body')?.classList.toggle('sidebar-lg-show');
  };

  const onCollapse = () => {
    document.querySelector('body')?.classList.toggle('sidebar-minimized');
    const btnCollapse = document.querySelector('div.layout-aside button.btn span span');
    if (btnCollapse?.classList.contains('hidden'))
      setTimeout(() => btnCollapse?.classList.toggle('hidden'), 400);
    else btnCollapse?.classList.toggle('hidden');
  };

  const onNavClick = () => {
    if (window.screen.width < 1024) removeSideBar();
  };

  return (
    <div className='layout-container'>
      <Header onBarsClick={onBarsClick} />
      <div className='layout-side-container'>
        <div className='layout-aside'>
          <nav>
            <ul>
              {Nav(1).map(({ href, title, Icon }) => (
                <li key={title}>
                  <div role='button' tabIndex={0} onClick={onNavClick} onKeyDown={onNavClick}>
                    <Link href={href}>
                      <a
                        className={getClass(router.asPath.split('/')[1] === href.split('/')[1] ? 'is-active' : '')}>
                        <span><Icon className='menu-sidebar-icon' /></span>
                        <p>{title}</p>
                      </a>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
          <button className='btn' onClick={onCollapse}>
            <span>
              <FaAngleDoubleLeft /><span>Collapse Sidebar</span>
            </span>
          </button>
        </div>
      </div>
      <main id='layout-main'>
        <div className='container-fluid mb-4'>{children}</div>
        <footer className='footer' style={{ backgroundColor: '#FFF' }}>
          <span className='powered'>Powered by</span>
          <span className='logo-footer'>
            <GiWashingMachine className='logo-icon' />
            <span className='logo-text'>
              Smart<span>Laundry</span>
            </span>
          </span>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
