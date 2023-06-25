import React from 'react';
import './SignUp.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const SignUp = () => {
  const navigate=useNavigate()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  function signup (e) {
    if (password!==password2) {
      alert('비밀번호 확인 다름')
      return}
    e.preventDefault();
    const formData={
      name:name,
      email:email,
      password:password,
      password2:password2,
    }
    const headers = {
      'Content-type': 'application/json'
    }    
    axios.post(process.env.REACT_APP_HOST+'/v1/member/signup',formData,{headers})

    .then(response => {
      if (response.status === 200) {
        axios.post(process.env.REACT_APP_HOST+'/v1/member/login',formData,{headers})
        .then(res2=>{
          sessionStorage.setItem('accessToken',res2.data.accessToken) 
          navigate('/')
        })
          
        // navigate('/')
      }else alert('틀림')
    })
    .catch(error => {
      console.error(error);
      alert(error.data)
    });
  }
  return (
    <div id='signUpBackground'>
      <form id='signUpForm' onSubmit={signup}>
        <div id='signUpTitle'>회원가입</div>
        <input className='inputField' placeholder='이름' name='name' type='text' onChange={(event) => setName(event.target.value)}/>
        <input className='inputField' placeholder='이메일' name='email' type='email' onChange={(event) => setEmail(event.target.value)}/>
        <input className='inputField'placeholder='비밀번호' name='password' type='password' onChange={(event) => setPassword(event.target.value)}/>
        <input className='inputField'placeholder='비밀번호 확인' name='password2' type='password' onChange={(event) => setPassword2(event.target.value)}/>
        <div id='agreement'>{
          "이용약관은 왜 만들어야 할까요?     \n" +
          "큰 틀에서부터 꼬리에 꼬리를 물어가 봅시다.\n" +
          "사업은 왜 하는 것일까요? 무엇보다 수익을 창출하기 위함이고, 각자 추구하는 가치를 실현하기 위함이기도 할 것입니다. 이를 위해서는 서비스를 이용하는 사람이 지속적으로 많아져야겠죠?\n" +
          "서비스를 이용하는 사람이 많아지려면 어떻게 해야 할까요? 여러 가지 방법이 있겠습니다만, 그중 한 가지로 그 서비스 이용 과정에서 이용자의 불편함이 최소화되어야 할 것입니다. 그래야 서비스 이용자의 이탈을 막을 수 있을 테니까요.\n" +
          "서비스 이용자의 불편함을 최소화하기 위해서는 어떻게 해야 할까요? 서비스를 체계적으로 관리해야겠죠.\n" +
          "서비스를 체계적으로 관리하기 위한 방법은 무엇일까요?\n" +
          "그 방법 중 하나가 바로 ‘이용약관’을 서비스에 맞게 잘 구성한 후 이를 서비스 전체에 잘 반영하는 것입니다.     \n" +
          "\n" +
          "‘이용약관’을 잘 구성하고 서비스 전체에 잘 반영하는 일은 결국 수익 창출과 서비스를 통한 가치 실현을 위해서 꼭 필요한 것입니다.     \n" +
          "\n" +
          "따라서 위와 같은 목적을 염두에 두고 이용약관을 각자의 서비스에 맞게 잘 작성하는 법, 이를 서비스에 잘 반영하도록 하는 법에 대해 함께 알아보고자 합니다."
        }</div>
        <label id='checkBox'>
          <input type='checkbox' name='agreement'/>
          위 약관에 동의합니다.
        </label> 
        <div id='buttons'>
          <button className='hover:bg-gray-100 text-blue-700 font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded-full'>취소</button>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>가입</button>
        </div>
      </form>
      
    </div>
  );
};

export default SignUp;