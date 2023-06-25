import {Outlet} from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardMain from "../dashboards/DashboardMain";
import { useEffect } from "react";
const DashboardLayout = (props) => {
  return (
    <div>
      <Header state={props.state}/>
      
      
      <div className='flex'>
        <div>
        <Sidebar state={props.state}/>
        </div>
        {props.children}
      </div>
      
    </div>
  )
}

export default DashboardLayout;