/* eslint-disable react/require-default-props */
import React, { ReactNode } from 'react';
import { ToolkitContextType } from 'react-bootstrap-table2-toolkit';
import { Row, Col } from 'reactstrap';
import CSS from 'csstype';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { SortOrder } from 'react-bootstrap-table-next';

interface ICustomBar {
  toolkitprops: ToolkitContextType,
  children?: (_handleChange: (_customInput?: any) => void) => ReactNode,
  searchBar?: boolean
}

const sortCaret = (order: SortOrder) => {
  if (!order) return (
    <span className='icon'>
      &nbsp;&nbsp;<FaCaretDown style={{ width: '0.7em' }} /><FaCaretUp style={{ width: '0.7em' }} />
    </span>
  );
  if (order === 'asc') {
    return (
      <span className='icon'>
        &nbsp;&nbsp;<FaCaretDown style={{ width: '0.7em' }} />
        <FaCaretUp style={{ color: '#ff7043', width: '0.7em' }} />
      </span>
    );
  }
  if (order === 'desc') {
    return (
      <span className='icon'>
        &nbsp;&nbsp; <FaCaretDown style={{ color: '#ff7043', width: '0.7em' }} />
        <FaCaretUp style={{ width: '0.7em' }} />
      </span>
    );
  }
  return null;
};

const CustomBar: React.FC<ICustomBar> = ({ toolkitprops, children, searchBar = true }) => {
  let input: HTMLInputElement | null = null;
  const handleChange = (customInput?: any) => {
    if (customInput) {
      toolkitprops.searchProps.onSearch(customInput);
    }
    else toolkitprops.searchProps.onSearch(input?.value as string);
  };

  return (
    <Row>
      <Col md={searchBar ? '6' : '12'}>
        <div className={searchBar ? 'float-left' : ''}>
          {children && children(handleChange)}
        </div>
      </Col>
      {searchBar &&
        <Col md='6'>
          <div className='search-wrapper float-right'>
            <div>
              <input
                className='form-control search-bar'
                ref={(n) => { input = n; }}
                type='text'
                autoComplete='off'
                placeholder='&#61442; Search'
                onKeyUp={() => handleChange()}
              />
            </div>
          </div>
        </Col>
      }
    </Row>
  );
};

const tableStyle = (minWidth?: number): CSS.Properties => ({
  textAlign: 'left',
  padding: '0.95rem 0.75rem',
  verticalAlign: 'middle',
  whiteSpace: 'normal',
  minWidth: minWidth ? `${minWidth}px` : '120px',
});

export {
  tableStyle,
  CustomBar,
  sortCaret
};
