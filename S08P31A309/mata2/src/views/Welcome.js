import React from 'react';
import backgroundImage from '../assets/Welcome.jpg'
import './Welcome.css'
const Welcome = () => {

  return (
    <div id='background'>
      <div id = 'content'>
        <div id='heroTitle'>
          <div id='MATA'>          MATA2</div>
          <div />
          <div id='main'>웹 로그 분석을 위한 서비스</div>
        </div>

        <div id='heroContent'>
          <div id='firstExplanation'>웹 로그 분석을 위한 서비스를 통해 여러분들의 사이트에서 인사이트를 얻어보세요!</div>
          {/* <div id='secondExplanation'>웹 로그 분석을 위한 서비스를 통해 여러분들의 사이트에서 인사이트를 얻어보세요.</div> */}
        </div>
      </div>
      <div className='h-12' />
    </div>
  );
};

export default Welcome;