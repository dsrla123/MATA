import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Dropdown } from 'reactstrap';
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    
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


// const DemoBarChart = () => {
//   const data = [
//     {
//       name: 'Page A',
//       uv: 4000,
//       pv: 2400,
//       amt: 2400,
//     },
//     {
//       name: 'Page B',
//       uv: 3000,
//       pv: 1398,
//       amt: 2210,
//     },
//     {
//       name: 'Page C',
//       uv: 2000,
//       pv: 9800,
//       amt: 2290,
//     },
//     {
//       name: 'Page D',
//       uv: 2780,
//       pv: 3908,
//       amt: 2000,
//     },
//     {
//       name: 'Page E',
//       uv: 1890,
//       pv: 4800,
//       amt: 2181,
//     },
//     {
//       name: 'Page F',
//       uv: 2390,
//       pv: 3800,
//       amt: 2500,
//     },
//     {
//       name: 'Page G',
//       uv: 3490,
//       pv: 4300,
//       amt: 2100,
//     },
//   ];
//   return (
//     <div>
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           width={500}
//           height={300}
//           data={data}
//           margin={{
//             top: 20,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="pv" stackId="a" fill="#8884d8" />
//           <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
//         </BarChart>
//       </ResponsiveContainer>      
//     </div>
//   );
// };

// export default DemoBarChart;
export default class ReferBarChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [] // 초기 상태값으로 빈 배열을 설정
    };
  }
  componentDidMount() {
    const projectID = window.location.href.split('/')[4];
    const url=`${process.env.REACT_APP_HOST}/v1/analytics/refers_all?basetime=${Date.now()-3600000}&projectId=${projectID}`
    const headers = {
      "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
      'Content-type': 'application/json',
    }
    axios.get(url,{headers})
    .then((res)=>{
      this.setState(
        {refersArray:res.data}
      )
    })
    .catch((err)=>{
      console.log('refer실패',err)
    })
  }
  render() {
    return (
      <>
  
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          width={500}
          height={300}
          data={this.state.refersArray? this.state.refersArray : data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="locationFrom" />
          <YAxis />
          <Tooltip  wrapperStyle={{ width: 70, height: 50 }} contentStyle={{ fontSize: '13px' }}  labelStyle={{ fontSize: '16px' }}/>
          <Legend />
          <Bar dataKey="totalJournal" stackId="a" fill="#8884d8" />
          {/* <Bar dataKey="uv" stackId="a" fill="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>
      </>
    );
  }
}
