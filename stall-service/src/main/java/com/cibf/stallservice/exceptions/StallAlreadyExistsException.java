package com.cibf.stallservice.exceptions;

public class StallAlreadyExistsException extends RuntimeException {
    public StallAlreadyExistsException(String message) {
        super(message);
    }
}