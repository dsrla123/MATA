package com.ssafy;

import com.ssafy.dto.ProjectDto;
import com.ssafy.entity.*;
import com.ssafy.repository.*;
import com.ssafy.service.ProjectService;
import com.ssafy.util.MemberPrivilege;
import com.ssafy.util.ProjectCategory;
import lombok.RequiredArgsConstructor;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.mortbay.util.ajax.JSON;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


@Component
@RequiredArgsConstructor
public class DummyData implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final EventRepository eventRepository;
    private final EventParamRepository eventParamRepository;
    private final EventPathRepository eventPathRepository;
    private final TagRepository tagRepository;
    private final TagEventRepository tagEventRepository;
    private final PasswordEncoder passwordEncoder;

    private final ProjectService projectService;


    @Override
    public void run(String... args) throws Exception {
//        addMember();
//        addProject();
//        addEvent();
//        addTag();
    }

    private void addEvent() throws IOException {
        String stringDummy = "{\"events\": { \"login\": { \"base\": \"click\", \"param\": [], \"path\": [ {\"name\": \"userId\", \"index\": 2} ] }, \"click_main\": { \"base\": \"click\", \"param\": [], \"path\": [ {\"name\": \"userId\", \"index\": 2} ] }, \"purchase\": { \"base\": \"click\", \"param\": [ {\"name\": \"productName\", \"key\": \"product\"}, {\"name\": \"productName2\", \"key\": \"product2\"} ], \"path\": [ {\"name\": \"productId\", \"index\": 3} ] } }}";
        Project project = projectRepository.findById(2l).get();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.readTree(stringDummy);
        for (Iterator<Map.Entry<String, JsonNode>> it = jsonNode.get("events").getFields(); it.hasNext(); ) {
            Map.Entry<String, JsonNode> event = it.next();
            Event temp = Event.builder()
                    .eventName(event.getKey())
                    .eventBase(event.getValue().get("base").toString().replace("\"", ""))
                    .project(project)
                    .build();
            eventRepository.saveAndFlush(temp);
            for (JsonNode param : event.getValue().get("param")) {
                eventParamRepository.saveAndFlush(EventParam.builder()
                        .event(temp)
                        .paramKey(param.get("key").toString().replace("\"", ""))
                        .paramName(param.get("name").toString().replace("\"", ""))
                        .build());
            }
            for (JsonNode path : event.getValue().get("path")) {
                eventPathRepository.saveAndFlush(EventPath.builder()
                        .event(temp)
                        .pathIndex(path.get("index").toString())
                        .pathName(path.get("name").toString().replace("\"", ""))
                        .build());
            }
        }
    }

    private void addTag() throws IOException {
        String stringDummy = "{\"tags\": { \"button1\": { \"id\": \"button\", \"class\": \"\", \"events\": [\"click\", \"login\"] }, \"button2\": { \"id\": \"button2\", \"class\": \"primary\", \"events\": [\"purchase\"] }, \"main\": { \"id\": \"main\", \"class\": \"\", \"events\": [\"click_main\"] } }}";
        Project project = projectRepository.findById(2l).get();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.readTree(stringDummy);
        for (Iterator<Map.Entry<String, JsonNode>> it = jsonNode.get("tags").getFields(); it.hasNext(); ) {
            Map.Entry<String, JsonNode> tag = it.next();

            Tag temp = Tag.builder()
                    .htmlTagName(tag.getKey())
                    .htmlTagId(tag.getValue().get("id").toString().replace("\"", ""))
                    .htmlTagClass(tag.getValue().get("class").toString().replace("\"", ""))
                    .project(project)
                    .build();
            tagRepository.saveAndFlush(temp);

            Iterator<JsonNode> eventNameList = tag.getValue().get("events").getElements();
            while (eventNameList.hasNext()) {
                JsonNode eventName = eventNameList.next();
                Event event = eventRepository.findByEventNameAndProjectIdAndIsEnabledIsTrue(eventName.getTextValue(), project.getId()).get();

                tagEventRepository.save(TagEvent.builder()
                        .tag(temp)
                        .event(event)
                        .build());
            }
        }
    }

    private void addProject() {
        System.out.println("addProject");
        List<Member> memberList = memberRepository.findAll();
        for (int i = 0; i < memberList.size(); i++) {
            for (int j = 0; j < 5; j++) {
                long project_id = projectRepository.saveAndFlush(Project.builder()
                        .category(ProjectCategory.BLOG)
                        .url("mata2.co.kr")
                        .name(memberList.get(i).getName() + "s "+ j +" project")
                        .token("token"+i+"asdf"+j)
                        .member(memberList.get(i))
                        .build()).getId();
                eventRepository.saveAndFlush(Event.builder()
                        .project(projectRepository.findById(project_id).get())
                        .eventBase("null")
                        .eventName("click")
                        .build());
                eventRepository.saveAndFlush(Event.builder()
                        .project(projectRepository.findById(project_id).get())
                        .eventBase("null")
                        .eventName("mouseenter")
                        .build());
                eventRepository.saveAndFlush(Event.builder()
                        .project(projectRepository.findById(project_id).get())
                        .eventBase("null")
                        .eventName("mouseleave")
                        .build());
                eventRepository.saveAndFlush(Event.builder()
                        .project(projectRepository.findById(project_id).get())
                        .eventBase("null")
                        .eventName("scroll")
                        .build());
            }
        }
    }

    private void addMember() {
        System.out.println("addMember");

        for (int i = 0; i < 5; i++) {
            Member member = Member.builder().name("ssafyman"+i)
                    .email("ssafy"+i+"@ssafy.com")
                    .password(passwordEncoder.encode("1234"))
                    .privilege(Collections.singleton(MemberPrivilege.GENERAL.name()))
                    .build();
            memberRepository.save(member);
        }
    }
}
