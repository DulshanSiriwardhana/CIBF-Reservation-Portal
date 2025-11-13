package com.cibf.stallservice;

import com.cibf.stallservice.dto.TestDTO;

public class ServiceTest {
    public static void main(String[] args) {
        TestDTO dto = new TestDTO();
        dto.setTestName("Name");
        System.out.println(dto.getTestName());
    }
}
