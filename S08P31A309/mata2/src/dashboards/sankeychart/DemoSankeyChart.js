import React,{useEffect, useState} from "react";
import { Sankey, Tooltip } from "recharts";
import DemoSankeyLink from "./DemoSankeyLink";
import DemoSankeyNode from "./DemoSankeyNode";
import axios from "axios";

const colors = ["#F9DB6D", "#40F99B", "#AFC2D5", "#1F8360", "#EC9192", "#919191", "#ABCDEF", "#1A2B3C", "#9F8E7D", "#3912EF"];

export default function DemoSankeyChart() {
  const numColors = colors.length;
  const [data, setData] = useState(null);
  const [colorGradients,setColorGradients]=useState(null)
  const [axios_data, setAxiosData] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null);

  // 노드 선택 했을때
  const handleNodeDoubleClick = (nodeName) => {
    if(!Object.keys(axios_data).includes(nodeName)){
      alert('마지막 노드입니다.')
    }
    else{setSelectedNode(nodeName);} // 클릭한 payload.name 값을 selectedNode 변수에 저장
  };

  // selectedNode 시작 노드 선택 -> 그림 초기화, node, link 재설정
  useEffect(() => {
    // 그림 초기화
    setData(null)
    setColorGradients(null)

    if(selectedNode) {
      // 시작 노드 선택
      const node = []
      const link = []
      node.push({name: selectedNode})
      let i = 0;
      Object.keys(axios_data[selectedNode]).forEach((key) => {
        node.push({name: key})
        link.push({source: 0, target: ++i, value: axios_data[selectedNode][key]})
      })

      setData({nodes: node, links: link})
    }
  }, [selectedNode])

  useEffect(() => {
    if(axios_data) {

      let temp_url = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      Object.keys(axios_data).forEach((key) => {
        if(temp_url.length > key.length && key.length != 0) {
          temp_url = key
        }
      })
      if(temp_url != "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        setSelectedNode(temp_url)
    }
  }, [axios_data])

  // axios로 데이터 받아오기
  useEffect(()=>{
    const projectID = window.location.href.split('/')[4];
    const url=`${process.env.REACT_APP_HOST}/v1/analytics/journals_all?basetime=${Date.now()-3600000}&projectId=${projectID}`
    const headers = {
      "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
      'Content-type': 'application/json',
    }
    axios.get(url,{headers})
      .then((res)=>{

        const result = res.data.reduce((acc, item) => {
          const locationFrom = item.locationFrom;
          const locationTo = item.locationTo;
          const totalJournal = item.totalJournal;

          if (!acc[locationFrom]) {
            acc[locationFrom] = {};
          }
          acc[locationFrom][locationTo] = totalJournal;
          return acc;
        }, {});
        setAxiosData(result)
      })
      .catch((err)=>{
        console.log('axios fail',err)
      })
  },[])

  // 데이터 있으면 색 입히기
  useEffect(()=>{
    if(data) {
      const newColorgradient = data.links.map((link) => {
        return {
          source: colors[link.source % numColors],
          target: colors[link.target % numColors]
        }
      })
      setColorGradients((newColorgradient))
    }
  }, [data])



  return data && colorGradients ? (
    <div className="sankey-charts">
      <div>
        <pre>Sankey with sorted nodes</pre>
        <Sankey
          width={960}
          height={500}
          margin={{ top: 20, bottom: 20 }}
          data={data}
          nodeWidth={10}
          nodePadding={60}
          linkCurvature={0.61}
          iterations={0}
          link={<DemoSankeyLink colorGradients={colorGradients} />}
          node={<DemoSankeyNode containerWidth={960} colors={colors} onNodeDoubleClick={handleNodeDoubleClick} />}
        >
          <Tooltip wrapperStyle={{ width: 70, height: 50 }} contentStyle={{ fontSize: '13px' }}  labelStyle={{ fontSize: '16px' }} />
        </Sankey>
      </div>
      <br />
    </div>
  ) : (
    axios_data ? (
      <div>데이터 없음...</div>
    ) : (
      <div>Loading...</div>
    )
  );
}

// export default DemoSankeyChart;
