import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { connect } from 'react-redux';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { FcAreaChart } from 'react-icons/fc';
import { IoMdCalendar } from 'react-icons/io';
import LoadingData from './LoadingData';
import InputField from '@components/fields/InputField';
import currencyFormat from '@utils/currencyFormat';
import DashboardAct from '@action/DashboardAction';
import { RootState } from '@store/store';

interface IProps {
  userData: {
    _id: string,
    laundry: {
      _id: string,
    }
	} | null;
}

const IncomeExpensesChart: React.FC<IProps> = ({ userData }) => {
  const chart = useRef<any>();
  const [tootipTitle, setTootipTitle] = useState(moment(new Date()).utc().format('yyyy-MM'));
  const [loadData, setLoadData] = useState<{loading: boolean; error: string | boolean}>({loading: true, error: false});
  const [data, setData] = useState({
    labels: [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
      'Agustus', 'September', 'Oktober', 'November', 'Desember' ],
    datasets: [
      {
        label: 'Pendapatan',
        data: [70, 40, 30, 90, 70, 100, 30],
        borderColor: 'rgba(20, 184, 166, 0.6)',
        backgroundColor: 'rgba(20, 184, 166, 0.3)',
        tension: 0.2,
        fill: true
      },
      {
        label: 'Pengeluaran',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgba(244, 63, 94, 0.6)',
        backgroundColor: 'rgba(244, 63, 94, 0.3)',
        tension: 0.2,
        fill: true
      },
    ]
  });

  const fetchData = async (year?: number) => {
    setLoadData({loading: true, error: false});
    const response = await DashboardAct.incomeExpenseChart(userData?._id, userData?.laundry?._id, year);
    if (response.status === 200 && response.result) {
      setLoadData(v => ({...v, loading: false}));
      setData(v => ({
        ...v,
        datasets: [
          {
            ...v.datasets[0],
            data: v.labels.map((month: string) => {
              const idx = response.result.income.findIndex((v: {month: string, total: number}) => v.month === month);
              if (idx > -1) return response.result.income[idx].total;
              return 0;
            })
          },
          {
            ...v.datasets[1],
            data: v.labels.map((month: string) => {
              const idx = response.result.expenses[0].stock_in_out.findIndex(
                (v: {month: string, total: number}) => v.month === month
              );
              if (idx > -1) return response.result.expenses[0].stock_in_out[idx].total;
              return 0;
            })
          }
        ]
      }));
    } else {
      setLoadData({loading: false, error: response.message || 'Terjadi Kesalahan'});
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let myChart: any;
    if (chart.current) {
      chart.current.style.height = '300px';
      const ctx = chart.current.getContext('2d');
      myChart = new Chart(ctx, {
        type:'line',
        data: data,
        options: {
          elements: {
            line: {
              tension: 0.000001
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function(tooltipItem: any) {
                  return `${tooltipItem[0].label} ${tootipTitle.split('-')[0]}`;
                },
                label: function(tooltipItem: any) {
                  return currencyFormat(tooltipItem.raw);
                }
              }
            },
            legend: {
              display: true,
              position: 'bottom'
            },
          },
          scales: {
            y: {
              ticks: {
                callback: function(value) {
                  return currencyFormat(value);
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          animations: {
            y: {
              duration: 2000,
              from: 500
            }
          },
          maintainAspectRatio: false
        }
      });
    }

    return () => myChart?.destroy();
  }, [data]);

  return (
    <Card className='box-dashboard'>
      <CardHeader>
        <div className='d-flex align-items-center justify-content-between w-100'>
          <h6 className='mb-0 d-flex align-items-center'>
            <FcAreaChart className='icon-chart' />
            <p className='ml-3 mb-0'>
              Transaksi tahun {moment(tootipTitle).format('YYYY')}
            </p>
          </h6>
          <Form
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onSubmit={()=>{}}
            render={
              () => (
                <form className='form-date-chart'>
                  <InputField name='start' type='month' className='input-calendar'
                    style={{color: 'transparent'}} onChange={(e) => {
                      setTootipTitle(moment(new Date(e.target.value)).utc().format('yyyy-MM'));
                      fetchData(Number(e.target.value.split('-')[0]));
                    }} />
                  <IoMdCalendar className='icon-calendar' />
                </form>
              )
            }
          />
        </div>
      </CardHeader>
      <CardBody>
        {LoadingData(loadData.loading, loadData.error, <canvas ref={chart}></canvas>)}
      </CardBody>
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  userData: state.AuthReducer.userData
});

export default connect(mapStateToProps)(IncomeExpensesChart);
