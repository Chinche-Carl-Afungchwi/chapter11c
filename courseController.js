import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as courseService from "./courseService.js";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const errorCourse = "The course name should be a string of at least 4 characters.";

const validator = z.object({
    course: z.string({ message: errorCourse }).min(4, { message: errorCourse }),
});

const showForm = async (c) => {
    return c.html(
        eta.render("courses.eta", { courses: await courseService.listCourses() }),
    );
};

const createCourse = async (c) => {
    const body = await c.req.parseBody();
    const validationResult = validator.safeParse(body);
    if (!validationResult.success) {
        return c.html(
            eta.render("courses.eta", { ...body, errors: validationResult.error.format(), courses: await courseService.listCourses() }),
        );
    }
    await courseService.createCourse(body);
    return c.redirect("/courses");
};

const showCourse = async (c) => {
    const id = c.req.param("courseId");
    //console.log(id);
    return c.html(
        eta.render("course.eta", { course: await courseService.getCourse(id) }),
    ); 
};

const updateCourse = async (c) => {
    const id = c.req.param("courseId");
    const body = await c.req.parseBody();
    await courseService.updateCourse(id, body);
    return c.redirect(`/courses/${id}`);
};

const deleteCourse = async (c) => {
    const id = c.req.param("courseId");
    await courseService.deleteCourse(id);
    return c.redirect("/courses");
};

const showFeedback = async (c) => {
    const courseId = c.req.param("courseId");
    const rateId = c.req.param("rateId");
    const feedbackcount = await courseService.showFeedback(courseId, rateId);
    return c.text(`Feedback ${rateId}: ${feedbackcount}`);
};

const rateCourse = async (c) => {
    const courseId = c.req.param("courseId");
    const rateId = c.req.param("rateId");
    await courseService.rateCourse(courseId, rateId);
    return c.redirect(`/courses/${courseId}`);
};

export { createCourse, showForm, showCourse, updateCourse, deleteCourse, showFeedback, rateCourse };