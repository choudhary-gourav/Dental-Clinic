package com.example.dentalclinic.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // Matches any route that doesn't contain a dot (to avoid matching files like .js, .css, .png)
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        // Forward to the root index.html to let React Router handle routing on the client side
        return "forward:/";
    }
}
