package com.ssafy.dto;

import com.ssafy.entity.Event;
import com.ssafy.entity.Tag;
import com.ssafy.entity.TagEvent;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TagEventDto {
//    private Long id;
    private LocalDateTime createAt;
//    private Tag tag;
    private String eventName;
    public static TagEventDto toDto(TagEvent tagEvent){
        return TagEventDto.builder()
                .createAt(tagEvent.getCreateAt())
                .eventName(tagEvent.getEvent().getEventName())
                .build();
//        return new TagEventDto(
//                tagEvent.getId(),
//                tagEvent.getCreateAt(),
//                tagEvent.getTag(),
//                tagEvent.getEvent()
//        );
    }
//    public TagEvent toEntity(){
////        return new TagEvent(id, createAt, tag, event);
//        return TagEvent.builder()
//                .id(id)
//                .createAt(createAt)
//                .tag(tag)
//                .event(event)
//                .build();
//    }
}
