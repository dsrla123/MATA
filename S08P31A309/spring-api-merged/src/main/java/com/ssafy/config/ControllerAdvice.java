package com.ssafy.config;


import com.ssafy.dto.ErrorDto;
import com.ssafy.util.RedisKeyExecption;
import com.ssafy.util.DuplicateMemberException;
import com.ssafy.util.NoSuchMemberException;
import com.ssafy.dto.NoSuchProjectException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ControllerAdvice {
    private static final Logger log = LoggerFactory.getLogger(ControllerAdvice.class);

    @ExceptionHandler({NoSuchMemberException.class,
            NoSuchProjectException.class,
            RedisKeyExecption.class})
    public ResponseEntity<ErrorDto> handleNoSuchException(final  RuntimeException e){
        ErrorDto errorDto = new ErrorDto(e.getMessage());
        log.warn("NoSuchExecption - ", e.getClass()," : ", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(errorDto);
    }

    @ExceptionHandler(DuplicateMemberException.class)
    public ResponseEntity<ErrorDto> handleDuplicateException(final  RuntimeException e){
        ErrorDto errorDto = new ErrorDto(e.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(errorDto);
    }



}
