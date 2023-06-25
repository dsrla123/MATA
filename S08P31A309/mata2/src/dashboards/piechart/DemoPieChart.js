import axios from 'axios';
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import DropdownComponent from '../../components/DropdownComponent';

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default class DemoPieChart extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-active-shape-y93si';

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      dataClass:0,
      transformedData:[[{name: "no data", value: 1}]],
      dropdownTitle: "디바이스 비율"
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(selectedValue) {
    if(selectedValue === "디바이스 비율")
      this.setState({
        dataClass:0,
        dropdownTitle: "디바이스 비율"
    })
    else if(selectedValue === "유입 경로 비율"){
      this.setState({
        dataClass:1,
        dropdownTitle: "유입 경로 비율"
      })
    }
    // 선택된 값에 대한 로직 처리 등을 수행
  }

  componentDidMount(){
    const projectID = window.location.href.split('/')[4];
    const du_BASEURL=`https://mata2.co.kr/api/v1/analytics/durations_all?basetime=${Date.now()-3600000}&projectId=${projectID}`;
    const re_BASEURL=`https://mata2.co.kr/api/v1/analytics/refers_all?basetime=${Date.now()-3600000}&projectId=${projectID}`;
    const headers = {
      "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
      'Content-type': 'application/json',
    }

    const transformedData = [];

    axios.get(du_BASEURL, { headers })
      .then((res) => {
        const durations_all_Data = res.data.reduce((result, item) => {
          const { screenDevice, totalSession } = item;
          const existingItem = result.find(obj => obj.name === screenDevice);

          if (existingItem) {
            existingItem.value += totalSession;
          } else {
            result.push({ name: screenDevice, value: totalSession });
          }

          return result;
        }, []);
        if (!durations_all_Data.length) durations_all_Data.push({ name: "no data", value: 1 });
        transformedData.push(durations_all_Data);

        axios.get(re_BASEURL, { headers })
          .then((res) => {
            console.log('파이차트', res.data)
            const refers_all_data = res.data.reduce((result, item) => {
              // const domain = item.locationFrom.split('/')[2].split('.')[1];
              if (item.locationFrom) {
                const domain = item.locationFrom.split('/')[2];
                const existingItem = result.find(obj => obj.name === domain);

                if (existingItem) {
                  existingItem.value += item.totalJournal;
                } else {
                  if (domain) {
                    console.log(domain)
                    result.push({ name: domain, value: item.totalJournal });
                  }
                }
              }
              return result;
            }, []);
            console.log('파이222', refers_all_data)
            if (!refers_all_data.length) refers_all_data.push({ name: "no data", value: 1 });
            transformedData.push(refers_all_data);
            this.setState({
              transformedData
            });
          })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {

    return (
      <>
        <DropdownComponent menus={["디바이스 비율", "유입 경로 비율"]} onSelect={this.handleSelect} title={this.state.dropdownTitle} ></DropdownComponent>
        <ResponsiveContainer width="100%" height="85%">
          <PieChart width={400} height={400}>
            <Pie
              activeIndex={this.state.activeIndex}
              activeShape={renderActiveShape}
              data={this.state.transformedData[this.state.dataClass]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={this.onPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
      </>
    );
  }
}
