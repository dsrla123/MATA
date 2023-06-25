package com.ssafy.util;

public class RedisKeyExecption extends RuntimeException{
    public RedisKeyExecption() {
        this("유효하지 않은 토큰입니다.");
    }
    public RedisKeyExecption(String s) {
        super(s);
    }
}
