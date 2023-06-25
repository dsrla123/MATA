import React,{useState,useEffect} from 'react';
import './DashboardMain.css';
import DemoLineChart from "./linechart/DemoLineChart";
import DemoAreaChart from "./areachart/DemoAreaChart";
import DemoBarChart from "./barchart/DemoBarChart";
import DemoSankeyChart from "./sankeychart/DemoSankeyChart";
import DemoPieChart from "./piechart/DemoPieChart";
import Draggable, {DraggableCore} from 'react-draggable';
import { Resizable,ResizableBox } from 'react-resizable';
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DurationsAreaChart from './areachart/DurationsAreaChart';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReferBarChart from './barchart/ReferBarChart';
import { useNavigate } from 'react-router-dom';
// function DashboardMain() {

import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class ToolBoxItem extends React.Component {
  render() {
    return (
      <div
        className="toolbox__items__item"
        onClick={this.props.onTakeItem.bind(undefined, this.props.item)}
      >
        {this.props.item.i}
      </div>
    );
  }
}
class ToolBox extends React.Component {
  render() {
    return (
      <div className="toolbox">
        <span className="toolbox__title"> 제거한 차트들 </span>
        <div className="toolbox__items">
          {this.props.items.map(item => (
            <ToolBoxItem
              key={item.i}
              item={item}
              onTakeItem={this.props.onTakeItem}
            />
          ))}
        </div>
      </div>
    );
  }
}
class ToolboxLayout extends React.Component {
  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    initialLayout: (localStorage.getItem("my-grid-layout")? JSON.parse(localStorage.getItem("my-grid-layout")) :[
      {
        "w": 5,
        "h": 7,
        "x": 12,
        "y": 0,
        "i": "a",
        "moved": false,
        "static": false,
        "name": '데모라인차트'
      },
      {
        "w": 5,
        "h": 7,
        "x": 6,
        "y": 0,
        "i": "b",
        "moved": false,
        "static": false,
        "name": '데모라인차트'
      },
      {
        "w": 5,
        "h": 7,
        "x": 0,
        "y": 7,
        "i": "c",
        "moved": false,
        "static": false,
        "name": '데모라인차트'
      },
      {
        "w": 5,
        "h": 7,
        "x": 6,
        "y": 7,
        "i": "d",
        "moved": false,
        "static": false,
        "name": '데모라인차트'
      },

      {
        "w": 5,
        "h": 7,
        "x": 12,
        "y": 7,
        "i": "f",
        "moved": false,
        "static": false,
        "name": '듀레이션'
      },
    ])
  };

  state = {
    currentBreakpoint: "lg",
    compactType: null,
    mounted: false,
    layouts: { lg: this.props.initialLayout },
    toolbox: { lg: [] }
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM() {
    let component;
    let chartName
    return _.map(this.state.layouts[this.state.currentBreakpoint], l => {
      
      switch(l.i) {
        case "a":
          component = <DemoLineChart />;
          break;
        case "b":
          component = <ReferBarChart />;
          break;
        case "c":
          component = <DemoBarChart />;
          break
        case "d":
          component= <DemoPieChart />
          break
        case "e" :
          component= <DemoSankeyChart/>
          break
        case "f" :
          component= <DurationsAreaChart/>
          break  
        default :
        component= '기타입니다.'
      }
      switch(l.i) {
        case "a":
          chartName = "평균체류시간,"
          break;
        case "b":
          chartName = "유입 경로에 따른 세션 수"
          break;
        case "c":
          chartName = "컴포넌트 별 클릭수"
          break;
        case "d":
          chartName = "인터렉티브 파이차트"
          break;
        case "e":
          chartName = "여정 sankey차트"
          break;
        case "f" :
          chartName= "사용자 수와, 페이지, 집계단위별로"
          break 
        default:
          chartName='다른차트'
      }
      return (
        <div key={l.i} className={l.static ? "static" : ""}>
          <div className="hide-button cursor-pointer" onClick={this.onPutItem.bind(this, l)}>
            &times;
          </div>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {l.i} {chartName}
            </span>
          ) : (
            <span className="text">{l.i} {chartName}</span>
          )}
          <div className="h-100  ">
          
            {component}
          </div>

          
        </div>
      );
    });
  }

  onBreakpointChange = breakpoint => {
    this.setState(prevState => ({
      currentBreakpoint: breakpoint,
      toolbox: {
        ...prevState.toolbox,
        [breakpoint]:
          prevState.toolbox[breakpoint] ||
          prevState.toolbox[prevState.currentBreakpoint] ||
          []
      }
    }));
  };

  onCompactTypeChange = () => {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    this.setState({ compactType });
  };

  onTakeItem = item => {
    this.setState(prevState => ({
      toolbox: {
        ...prevState.toolbox,
        [prevState.currentBreakpoint]: prevState.toolbox[
          prevState.currentBreakpoint
        ].filter(({ i }) => i !== item.i)
      },
      layouts: {
        ...prevState.layouts,
        [prevState.currentBreakpoint]: [
          ...prevState.layouts[prevState.currentBreakpoint],
          item
        ]
      }
    }));
  };

  onPutItem = item => {
    this.setState(prevState => {
      return {
        toolbox: {
          ...prevState.toolbox,
          [prevState.currentBreakpoint]: [
            ...(prevState.toolbox[prevState.currentBreakpoint] || []),
            item
          ]
        },
        layouts: {
          ...prevState.layouts,
          [prevState.currentBreakpoint]: prevState.layouts[
            prevState.currentBreakpoint
          ].filter(({ i }) => i !== item.i)
        }
      };
    });
  };

  onLayoutChange = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
    this.setState({ layouts });
    localStorage.setItem("my-grid-layout", JSON.stringify(layout));
  };

  // onNewLayout = () => {
  //   this.setState({
  //     layouts: { lg: generateLayout() }
  //   });
  // };

  render() {
    return (
      <div >
        <div>
          현재 화면크기: {this.state.currentBreakpoint} (
          {this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <div className="row border border-b-gray-50 p-5 py-3 rounded-2xl gap-3">
          <div className='d-flex flex-row justify-content-space-between'>
          <div style={
            {textAlign: 'center',}
          }>충돌 설정:{" "}
          {_.capitalize(this.state.compactType) || "No Compaction"}
          </div>
          <button style={
            {textAlign: 'top',}
          } className='btn btn-light' onClick={this.onCompactTypeChange}>
          충돌 설정 변경
          </button>
          </div>
          <ToolBox className="row border border-b-gray-50 p-5 py-3 rounded-2xl"
          items={this.state.toolbox[this.state.currentBreakpoint] || []}
          onTakeItem={this.onTakeItem}
          />
          <button onClick={()=>{
            localStorage.setItem('my-grid-layout',JSON.stringify([
              {
                "w": 5,
                "h": 7,
                "x": 1,
                "y": 8,
                "i": "b",
                "moved": false,
                "static": false
              },
              {
                "w": 5,
                "h": 7,
                "x": 0,
                "y": 29,
                "i": "c",
                "moved": false,
                "static": false
              },
              {
                "w": 5,
                "h": 7,
                "x": 1,
                "y": 36,
                "i": "d",
                "moved": false,
                "static": false
              },
              {
                "w": 5,
                "h": 6,
                "x": 0,
                "y": 43,
                "i": "f",
                "moved": false,
                "static": false
              },
              {
                "w": 5,
                "h": 6,
                "x": 1,
                "y": 2,
                "i": "a",
                "moved": false,
                "static": false
              }
            ]))
            window.location.reload()
          }}>레이아웃 초기화</button>
        </div>
        {/* <button onClick={this.onNewLayout}>Generate New Layout</button> */}
        <div>
            유입경로 별 점유율
            <DemoSankeyChart />
        </div>
        


        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

// function generateLayout() {
//   return _.map(_.range(0, 4), function(item, i) {
//     var y = Math.ceil(Math.random() * 4) + 1;
//     return {
//       x: (_.random(0, 5) * 2) % 12,
//       y: Math.floor(i / 6) * y,
//       w: 2,
//       h: y,
//       i: i.toString(),
//       static: Math.random() < 0.05
//     };
//   });
// }
const DashboardMain = (props) => {
  const { projectId } = useParams();
  const [layout, setLayout] = useState ((localStorage.getItem("my-grid-layout")? JSON.parse(localStorage.getItem("my-grid-layout")) :[
    {
      "w": 5,
      "h": 7,
      "x": 12,
      "y": 0,
      "i": "a",
      "moved": false,
      "static": false,
      "name": '데모라인차트'
    },
    {
      "w": 5,
      "h": 7,
      "x": 6,
      "y": 0,
      "i": "b",
      "moved": false,
      "static": false,
      "name": '데모라인차트'
    },
    {
      "w": 5,
      "h": 7,
      "x": 0,
      "y": 7,
      "i": "c",
      "moved": false,
      "static": false,
      "name": '데모라인차트'
    },
    {
      "w": 5,
      "h": 7,
      "x": 6,
      "y": 7,
      "i": "d",
      "moved": false,
      "static": false,
      "name": '데모라인차트'
    },
    {
      "w": 5,
      "h": 7,
      "x": 12,
      "y": 7,
      "i": "f",
      "moved": false,
      "static": false,
      "name": '듀레이션'
    },
  ]));
  const navigate=useNavigate()

  useEffect(() => {
    const projectID = window.location.href.split('/')[4];
    const accessToken=sessionStorage.getItem('accessToken')
    const ownServiceIds=[]
    props.state.serviceList.forEach(element => {
      ownServiceIds.push(element.id)
    });
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
    }
    axios({method:"get",url:process.env.REACT_APP_HOST+"/v1/project/",headers:headers})
      .then(res=>{
       res.data.forEach(element => {
        ownServiceIds.push(element.id)

       });
       if (!ownServiceIds.includes(Number(projectID))){
        navigate('/notYourService')
  
      }
      })
      .catch(err=>{
        console.log(err)
      })
    const storedLayout = JSON.parse(localStorage.getItem("my-grid-layout")) || [];
    setLayout(storedLayout);
  },[]);

  const onLayoutChange = (newLayout) => {
    localStorage.setItem("my-grid-layout", JSON.stringify(newLayout));
    setLayout(newLayout);
  };
  return (
    <div className="dashboard flex-grow-1">
      <header className="header" >  
        {!props.state.user
          ? (<h1> 김 아무개의 대시보드 </h1>)
          : (<h1> {props.state.user.name}의 대시보드</h1>)
        }
      </header>
      <main className="main"  >
        {/* 대시보드 화면 구성 요소 */}
        <div className=" charts-container gap-3">
        
        </div>
        {/* <GridLayout
          className="layout"
          cols={12}
          rowHeight={30}
          width={1200}
          layout={layout}
          onLayoutChange={onLayoutChange}
        >
          <div key='a' data-grid={layout[0]}>
            방문자수 라인차트
            <DemoLineChart />
          </div>
          <div key='b' data-grid={layout[1]}>
            방문자수 라인차트2
            <DemoAreaChart />
          </div>
          <div key='c' data-grid={layout[2]}>
            페이지별 이탈
            <DemoBarChart />
          </div>
          <div key='d' data-grid={layout[3]}>
            유입경로 별 점유율
            <DemoPieChart />
          </div>
          <div key='e' data-grid={layout[4]}>
            유입경로 별 점유율
            <DemoSankeyChart />
          </div>
          
          
        </GridLayout> */}

        <ToolboxLayout/>


        
      </main>
    </div>
  );
}

export default DashboardMain;