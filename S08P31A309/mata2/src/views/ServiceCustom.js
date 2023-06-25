import React, {useEffect, useState, useLayoutEffect} from 'react';
import {Button, Form, FormGroup, Label, Input} from 'reactstrap';
import './ServiceCustom.css'
import { CodeBlock, dracula } from "react-code-blocks";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
const ServiceCustom = (props) => {
  function extractPropertyValues(array, key) {
    return array.map(obj => obj[key]).filter(value => value !== undefined);
  }
  function findDuplicateValues(array) {
    const uniqueValues = new Set();
    const duplicateValues = [];
  function hasCommonValues(array1, array2) {
    return array1.some(value => array2.includes(value));
  };
  
    for (const value of array) {
      if (uniqueValues.has(value)) {
        duplicateValues.push(value);
      } else {
        uniqueValues.add(value);
      }
    }
  
    return duplicateValues;
  }
  const reservedEventNames=['click','mouseenter','mouseleave','scroll']
  const [options,setOptions] = useState([ ]);
  const handleChangeSelected = (index,e) => {
    const newTagEvents=[]
    e.forEach(element => {newTagEvents.push(element.value)
      
    });
    const values = [...tags];
    values[index].tagEvents = newTagEvents;
    setTags(values);
  }
  const [selectedOptions, setSelectedOptions] = useState([]);
  const saveEvent= (e)=>{
    
    const eventsNamesArray= extractPropertyValues(events,'eventName')
    const duplicates=findDuplicateValues(eventsNamesArray);

    if (duplicates.length) {
      window.alert(`중복된 이벤트 ${duplicates}를 지워주세요.`)
      return
    }
    

    e.preventDefault();
    const payload=[]
    const event={events:[]}
    events.forEach((element,index1) => {
      event.events[index1]={
        eventName:element.eventName,
        eventBase:element.eventBase,
        eventParam:element.eventParams,
        eventPath:element.eventPaths
      }
    }
    )
    
    const url=process.env.REACT_APP_HOST+'/v1/project/'+projectId+'/events';
    const headers = {
      "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
      'Content-type': 'application/json',
    }
    axios.post(url,event,{headers})

    .then(response => {

      // if (response.status==200) {
      //   sessionStorage.setItem('accessToken',response.data.accessToken)  
      //   navigate('/')
      // }else alert('틀림')
      window.location.reload();
    })
    .catch(error => {
      console.error(error);
      alert(error.data)
    });
    
  }

  const test=()=>{
    const tagsNamesArray= extractPropertyValues(tags,'tagName')
    const duplicates=findDuplicateValues(tagsNamesArray);
    if(duplicates.length){window.alert(`중복된 이벤트 ${duplicates}를 지워주세요.`)}
    console.log(fields,events,tags)
  }

  const [events,setEvents] = useState([])
  const [fields, setFields] = useState({service:{},events:events,tags:[]});
  const [tags,setTags]=useState([])
  const [spaChecked,setSpaChecked]=useState(true)


  const handleAddPath = (index1) => {
    const values = [...events]
    values[index1].eventPaths.push({pahtName:'',pathIndex:''})
    setEvents(values)
  };
  const handleRemovePath = (index1,index2) => {
    const values = [...events];
    values[index1].eventPaths.splice(index2, 1);
    setEvents(values);
  };
  const handleAddEvent = () => {
    const values = [...events]
    values.push({eventName:'',eventBase:'',eventParams:[],eventPaths:[]});
    setEvents(values);
  };

  const handleRemoveEvent = (index1) => {
    const values = [...events];
    values.splice(index1, 1);
    setEvents(values);
  };

  const handleChangeName = (index1, event) => {
    const values = [...events];
    values[index1].eventName = event.target.value;
    setEvents(values);
  };
  const handleChangeCondition = (index1, event) => {
    const values = [...events];
    values[index1].eventBase = event.target.value;
    setEvents(values);
  };
  const handleCheckboxChange=(event)=>{
    setSpaChecked(!spaChecked)
  }
  const handleAddParam = (index1) => {
    const values = [...events]
    values[index1].eventParams.push({paramName:'',paramKey:''})
    setEvents(values)
  };
  const handleRemoveParam = (index1,index2) => {
    const values = [...events];
    values[index1].eventParams.splice(index2, 1);
    setEvents(values);
  };
  const handleChangeParamName=(index1,index2,e)=>{
    const values=[...events]
    values[index1].eventParams[index2].paramName=e.target.value
    setEvents(values)
  }
  const handleChangeParamKey=(index1,index2,e)=>{
    const values=[...events]
    values[index1].eventParams[index2].paramKey=e.target.value
    setEvents(values)
  }
  const handleChangePathName=(index1,index2,e)=>{
    const values=[...events]
    values[index1].eventPaths[index2].pathName=e.target.value
    setEvents(values)
  }
  const handleChangePathIndex=(index1,index2,e)=>{
    const values=[...events]
    values[index1].eventPaths[index2].pathIndex=e.target.value
    setEvents(values)
  }



  const handleAddTag = () => {
    const values = [...tags]
    values.push({tagName:'',tagId:'',tagClass:'',tagEvents:[]});
    setTags(values);
  };  
  const handleRemoveTag= (index)=>{
    const values=[...tags]
    values.splice(index,1)
    setTags(values)
  }
  const handleAddTagEvent = (index) => {
    
    const values = [...tags]
    values[index].tagEvents.push(null)
    setTags(values)
  };
  const handleRemoveTagEvent = (index,index2) => {
    const values = [...tags];
    values[index].tagEvents.splice(index2, 1);
    setTags(values);
  };
  const handleChangeTagName = (index, e) => {
    const values = [...tags];
    values[index].tagName = e.target.value;
    setTags(values);
  };
  const handleChangeTagId = (index, e) => {
    const values = [...tags];
    values[index].tagId = e.target.value;
    setTags(values);
  };
  const handleChangeTagClass = (index, e) => {
    const values = [...tags];
    values[index].tagClass = e.target.value;
    setTags(values);
  };
  const handleChangeTagEvent = (index,index2, e) => {
    const values = [...tags];
    values[index].tagEvents[index2] = e.target.value;
    setTags(values);
  };
  const saveTag= (e)=>{
    const tagsNamesArray= extractPropertyValues(tags,'tagName')
    const duplicates=findDuplicateValues(tagsNamesArray);
    if(duplicates.length){
      window.alert(`중복된 이벤트 ${duplicates}를 지워주세요.`)
      window.location.reload();
    }
    
    e.preventDefault();
    const payload=[]
    const tag={tags:[]}

    tags.forEach((element,index) => {
      // console.log(tags,element,index)
      tag.tags.push({
        tagName:element.tagName,
        tagId:element.tagId,
        tagClass:element.tagClass,
        tagEvents:element.tagEvents
      })

    }

    );
    const url=process.env.REACT_APP_HOST+'/v1/project/'+projectId+'/tags';
    const headers = {
      "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
      'Content-type': 'application/json',
    }
    axios.post(url,tag,{headers})

    .then(response => {

      window.location.reload();
    })
    .catch(error => {
      console.error(error);
      alert(error.data)
    });
    
  
  }

  const[token,setToken]=useState(null)
  const getToken=(e)=>{
    e.preventDefault()
    const url=process.env.REACT_APP_HOST+'/v1/project/token';
    const headers = {
      "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
      'Content-type': 'application/json',
    }
    const payload={
      id:{id:projectId}
    }
    axios.post(url,{id:projectId},{headers})

    .then(response => {
      setToken(response.data.token)
      
    })
    .catch(error => {
      console.error(error);
      alert(error.data)
    });

  }
  let currentService={}
  const [origin,setOrigin]=useState('')
  const  {projectId}  = useParams();
  const location = useLocation();
  useLayoutEffect(()=>{

    props.state.serviceList.map( (service) => {
      if(projectId==projectId){
        currentService=service
        setOrigin(currentService.url)
        
      }else{console.log('주소 못 찾음')
    }
    });
    const url=process.env.REACT_APP_HOST+'/v1/project/'+projectId+'/settings'
    const headers = {
      "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
    }
    axios.get(url,headers)
    .then(res=>{
      setOrigin(res.data.projectDto.url)
      setToken(res.data.projectDto.token)
      const currentEvents=res.data.eventDtoList
      const newEvents = currentEvents.map(obj => {
        const { eventParamDtoList,eventPathDtoList, ...rest } = obj;

        return  {eventParams:eventParamDtoList,eventPaths:eventPathDtoList,...rest };
      });
      setEvents(newEvents)
      



      const currentTags=res.data.tagDtoList
      const newTags=currentTags.map(obj=>{
        const {htmlTagName,htmlTagId,htmlTagClass,tagEventDtoList, ...rest}=obj
        return {tagName:htmlTagName,tagId:htmlTagId,tagClass:htmlTagClass,tagEventDtoList:tagEventDtoList,tagEvents:[], ...rest}
      })
      newTags.forEach(element => {
        
        element.tagEventDtoList.forEach(tagEventDto=>{
          element.tagEvents.push(tagEventDto.eventName)
        })
        delete element.tagEventDtoList
      });
      // const newSelectedOptions=[]
      // newTags.forEach(element => {
      //   const newSelectedOption=[]
      //   element.tagEventDtoList.forEach(element2=>{
      //     newSelectedOption.push(element2.eventName)
      //   })
      //   newSelectedOptions.push(newSelectedOption)
      // });
      // setSelectedOptions(newSelectedOptions)

      setTags(newTags)

    })
    .catch(err=>{
      console.log('잘못됨',err)
    },)


    

  },[])
  
  const saveAll= ()=>{
    saveEvent()
    saveTag()
    
  }

  useEffect(()=>{  
    
    const eventsOptions=[]
    events.forEach(element => {
      if (eventsOptions.includes({value:element.eventName,label:element.eventName}) ){return}
      eventsOptions.push({value:element.eventName,label:element.eventName})

    });
    

    const optionsSet=new Set(eventsOptions)
    const uniqueOptions=[...optionsSet]
    // uniqueOptions.push({ value: 'click', label: 'click' })
    setOptions(uniqueOptions)   
  },[events])

  useEffect(()=>{
    const newSelectedOptions=[]
    tags.forEach(element => {
      const newSelectedOption=[]
      element.tagEvents.forEach(element2 => {
        newSelectedOption.push({value:element2,label:element2})
      });
      newSelectedOptions.push(newSelectedOption)

    });
    const selectedOptionsSet=new Set(newSelectedOptions)
    const uniqueSelectedOptions=[...selectedOptionsSet]
    setSelectedOptions(uniqueSelectedOptions)
  },[tags])
  return (
    <div id='form-background' className='flex w-100 justify-content-center'>
      <div className='lg:w-3/5 w-full m-8'>
        <div className='row flex justify-content-center bg-white mt-3 p-3 rounded-3xl'>
          <p>스크립트</p>
          <div>
            {!spaChecked ? (
              <>
                <span>BrowserRouter를 최상단(보통 index.js)에 정의합니다.</span>
                <CodeBlock
                  text={
                    `const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
  </React.StrictMode>
);`}
                  language={"jsx"}
                />
                <hr />
                <span>최상단 컴포넌트(일반적으로 App.js)에 다음과 같이 추가합니다.</span>
                <CodeBlock
                  text={
                    `import TagManager from "npm-mata";

const mata = new TagManager('${token}');

function App() {
  const location = useLocation();
    useEffect(() => {
      window.dispatchEvent(new Event('load'));
      return () => {
        window.dispatchEvent(new Event('unload'));
      }
    }, [location])

    //...코드`}
                  language={"jsx"}
                />
              </>) : (
              <>
                <span>head 태그 아래에 다름과 같이 스크립트를 추가합니다.</span>
                <CodeBlock
                  text={
                    `<head>
    <!-- Your head contents -->
</head>

<!-- MATA Tag Manager -->
<script src="https://mata2.co.kr/api/v1/js/${token}" type="module"></script>`
                  }
                  language={"html"}
                />
              </>
            )}
          </div>
        </div>
        <button onClick={test}>test</button>
        <Form>
          <div className='row flex justify-content-center bg-white mt-3 p-3 rounded-3xl'>
            <p>서비스 설정</p>
            <div>
              토큰: {token}
            </div>
            <button onClick={getToken}>토큰발급</button>
            <FormGroup id='service' className='d-flex flex-column justify-content-center align-items-center gap-3 bg-white rounded Service'>
              <label>
                <Input type='text' placeholder='서비스 주소' defaultValue={origin} />
              </label>
              <label>
                <Input type='checkbox' name='spa' onChange={handleCheckboxChange} />
                <span className='ms-2'>SPA로 구성되었다면 체크해주세요.</span>
              </label>
            </FormGroup>
          </div>

          <div className='row flex justify-content-center bg-white mt-3 p-3 rounded-3xl'>
            <p>이벤트 설정</p>
            <div className="col-12 flex justify-content-center">
              <Button color="dark" onClick={() => handleAddEvent()}>
                이벤트 추가
              </Button>
            </div>


            <div className='col-8 align-items-center gap-3 bg-white rounded'>
              {events.map((event, index1) => (
                index1 > 3 && (
                  <FormGroup className="row border border-b-gray-50 p-5 py-3 rounded-2xl" key={index1}>
                    <div className='d-flex flex-auto gap-3'>
                      <Button
                        color="danger"
                        onClick={() => handleRemoveEvent(index1)}

                        key={index1}
                      >
                        삭제
                      </Button>
                      <Button key={index1} color="dark" onClick={() => handleAddParam(index1)}>
                        params 추가
                      </Button>
                      <Button color="dark" onClick={() => handleAddPath(index1)}>
                        paths 추가
                      </Button>
                    </div>
                    <span className="text-xl my-3">이벤트 정의 설정</span>
                    <div>
                      <Input
                        className='mt-1'
                        type="text"
                        name={`eventName-${index1}`}
                        // value={event[index].eventName || ''}
                        onChange={(e) => handleChangeName(index1, e)}
                        placeholder='이벤트 명'
                        value={events[index1].eventName}
                      />

                      <Input
                        className='mt-1'
                        type="text"
                        name={`eventCondition-${index1}`}
                        // value={event[index].base || ''}
                        onChange={(e) => handleChangeCondition(index1, e)}
                        placeholder='이벤트 조건'
                        value={events[index1].eventBase}
                      />
                      <div className="border mt-3 p-3 rounded-2xl">
                        <span className="text-xl my-3">이벤트 페이로드 설정</span>
                        <div>
                          Params
                        </div>
                        <div>
                          {events[index1].eventParams.map((param, index2) => (
                            <FormGroup>
                              <div className='d-flex flex-row gap-3 '>
                                <div className='flex-grow'>
                                  <Input
                                    className='mt-1'
                                    type="text"
                                    name={`paramName-${index2}`}
                                    // value={param.name || ''}
                                    placeholder='param name'
                                    onChange={(e) => handleChangeParamName(index1, index2, e)}
                                    value={events[index1].eventParams[index2].paramName}
                                  />
                                  <Input
                                    className='mt-1'
                                    type="text"
                                    name={`paramKey-${index2}`}
                                    // value={param.key || ''}
                                    placeholder='param key'
                                    onChange={(e) => { handleChangeParamKey(index1, index2, e) }}
                                    value={events[index1].eventParams[index2].paramKey}
                                  />
                                </div>
                                <Button className='w-auto h-auto ' onClick={() => handleRemoveParam(index1, index2)}>삭제</Button>
                              </div>
                            </FormGroup>
                          ))
                          }
                        </div>
                        <hr />
                        <div>
                          Paths
                        </div>
                        <div>
                          {events[index1].eventPaths.map((path, index2) => (
                            <FormGroup>
                              <div className='d-flex flex-row gap-3'>
                                <div className='flex-grow '>
                                  <Input
                                    className='mt-1'
                                    type="text"
                                    name={`pathName-${index2}`}
                                    // value={path.name || ''}
                                    placeholder='path name'
                                    onChange={(e) => { handleChangePathName(index1, index2, e) }}
                                    value={events[index1].eventPaths[index2].pathName}
                                  />
                                  <Input
                                    className='mt-1'
                                    type="text"
                                    name={`pathKey-${index2}`}
                                    // value={path.index || ''}
                                    placeholder='path index'
                                    onChange={(e) => { handleChangePathIndex(index1, index2, e) }}
                                    value={events[index1].eventPaths[index2].pathIndex}
                                  />
                                </div>
                                <Button className='w-auto h-auto' onClick={() => { handleRemovePath(index1, index2) }}>삭제</Button>
                              </div>
                            </FormGroup>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FormGroup>

                )
              ))
              }
              <div className="col-12 flex justify-content-center">
                <Button color='primary' onClick={saveEvent}> 이벤트 저장</Button>
              </div>
            </div>
          </div>

          <div className='row flex justify-content-center bg-white mt-3 p-3 rounded-3xl'>
            <p>태그 설정</p>
            <div className="col-12 flex justify-content-center">
              <Button color="dark" onClick={() => handleAddTag()}>
                태그 추가
              </Button>
            </div>

            <div className='col-8 align-items-center gap-3 bg-white rounded'>

              {tags.map((tag, index) => (

                <FormGroup className="row border border-b-gray-50 p-5 py-3 rounded-2xl" key={index}>
                  <div className='d-flex flex-auto gap-3'>
                    <Button
                      color="danger"
                      onClick={() => { handleRemoveTag(index) }}
                    >
                      삭제
                    </Button>
                    {/* <Button color="dark" onClick={() => handleAddTagEvent(index)}>
                      tags {index} 이벤트 추가
                    </Button> */}


                  </div>
                  <span className="text-xl my-3">태그 설정</span>
                  <div>
                    <Input
                      className="my-1"
                      type="text"
                      name={`eventName-${index}`}
                      onChange={(e) => handleChangeTagName(index, e)}
                      placeholder='태그명'
                      value={tags[index].tagName}
                    />
                    <Input
                      className="my-1"
                      type="text"
                      name={`eventCondition-${index}`}
                      onChange={(e) => { handleChangeTagId(index, e) }}
                      placeholder='id'
                      value={tags[index].tagId}
                    />
                    <Input
                      className="my-1"
                      type="text"
                      name={`eventCondition-${index}`}
                      onChange={(e) => { handleChangeTagClass(index, e) }}
                      placeholder='클래스'
                      value={tags[index].tagClass}
                    />
                    <Select
                      className="my-1"
                      key={index}
                      isMulti
                      options={options}
                      value={selectedOptions[index]}
                      onChange={(e) => { handleChangeSelected(index, e) }}
                    />
                    {/* {tags[index].tagEvents.map((event,index2)=>(
                    <FormGroup className='d-flex flex-row gap-3'> 
                    
                    <Input
                      type="text"
                      name={`eventCondition-${index}`}
                      onChange={(e) => {handleChangeTagEvent(index,index2,e)}}
                      placeholder='이벤트'
                      value={tags[index].tagEvents[index2]}
                    />
                   
                    <Button className='w-auto h-auto' onClick={()=>{handleRemoveTagEvent(index,index2)}}> 삭제</Button>
                  
                    </FormGroup>
                  ))} */}

                  </div>

                </FormGroup>
              ))}

              <div className="col-12 flex justify-content-center">
                <Button color='primary' onClick={saveTag}>태그 저장</Button>
              </div>
            </div>
          </div>

        </Form>

      </div>
    </div>
  );
};

export default ServiceCustom;