import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { Card, CardBody, CardHeader } from 'reactstrap';
import Chart from 'chart.js/auto';
import { FcPieChart } from 'react-icons/fc';
import { IoMdCalendar } from 'react-icons/io';
import { connect } from 'react-redux';
import moment from 'moment';
import LoadingData from './LoadingData';
import DashboardAct from '@action/DashboardAction';
import { RootState } from '@store/store';
import currencyFormat from '@utils/currencyFormat';
import InputField from '@components/fields/InputField';

interface IProps {
  userData: {
    _id: string;
    laundry: {
      _id: string;
    }
  } | null
}

const ExpensesChart: React.FC<IProps> = ({ userData }) => {
  const chart = useRef<any>();
  const [tootipTitle, setTootipTitle] = useState(moment(new Date()).utc().format('yyyy-MM'));
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | boolean>(false);
  const [data, setData] = useState({
    labels: [
      'Eating',
      'Drinking',
      'Sleeping',
      'Designing',
      'Coding',
      'Cycling',
      'Running'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 90, 81, 56, 55, 40],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
  });

  const fetchData = async (data?: {month: number; year: number}) => {
    setLoadingData(true);
    setErrorData(false);
    const response = await DashboardAct.chartMonthlyExpenses(userData?.laundry?._id, data);
    if (response.status === 200 && response.result.length) {
      setData(v => ({
        labels: response.result.map((item: any) => item.itemName),
        datasets: [{
          ...v.datasets[0],
          data: response.result.map((item: any) => item.stock_in_out.length ? item.stock_in_out[0].totalExpenses : 0)
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
    let myRadarChart:any;
    if (chart.current) {
      chart.current.style.height = '350px';
      const ctx = chart.current.getContext('2d');
      myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                title: function(tooltipItem: any) {
                  return tooltipItem[0].label;
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
          elements: {
            line: {
              borderWidth: 3
            },
            point: {
              hitRadius: 40
            }
          },
          maintainAspectRatio: false
        }
      });
    }

    return () => myRadarChart?.destroy();
  }, [data]);

  return (
    <Card className='box-dashboard'>
      <CardHeader>
        <div className='d-flex align-items-center justify-content-between w-100'>
          <h6 className='mb-0 d-flex align-items-center'>
            <FcPieChart className='icon-chart' />
            <p className='ml-3 mb-0'>
              Pengeluaran bulan {moment(tootipTitle).format('MMMM YYYY')}
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

export default connect(mapStateToProps)(ExpensesChart);
