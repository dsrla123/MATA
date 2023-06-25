import React, {useEffect, useState, useRef} from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import ServiceCustom from './views/ServiceCustom';
import DashboardLayout from './layout/DashboardLayout';
import WelcomeLayout from "./layout/WelcomeLayout";
import Welcome from './views/Welcome';
import Login from "./views/Login";
import Logout from "./views/Logout";
import SignUp from './views/SignUp';
import ServiceAdd from './views/ServiceAdd';
import DashboardMain from './dashboards/DashboardMain';
import Test from './views/Test';
import axios from "axios";
import ServiceStart from './views/ServiceStart';
import TagManager from 'npm-mata';
const mata = new TagManager("token0asdf1");

function App() {
  const location = useLocation();
  useEffect(() => {
    mata.then(_ => _.attach());
    return () => {
      mata.then(_ => _.detach());
    }
  }, [location])

  
  const[isLoggedIn,setIsLoggedIn]=useState(false)
  const [serviceList,setServiceList]=useState([])
  const [headService,setHeadService]=useState(-1)
  // GLOBAL: ************** 사용자 정보 **************
  const [user, setUser] = useState({
  });
  const userInfo = async (accessToken) => {
    if(!accessToken || accessToken=='') return;

    accessToken = sessionStorage.getItem("accessToken");
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
    }
    const formData= {
      "grantType": "Bearer",
      "accessToken": accessToken
    }
    axios({
      //request
      method: "get",
      url: process.env.REACT_APP_HOST+"/v1/member/info",
      responseType: "type",
      headers: headers
  }).then(function (response) {
      const userResponse=JSON.parse(response.data)
      setUser({
        id: userResponse.id,
        email: userResponse.email,
        name: userResponse.name
      });
      setIsLoggedIn(true)
  })
    .catch(error => {
        console.error(error);
    });
  }
  // GLOBAL: ************** 사용자 정보 **************

  useEffect(() => {
    
    let accessToken = sessionStorage.getItem("accessToken");
    
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
    }
    if (accessToken) {
      axios({method:"get",url:process.env.REACT_APP_HOST+"/v1/project/",headers:headers})
      .then(res=>{
        setServiceList(res.data)
        if(res.data[0].id){setHeadService(res.data[0].id)}
      })
      .catch(err=>{
      })
      axios({
        //request
        method: "get",
        url: process.env.REACT_APP_HOST+"/v1/member/info",
        responseType: "type",
        headers: headers
    }).then(function (response) {
        const userResponse=JSON.parse(response.data)
        setUser({
          id: userResponse.id,
          email: userResponse.email,
          name: userResponse.name
        });
    })
      .catch(error => {
          console.error(error);
      });
      setIsLoggedIn(true)
    }
    
    const formData= {
      "grantType": "Bearer",
      "accessToken": accessToken
    }
    
    
    // accessToken = 'dummy-token'; // 더미 데이터
    // userInfo(accessToken);

  },[location]);
  useEffect(() => {
    let accessToken = sessionStorage.getItem("accessToken");
    
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
    }
    if (accessToken) {
      axios({method:"get",url:process.env.REACT_APP_HOST+"/v1/project/",headers:headers})
      .then(res=>{
        setServiceList(res.data)
        if(res.data[0].id){setHeadService(res.data[0].id)}
      })
      .catch(err=>{
      })

      axios({
        //request
        method: "get",
        url: process.env.REACT_APP_HOST+"/v1/member/info",
        responseType: "type",
        headers: headers
    }).then(function (response) {
        const userResponse=JSON.parse(response.data)
        setUser({
          id: userResponse.id,
          email: userResponse.email,
          name: userResponse.name
        });
  
    })
      .catch(error => {
          console.error(error);
      });
      setIsLoggedIn(true)
    }
    
    const formData= {
      "grantType": "Bearer",
      "accessToken": accessToken
    }


 
  },[sessionStorage.getItem('accessToken')]);



  return (
      <Routes>
        <Route path='/' element={
          <WelcomeLayout state={ {user: user, serviceList:serviceList, headService:headService} }>
            <Welcome/>
          </WelcomeLayout>
        }/>
        <Route path='/login' element={
          <WelcomeLayout state={ {user: user, serviceList:serviceList} }>
          <Login/>
          </WelcomeLayout>
        }/>
        <Route path='/logout' element={
          <WelcomeLayout state={ {user: user} }>
            <Logout state={ {user: user, setUser: setUser} }/>
          </WelcomeLayout>
        }/>
        <Route path='/signup' element={
          <WelcomeLayout state={ {user: user} }>
            <SignUp></SignUp>
          </WelcomeLayout>
        }/>
        <Route path='/service-add' element={
          <DashboardLayout state={ {user: user,serviceList:serviceList,headService:headService} } >
            <ServiceAdd state={ {user: user,serviceList:serviceList,headService:headService, isLoggedIn:isLoggedIn} }/>
          </DashboardLayout>
        }/>
        <Route path='/service-start' element={
          <DashboardLayout state={ {user: user,serviceList:serviceList,headService:headService} } >
            <ServiceStart/>
          </DashboardLayout>
        }/>
        <Route path='/service/:projectId/dashboard' element={
          <DashboardLayout state={ {user: user,serviceList:serviceList,headService:headService} }>
              <DashboardMain state={{user: user,serviceList:serviceList,headService:headService}}/>
          </DashboardLayout>
        }/>
        <Route path='/service/:projectId/setting' element={
          <DashboardLayout state={ {user: user,serviceList:serviceList,headService:headService} }>
            <ServiceCustom state={ {user: user,serviceList:serviceList,headService:headService} }/>
          </DashboardLayout>
        }/>
        <Route path='*' element={
          <DashboardLayout state={ {user: user,serviceList:serviceList,headService:headService} }>
            <ServiceStart/>
          </DashboardLayout>
        }/>
        <Route path='test' element={<Test/>}/>
      </Routes>
  )
}
export default App;