import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { FcComboChart } from 'react-icons/fc';
import { IoMdCalendar } from 'react-icons/io';
import Chart from 'chart.js/auto';
import { connect } from 'react-redux';
import moment from 'moment';
import LoadingData from './LoadingData';
import currencyFormat from '@utils/currencyFormat';
import getAllDaysInMonth from '@utils/getAllDaysInMonth';
import DashboardAct from '@action/DashboardAction';
import { RootState } from '@store/store';
import InputField from '@components/fields/InputField';

interface IProps {
  userData: {_id: string} | null
}

const MothlyChart: React.FC<IProps> = ({ userData }) => {
  const chart = useRef<any>();
  const [tootipTitle, setTootipTitle] = useState(moment(new Date()).utc().format('yyyy-MM'));
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | boolean>(false);
  const [bar, setBar] = useState({
    labels: getAllDaysInMonth(new Date().getFullYear(), new Date().getMonth()),
    datasets: [{
      label: 'Transaksi Laundry',
      fill: true,
      backgroundColor: getAllDaysInMonth(new Date().getFullYear(), new Date().getMonth())
        .map(() => '#14b8a6'),
      data: getAllDaysInMonth(new Date().getFullYear(), new Date().getMonth())
        .map(() => 0)
    }]
  });

  const fetchData = async (data?: {month: number; year: number}) => {
    setLoadingData(true);
    setErrorData(false);
    const response = await DashboardAct.chartMonthly(userData?._id, data);
    if (response.status === 200 && response.result.length) {
      if (data?.month && data?.year) {
        const date = new Date(`${data.year}-${data.month}`);
        setBar(v => ({
          ...v,
          labels: getAllDaysInMonth(date.getFullYear(), date.getMonth()),
        }));
      }
      setBar(v => ({
        ...v,
        datasets: [{
          ...v.datasets[0],
          data: getAllDaysInMonth(new Date().getFullYear(), new Date().getMonth())
            .map((day) => {
              if (response.result.filter((item: any) => item._id === day).length) {
                // return response.result.filter((item: any) => item.dayOfMonth === day)[0].totalPrice;
                return response.result.filter((item: any) => item._id === day)[0].totalIncome;
              }
              return 0;
            })
        }]
      }));
    } else {
      setErrorData(response.message || 'Terjadi kesalahan');
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let myBarChart: any;
    if (chart.current) {
      chart.current.style.height = '350px';
      const ctx = chart.current.getContext('2d');
      myBarChart = new Chart(ctx, {
        type:'bar',
        data: bar,
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                title: function(tooltipItem: any) {
                  return moment(`${tootipTitle}-${tooltipItem[0].label}`).format('DD MMMM YYYY');
                },
                label: function(tooltipItem: any) {
                  return currencyFormat(tooltipItem.raw);
                }
              }
            },
            legend: {
              display: false
            }
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
              duration: 1500,
              from: 500,
            }
          },
          maintainAspectRatio: false
        }
      });
    }

    return () => myBarChart?.destroy();
  }, [bar]);

  return (
    <Card className='box-dashboard'>
      <CardHeader>
        <div className='d-flex align-items-center justify-content-between w-100'>
          <h6 className='mb-0 d-flex align-items-center'>
            <FcComboChart className='icon-chart' />
            <p className='ml-3 mb-0'>
              Transaksi bulan {moment(tootipTitle).format('MMMM YYYY')}
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
                      fetchData({
                        month: Number(e.target.value.split('-')[1]),
                        year: Number(e.target.value.split('-')[0])
                      });
                    }} />
                  <IoMdCalendar className='icon-calendar' />
                </form>
              )
            }
          />
        </div>
      </CardHeader>
      <CardBody>
        {LoadingData(loadingData, errorData, <canvas ref={chart}></canvas>)}
      </CardBody>
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  userData: state.AuthReducer.userData
});

export default connect(mapStateToProps)(MothlyChart);
