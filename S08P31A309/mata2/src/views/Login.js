import React , { useState } from 'react';
import './Login.css';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
const Login = () => {
  const navigate=useNavigate()
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  function handleClick(e) {
    e.preventDefault();
    
    navigate('/signup')
  }
  function login (e) {
    e.preventDefault();
    const formData={
      email:email,
      password:password
    }
    const headers = {
      'Content-type': 'application/json'
    }    
    axios.post(process.env.REACT_APP_HOST+'/v1/member/login',formData,{headers})

    .then(response => {
      if (response.status==200) {
        sessionStorage.setItem('accessToken',response.data.accessToken)  
        window.location.replace('/')
      }else alert('틀림')
    })
    .catch(error => {
      console.error(error);
    });
  }
  return (
    <div id='loginBackground'>
      
      <form id='loginForm' onSubmit={login}>
        <div id='loginLogo'>로그인</div>
        <input className='inputField' type='email' placeholder='email' name='email' onChange={(event) => setEmail(event.target.value)}/>
        <input className='inputField' type='password' placeholder='암호' name='password' onChange={(event) => setPassword(event.target.value)}/>
        
        <button id='loginButton' >로그인</button>
        
        <div id='finds'>
          <div className='findsText'> 아이디 찾기</div> <div className='findsText'>/</div> <div className='findsText'>비밀번호 찾기</div>
        </div>
      </form>

      <div id='below'>
        <div id='belowExplanation'>마타를 이용하고 싶으세요?</div>
        <div id='createAccount' onClick={handleClick}>MATA 계정만들기</div>
      </div>
    </div>
  );
};

export default Login;