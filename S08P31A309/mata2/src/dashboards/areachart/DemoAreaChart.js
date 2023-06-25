import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

export default class DemoAreaChart extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/stacked-area-chart-ix341';
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      interval:'10m',
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleSelect(selectedValue) {
    this.setState({interval:selectedValue})
    // 선택된 값에 대한 로직 처리 등을 수행
  }
  componentDidMount(){
    const projectID = window.location.href.split('/')[4];
    const url=`${process.env.REACT_APP_HOST}/v1/analytics/components?basetime=${Date.now()}&interval=${this.state.interval}&projectId=${projectID}`
    const headers = {
      "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
      'Content-type': 'application/json',
    }
    axios.get(url,{headers})
    .then((res)=>{
      const timestampByscreenDevice = {};
      for (let i = 0; i < res.data.length; i++) {
        const el = res.data[i];
        if (!timestampByscreenDevice[el.updateTimestamp]) {
          timestampByscreenDevice[el.updateTimestamp] = {};
        }
        if (!timestampByscreenDevice[el.updateTimestamp][el.screenDevice]) {
          timestampByscreenDevice[el.updateTimestamp][el.screenDevice] = 0;
        } timestampByscreenDevice[el.updateTimestamp][el.screenDevice] += el.totalClick;
      }
      
      const timestampByscreenDeviceObject = Object.entries(timestampByscreenDevice).map(([timestamp, values]) => {
        return {timestamp:new Date( parseInt(timestamp)),...values};
      });
      const timestampByscreenDeviceArray=Object.values(timestampByscreenDeviceObject)
      const sortedData = timestampByscreenDeviceArray.sort((a, b) => {
        const timestampA = Date.parse(a.timestamp);
        const timestampB = Date.parse(b.timestamp);
        return timestampA - timestampB;
      });

      
      this.setState({
        data:sortedData
      })
  })
    .catch((err)=>{
      console.log('영역 데이터 실패',err)
    })
    
  }

  componentDidUpdate(prevProps, prevState) {
    const projectID = window.location.href.split('/')[4];
    if (prevState.interval !== this.state.interval) {
      const url=`${process.env.REACT_APP_HOST}/v1/analytics/components?basetime=${Date.now()}&interval=${this.state.interval}&projectId=${projectID}`
      const headers = {
        "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-type': 'application/json',
      }
      axios.get(url,{headers})
      .then((res)=>{
        const timestampByscreenDevice = {};
        for (let i = 0; i < res.data.length; i++) {
          const el = res.data[i];
          if (!timestampByscreenDevice[el.updateTimestamp]) {
            timestampByscreenDevice[el.updateTimestamp] = {};
          }
          if (!timestampByscreenDevice[el.updateTimestamp][el.screenDevice]) {
            timestampByscreenDevice[el.updateTimestamp][el.screenDevice] = 0;
          } timestampByscreenDevice[el.updateTimestamp][el.screenDevice] += el.totalClick;
        }
        
        const timestampByscreenDeviceObject = Object.entries(timestampByscreenDevice).map(([timestamp, values]) => {
          return {timestamp:new Date( parseInt(timestamp)),...values};
        });
        const timestampByscreenDeviceArray=Object.values(timestampByscreenDeviceObject)
        const sortedData = timestampByscreenDeviceArray.sort((a, b) => {
          const timestampA = Date.parse(a.timestamp);
          const timestampB = Date.parse(b.timestamp);
          return timestampA - timestampB;
        });      
        this.setState({
          data:sortedData
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
        <AreaChart
          width={500}
          height={400}
          data={this.state.data? this.state.data :data }
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
          <Tooltip wrapperStyle={{ width: 70, height: 50 }} contentStyle={{ fontSize: '13px' }}  labelStyle={{ fontSize: '16px' }} />
          <Area type="monotone" dataKey="tablet" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="phone" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          <Area type="monotone" dataKey="Desktop" stackId="1" stroke="#ffc658" fill="#ffc658" />
        </AreaChart>
      </ResponsiveContainer>
      </>
    );
  }
}
