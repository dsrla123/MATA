package com.ssafy.service;

import com.ssafy.entity.*;
import com.ssafy.repository.*;
import io.jsonwebtoken.lang.Collections;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class InjectionService {
    private final TagRepository tagRepository;
    private final TagEventRepository tagEventRepository;
    private final EventRepository eventRepository;
    private final EventPathRepository eventPathRepository;
    private final EventParamRepository eventParamRepository;
    private final ProjectRepository projectRepository;


    // Todo : js코드 난독화 필요
    public String callJsCode(String projectToken) {
        long projectId = projectRepository.findByToken(projectToken).get().getId();
        String code_head =
                "export default class TagManager {\n" +
                        "  constructor() {\n" +
                        "    this.injection = {\n" +
                        "      bootstrap: 'https://mata2.co.kr/api/v1/dump',\n" +
                        "      projectToken: '"+projectToken+"',\n" +
                        "      spa: " + projectRepository.findById(projectId).get().isSpa() +",\n" +
                        "      events: {\n";
//                        "        click: {base: null, param: [], path: []}," +
//                        "        mouseenter: {base: null, param: [], path: []},\n" +
//                        "        mouseleave: {base: null, param: [], path: []},\n" +
//                        "        scroll: {base: null, param: [], path: []},\n";

        StringBuilder code = new StringBuilder();
//        List<Event> eventList = eventRepository.findAllByProjectId(projectId);
        List<Event> eventList = eventRepository.findAllByProjectIdAndIsEnabledIsTrue(projectId);

        for (int i = 0; i < eventList.size(); i++) {
            Event event = eventList.get(i);
            List<EventParam> eventParamList = eventParamRepository.findAllByEventId(event.getId());
            List<EventPath> eventPathList = eventPathRepository.findAllByEventId(event.getId());
            code.append(event.getEventName()+":{");
            code.append(String.format("base:'%s',",event.getEventBase()));
            code.append("param: [");
            for (int j = 0; j < eventParamList.size(); j++) {
                EventParam eventParam = eventParamList.get(j);
                code.append(String.format("{name: '%s', key: '%s'}", eventParam.getParamName(), eventParam.getParamKey()));
                if(j != eventParamList.size()-1) code.append(",");
            }
            code.append("],");
            code.append("path: [");
            for (int j = 0; j < eventPathList.size(); j++) {
                EventPath eventPath = eventPathList.get(j);
                code.append(String.format("{name: '%s', index: '%s'}", eventPath.getPathName(), eventPath.getPathIndex()));
                if(j != eventPathList.size()-1) code.append(",");
            }
            code.append("]}");
            if(i != eventList.size()-1) code.append(",");
        }
        code.append("},");
        code.append("tags : {");
//        List<Tag> tagList = tagRepository.findAllByProjectId(projectId);
        List<Tag> tagList = tagRepository.findAllByProjectIdAndIsEnabledIsTrue(projectId);
        for (int i = 0; i < tagList.size(); i++) {
            Tag tag = tagList.get(i);
//            List<TagEvent> tagEventList = tagEventRepository.findAllByTagId(tag.getId());
            List<TagEvent> tagEventList = tagEventRepository.findAllByTagIdAndIsEnabledIsTrue(tag.getId());

            code.append(tag.getHtmlTagName() + ":{");
            code.append(String.format("id:'%s', class:'%s',",tag.getHtmlTagId(), tag.getHtmlTagClass()));
            code.append("events:[");
            for (int j = 0; j < tagEventList.size(); j++) {
                code.append(String.format("'%s'",tagEventList.get(j).getEvent().getEventName()));
                if(j != tagEventList.size()-1) code.append(",");
            }
            code.append("]}");
            if(i != tagList.size()-1) code.append(",");
        }

        code.append("}}");
        String code_main = code.toString();

        String code_tail = "\n" +
                "    if (!sessionStorage.getItem('TAGMANAGER_SESSION')) {\n" +
                "      let randomValue = Math.floor(Math.random() * (Math.pow(2, 52) - 1));\n" +
                "      sessionStorage.setItem('TAGMANAGER_SESSION', randomValue)\n" +
                "    }\n" +
                "    this.sessionId = sessionStorage.getItem('TAGMANAGER_SESSION');\n" +
                "    this.bootstrap = this.injection.bootstrap;\n" +
                "    this.projectToken = this.injection.projectToken;\n" +
                "    this.spa = this.injection.spa;\n" +
                "    this.userAgent = (() => {\n" +
                "      let userAgent = navigator.userAgent.toLowerCase()\n" +
                "      if(userAgent.indexOf('edge')>-1){\n" +
                "        return 'edge';\n" +
                "      }else if(userAgent.indexOf('whale')>-1){\n" +
                "        return 'whale';\n" +
                "      }else if(userAgent.indexOf('chrome')>-1){\n" +
                "        return 'chrome';\n" +
                "      }else if(userAgent.indexOf('firefox')>-1){\n" +
                "        return 'firefox';\n" +
                "      }else{\n" +
                "        return 'explorer';\n" +
                "      }\n" +
                "    })()\n" +
                "    this.events = this.injection.events;\n" +
                "    this.tags = this.injection.tags;\n" +
                "    this.title = null;\n" +
                "    this.location = null;\n" +
                "    this.prevLocation = null;\n" +
                "    this.referrer = null;\n" +
                "    this.pageDuration = 0;\n" +
                "    this.data = '{}';\n" +
                "    this.attachedListeners = [];\n" +
                "    this.logStash = [];\n" +
                "    this.enterTimer = Date.now();\n" +
                "    this.getCustomEvent = function (name, targetName) {\n" +
                "      const urlStr = document.location;\n" +
                "      const url = new URL(urlStr);\n" +
                "      const urlParams = url.searchParams;\n" +
                "      const pathArray = document.location.pathname.split('/');\n" +
                "      let detail = {};\n" +
                "      detail['targetName'] = targetName;\n" +
                "      for (let d = 0; d < this.events[name].param.length; d++) {\n" +
                "        detail[this.events[name].param[d].name] = urlParams.get(this.events[name].param[d].key);\n" +
                "      }\n" +
                "      for (let p = 0; p < this.events[name].path.length; p++) {\n" +
                "        detail[this.events[name].path[p].name] = pathArray[this.events[name].path[p].index];\n" +
                "      }\n" +
                "      return new CustomEvent(name, {\n" +
                "        detail: detail,\n" +
                "        bubbles: true,\n" +
                "        cancelable: true\n" +
                "      });\n" +
                "    }\n" +
                "    this.handlerDict = {};\n" +
                "    this.handlerDict['pageenter'] = function (e) {\n" +
                "      this.stackLog(e, 'pageenter');\n" +
                "      this.flushLog();\n" +
                "    }.bind(this);\n" +
                "    this.handlerDict['pageleave'] = function (e) {\n" +
                "      this.stackLog(e, 'pageleave');\n" +
                "      this.flushLog();\n" +
                "    }.bind(this);\n" +
                "    this.handlerDict['click_heatmap'] = function (e) {\n" +
                "      this.stackLog(e, 'click_heatmap');\n" +
                "    }.bind(this);\n" +
                "    let keys = Object.keys(this.events);\n" +
                "    for (let i=0; i<keys.length; i++) {\n" +
                "      this.handlerDict[keys[i]] = function (e) {\n" +
                "        console.log(e)\n" +
                "        this.stackLog(e, e.type);\n" +
                "      }.bind(this)\n" +
                "    }\n" +
                "    this.flushLog = function () {\n" +
                "      fetch(this.bootstrap, {\n" +
                "        method: 'POST',\n" +
                "        headers: {\n" +
                "          'Content-Type': 'application/json'\n" +
                "        },\n" +
                "        body: JSON.stringify(this.logStash)\n," +
                "        keepalive: true" +
                "      })\n" +
                "      this.logStash = [];\n" +
                "    }\n" +
                "    this.stackLog = function (e, eventType = '') {\n" +
                "      let body = {\n" +
                "        projectToken: this.projectToken,\n" +
                "        sessionId: this.sessionId,\n" +
                "        userAgent: this.userAgent,\n" +
                "        event: eventType,\n" +
                "        targetId: (e && e.target && e.target.id) ? e.target.id : null,\n" +
                "        targetName: (e && e.detail && e.detail['targetName']) ? e.detail['targetName'] : null,\n" +
                "        positionX: e && e.pageX ? e.pageX : null,\n" +
                "        positionY: e && e.pageY ? e.pageY : null,\n" +
                "        title: this.title,\n" +
                "        location: this.location,\n" +
                "        referrer: this.referrer,\n" +
                "        timestamp: Date.now(),\n" +
                "        pageDuration: Date.now() - this.enterTimer,\n" +
                "        data: e.detail ? JSON.stringify(e.detail) : '{}',\n" +
                "        screenDevice : (window.innerWidth >= 1024) ? \"desktop\" :\n" +
                "                       (window.innerWidth >= 768) ? \"tablet\" : \"phone\" ,\n" +
                "        userLanguage: navigator.language.substring(0, 2) \n" +
                "      }\n" +
                "      this.logStash.push(body)\n" +
                "      console.log(this.logStash);\n" +
                "    }\n" +
                "    this.attach = function () {\n" +
                "      this.title = document.title;\n" +
                "      this.location = document.location.href;\n" +
                "      this.referrer = this.spa ? (this.prevLocation ? this.prevLocation : document.referrer) : document.referrer;\n" +
                "      let keys = Object.keys(this.tags);\n" +
                "      for (let i=0; i<keys.length; i++) {\n" +
                "        if (this.tags[keys[i]].id) { \n" +
                "          let tagById = document.querySelector('#' + this.tags[keys[i]].id);\n" +
                "          if (!tagById) continue;\n" +
                "          for (let e = 0; e < this.tags[keys[i]].events.length; e++) {\n" +
                "            if (this.events[this.tags[keys[i]].events[e]].base) { \n" +
                "              let dispatcher = function () { \n" +
                "                tagById.dispatchEvent(this.getCustomEvent(this.tags[keys[i]].events[e], keys[i]));\n" +
                "              }.bind(this)\n" +
                "              tagById.addEventListener(this.events[this.tags[keys[i]].events[e]].base, dispatcher);\n" +
                "              this.attachedListeners.push({target: tagById, type:this.events[this.tags[keys[i]].events[e]].base, listener: dispatcher}) \n" +
                "            }\n" +
                "            tagById.addEventListener(this.tags[keys[i]].events[e], this.handlerDict[this.tags[keys[i]].events[e]]); \n" +
                "            this.attachedListeners.push({target: tagById, type:this.tags[keys[i]].events[e], listener: this.handlerDict[this.tags[keys[i]].events[e]]}) \n" +
                "          }\n" +
                "        } else if (this.tags[keys[i]].class) { \n" +
                "          let classes = this.tags[keys[i]].class.split(\" \");\n" +
                "          let tagsByClass = [...document.querySelectorAll('*')];\n" +
                "          for (let c=0; c<classes.length; c++) {\n" +
                "            tagsByClass = tagsByClass.filter(tag => tag.classList.contains(classes[c]))\n" +
                "          }\n" +
                "          if (!tagsByClass) continue;\n" +
                "          tagsByClass.forEach((tagByClass) => {\n" +
                "            for (let e = 0; e < this.tags[keys[i]].events.length; e++) {\n" +
                "              if (this.events[this.tags[keys[i]].events[e]].base) { \n" +
                "                let dispatcher = function () { \n" +
                "                  tagByClass.dispatchEvent(this.getCustomEvent(this.tags[keys[i]].events[e], keys[i]));\n" +
                "                }.bind(this)\n" +
                "                tagByClass.addEventListener(this.events[this.tags[keys[i]].events[e]].base, dispatcher);\n" +
                "                this.attachedListeners.push({target: tagByClass, type:this.events[this.tags[keys[i]].events[e]].base, listener: dispatcher}) \n" +
                "              }\n" +
                "              tagByClass.addEventListener(this.tags[keys[i]].events[e], this.handlerDict[this.tags[keys[i]].events[e]]); \n" +
                "              this.attachedListeners.push({target: tagByClass, type:this.tags[keys[i]].events[e], listener: this.handlerDict[this.tags[keys[i]].events[e]]}) \n" +
                "            }\n" +
                "          });\n" +
                "        } else { \n" +
                "        }\n" +
                "      }\n" +
                "      let dispatcher = function (e) { // base DOM 이벤트에 dispatcher 붙이기\n" +
                "        this.handlerDict['click_heatmap'](e);\n" +
                "      }.bind(this)\n" +
                "      window.addEventListener('click', dispatcher);\n" +
                "      this.attachedListeners.push({target: window, type: 'click', listener: dispatcher})\n" +
                "      this.handlerDict['pageenter']({target: window});\n" +
                "    }\n" +
                "    this.detach = function () {\n" +
                "      this.prevLocation = this.location;\n" +
                "      for(let i=0; i<this.attachedListeners.length; i++) {\n" +
                "        this.attachedListeners[i].target.removeEventListener(this.attachedListeners[i].type, this.attachedListeners[i].listener);\n" +
                "      }\n" +
                "      this.handlerDict['pageleave']({target: window});\n" +
                "    }\n" +
                "    window.addEventListener(\"load\", function (e) {\n" +
                "      this.attach();\n" +
                "      console.log(\"loaded\")\n" +
                "    }.bind(this));\n" +
                "    window.addEventListener(\"unload\", function (e) {\n" +
                "      this.detach();\n" +
                "      console.log(\"unloaded\")\n" +
                "    }.bind(this));\n" +
                "  };\n" +
                "}" +
                "let mata = new TagManager();";
        return code_head + code_main + code_tail;
    }


    public Map<String, Object> getInjection(String projectToken) {
        long projectId = projectRepository.findByToken(projectToken).get().getId();
        Project projectEntity = projectRepository.findById(projectId).get();
        Map<String, Object> injection = new HashMap<>();

        injection.put("bootstrap", "https://mata2.co.kr/api/v1/dump");
        injection.put("projectToken", projectToken);
        injection.put("spa", projectEntity.isSpa());
        // events
        Map<String, Object> events = new HashMap<>();
//        List<String> baseEvents = Arrays.asList("clicks", "mouseenter", "mouseleave", "scroll");
//        for (String be : baseEvents) {
//            Map<String, Object> event = new HashMap<>();
//            event.put("base", null);
//            event.put("param", new ArrayList<>());
//            event.put("path", new ArrayList<>());
//            events.put(be, event);
//        }
//        List<Event> customEvents = eventRepository.findAllByProjectId(projectId);
        List<Event> customEvents = eventRepository.findAllByProjectIdAndIsEnabledIsTrue(projectId);
        for (Event e : customEvents) {
            Map<String, Object> event = new HashMap<>();
            List<EventParam> eventParamList = eventParamRepository.findAllByEventId(e.getId());
            List<EventPath> eventPathList = eventPathRepository.findAllByEventId(e.getId());
            event.put("base", e.getEventBase());
            event.put("param", eventParamList.stream().map((item) -> {
                Map<String, String> param = new HashMap<>();
                param.put(item.getParamName(), item.getParamKey());
                return param;
            }));
            event.put("path", eventPathList.stream().map((item) -> {
                Map<String, String> path = new HashMap<>();
                path.put(item.getPathName(), item.getPathIndex());
                return path;
            }));
            events.put(e.getEventName(), event);
        }
        injection.put("events", events);
        // tags
        injection.put("tags", null);
        Map<String, Object> tags = new HashMap<>();
//        List<Tag> customTags = tagRepository.findAllByProjectId(projectId);
        List<Tag> customTags = tagRepository.findAllByProjectIdAndIsEnabledIsTrue(projectId);
        for (Tag t : customTags) {
            Map<String, Object> tag = new HashMap<>();
            tag.put("id", t.getHtmlTagId());
            tag.put("class", t.getHtmlTagClass());
//            tag.put("events", tagEventRepository.findAllByTagId(t.getId()).stream().map(e -> e.getEvent().getEventName()));
            tag.put("events", tagEventRepository.findAllByTagIdAndIsEnabledIsTrue(t.getId()).stream().map(e -> e.getEvent().getEventName()));
            tags.put(t.getHtmlTagName(), tag);
        }
        injection.put("tags", tags);

        return injection;
    }
}