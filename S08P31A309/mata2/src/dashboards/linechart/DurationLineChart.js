import React, { PureComponent } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import DropdownComponent from '../../components/DropdownComponent';
import axios from 'axios';
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default class DurationsLineChart extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/stacked-area-chart-ix341';
  constructor(props) {
    super(props);
    this.state = {
      durationsData:[],
      interval:'10m',
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  averageDuration  (dataPoint) {
    return dataPoint.totalDuration / dataPoint.totalSession;
  };
  handleSelect(selectedValue) {
    this.setState({interval:selectedValue})
    // 선택된 값에 대한 로직 처리 등을 수행
  }
  componentDidMount(){
    const projectID = window.location.href.split('/')[4];
    const url=`${process.env.REACT_APP_HOST}/v1/analytics/durations?basetime=${Date.now()}&interval=${this.state.interval}&projectId=${projectID}`
      const headers = {
        "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-type': 'application/json',
      }
      axios.get(url,{headers})
      .then((res)=>{
        const sessionByTimestamp = {};
        for (let i = 0; i < res.data.length; i++) {
          const el = res.data[i];
          if (!sessionByTimestamp[el.updateTimestamp]) {
            sessionByTimestamp[el.updateTimestamp] = {};
          }
          if (!sessionByTimestamp[el.updateTimestamp].totalSession) {
            sessionByTimestamp[el.updateTimestamp].totalSession = 0;
          } sessionByTimestamp[el.updateTimestamp].totalSession += el.totalSession;
          if(!sessionByTimestamp[el.updateTimestamp].totalDuration){
            sessionByTimestamp[el.updateTimestamp].totalDuration=0
          } sessionByTimestamp[el.updateTimestamp].totalDuration+=el.totalDuration
        }
        
        const sessionByTimestampObject = Object.entries(sessionByTimestamp).map(([timestamp, values]) => {
          return {timestamp:new Date( parseInt(timestamp)),...values};
        });
        const sessionByTimestampArray=Object.values(sessionByTimestampObject)
        const sortedData = sessionByTimestampArray.sort((a, b) => {
          const timestampA = Date.parse(a.timestamp);
          const timestampB = Date.parse(b.timestamp);
          return timestampA - timestampB;
        });      
        this.setState({
          durationsData:sortedData
        })
    })
      .catch((err)=>{
        console.log('영역 데이터 실패',err)
      })
    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.interval !== this.state.interval) {
      const url=`${process.env.REACT_APP_HOST}/v1/analytics/durations?basetime=${Date.now()}&interval=${this.state.interval}&projectId=15`
      const headers = {
        "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-type': 'application/json',
      }
      axios.get(url,{headers})
      .then((res)=>{
        const sessionByTimestamp = {};
        for (let i = 0; i < res.data.length; i++) {
          const el = res.data[i];
          if (!sessionByTimestamp[el.updateTimestamp]) {
            sessionByTimestamp[el.updateTimestamp] = {};
          }
          if (!sessionByTimestamp[el.updateTimestamp].totalSession) {
            sessionByTimestamp[el.updateTimestamp].totalSession = 0;
          } sessionByTimestamp[el.updateTimestamp].totalSession += el.totalSession;
          if(!sessionByTimestamp[el.updateTimestamp].totalDuration){
            sessionByTimestamp[el.updateTimestamp].totalDuration=0
          } sessionByTimestamp[el.updateTimestamp].totalDuration+=el.totalDuration
        }
        
        const sessionByTimestampObject = Object.entries(sessionByTimestamp).map(([timestamp, values]) => {
          return {timestamp:new Date( parseInt(timestamp)),...values};
        });
        const sessionByTimestampArray=Object.values(sessionByTimestampObject)
        const sortedData = sessionByTimestampArray.sort((a, b) => {
          const timestampA = Date.parse(a.timestamp);
          const timestampB = Date.parse(b.timestamp);
          return timestampA - timestampB;
        });      
        this.setState({
          durationsData:sortedData
        })
    })
      .catch((err)=>{
        console.log('영역 데이터 실패',err)
      })
    }
  }

  render() {
    return (
      <>
      <DropdownComponent menus={['10m','1h','1d']} onSelect={this.handleSelect} title='interval'></DropdownComponent>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          width={500}
          height={400}
          data={this.state.durationsData? this.state.durationsData :data }
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip wrapperStyle={{ width: 70, height: 50 }} contentStyle={{ fontSize: '13px' }}  labelStyle={{ fontSize: '16px' }}/>
          <Line type="monotone" dataKey="totalSession" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Line type="monotone" dataKey={this.averageDuration} stackId="2" stroke="green" fill="green" />
        </LineChart>
      </ResponsiveContainer>
      </>
    );
  }
}
