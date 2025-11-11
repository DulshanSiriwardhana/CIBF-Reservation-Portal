package com.cibf.stallservice.Controller;

import com.cibf.stallservice.Model.Model_Stall;
import com.cibf.stallservice.Service.Service_Stall;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/stalls")
public class Controller_Stall {

    @Autowired
    private Service_Stall stallService;

    @GetMapping
    public List<Model_Stall> getAllStalls() {
        return stallService.getAllStalls();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Model_Stall> getStallById(@PathVariable Long id) {
        return stallService.getStallById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{stallName}")
    public ResponseEntity<Model_Stall> getStallByName(@PathVariable String stallName) {
        return stallService.getStallByName(stallName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Model_Stall createStall(@RequestBody Model_Stall stall) {
        return stallService.createStall(stall);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Model_Stall> updateStall(@PathVariable Long id, @RequestBody Model_Stall stall) {
        try {
            Model_Stall updated = stallService.updateStall(id, stall);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStall(@PathVariable Long id) {
        stallService.deleteStall(id);
        return ResponseEntity.ok().build();
    }
}
