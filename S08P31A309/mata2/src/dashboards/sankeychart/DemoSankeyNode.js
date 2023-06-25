import React from "react";
import { Rectangle, Layer } from "recharts";

export default function DemoSankeyNode({
                                         x,
                                         y,
                                         width,
                                         height,
                                         index,
                                         payload,
                                         containerWidth,
                                         colors,
                                         onNodeDoubleClick
                                       }) {
  const isOut = x + width + 6 > containerWidth;
  const handleNodeDoubleClick = () => {
    onNodeDoubleClick(payload.name); // 클릭 시 payload.name 값을 전달하여 핸들러 함수 호출
  };
  return (
    <Layer key={`CustomNode${index}`} onDoubleClick={handleNodeDoubleClick}>
      <Rectangle
       x={x}
       y={y}
       width={width}
       height={height}
       fill={colors[index % colors.length]}
       fillOpacity="1"
       />
      {/* <image
        x = {x-payload.value/2}
        y = {y}
        width = {payload.value}
        height = {payload.value}
        xlinkHref = {"https://w7.pngwing.com/pngs/1019/456/png-transparent-js-logo-logos-logos-and-brands-icon-thumbnail.png"}
      >
      </image> */}
      <text
        textAnchor={isOut ? "end" : "start"}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="14"
        stroke="#333"
      >
        {payload.name}
      </text>
      <text
        textAnchor={isOut ? "end" : "start"}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 13}
        fontSize="12"
        stroke="#333"
        strokeOpacity="0.5"
      >
        {payload.value + "명"}
      </text>
    </Layer>
  );
}
