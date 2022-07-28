import { IconType } from 'react-icons';
import { FaHome, FaMoneyBillWave, FaShoppingBasket } from 'react-icons/fa';
import { GiWashingMachine } from 'react-icons/gi';
import { MdOutlineInventory } from 'react-icons/md';

interface INav {
  href: string,
  title: string,
  Icon: IconType
}

const Nav = (roleCode: number): Array<INav> => {
  if (roleCode === 1) {
    return [
      {
        href: '/dashboard',
        title: 'Dashboard',
        Icon: FaHome,
      },
      {
        href: '/service',
        title: 'Servis',
        Icon: GiWashingMachine
      },
      {
        href: '/promo',
        title: 'Promo',
        Icon: FaMoneyBillWave
      },
      {
        href: '/order',
        title: 'My Order',
        Icon: FaShoppingBasket
      },
      {
        href: '/stockofgoods',
        title: 'Stok Barang',
        Icon: MdOutlineInventory
      },
    ];
  }

  return [{
    href: '/dashboard',
    title: 'Dashboard',
    Icon: FaHome,
  }];
};

export default Nav;
