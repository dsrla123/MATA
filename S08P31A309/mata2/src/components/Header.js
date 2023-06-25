import React,{ useEffect,useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

const Header = (props) => {
  const [services,setServices]=useState([{id:-1}])

  const dropdown = () => {
    document.getElementById("nav-content").classList.toggle("hidden");
  }
  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-700 p-2">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54"
             xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/>
        </svg>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="font-semibold text-xl text-white tracking-tight">MATA2</span>
        </Link>
      </div>
      <div className="block lg:hidden">
        <button onClick={dropdown}
                className="flex items-center px-3 py-2 border rounded text-white border-teal-400 hover:text-white hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
          </svg>
        </button>
      </div>
      <div id="nav-content" className="w-full lg:flex lg:w-auto hidden">
        {!props.state.user.name ? ( <div className="text-sm lg:flex-grow lg:items-center lg:justify-end">
          <Link to="/"
             className="block no-underline mt-2 lg:mt-1 lg:inline-block text-white hover:text-blue-200 hover:scale-105 mr-4">
            홈
          </Link>
          <Link to="/login"
             className="block no-underline mt-2 lg:inline-block text-white hover:text-blue-200 hover:scale-105 mr-4 ">
            로그인
          </Link>
        </div>) : (
        <div className="text-sm lg:flex-grow lg:items-center lg:justify-end">
          <Link to={`/service/${props.state.headService}/dashboard`}
             className="block no-underline mt-2 lg:mt-1 lg:inline-block text-white hover:text-blue-200 hover:scale-105 mr-4">
            {props.state.user.name}의 대시보드
          </Link>
 
          <Link to="/logout"
             className="block no-underline mt-2 lg:inline-block text-white hover:text-blue-200 hover:scale-105 mr-4 ">
            로그아웃
          </Link>
        </div>)}
      </div>
    </nav>
  );
};

export default Header;