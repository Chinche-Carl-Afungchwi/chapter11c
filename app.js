import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as feedbacks from "./feedbacks.js";
import * as courseController from "./courseController.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const app = new Hono();

app.get("/feedbacks/:id", async (c) => {
    const id = c.req.param("id");
    const feedbackcount = await feedbacks.getCount(id);
    return c.text(`Feedback ${id}: ${feedbackcount}`);
});
app.post("/feedbacks/:id", async (c) => {
    const id = c.req.param("id");
    await feedbacks.incrementCount(id);
    return c.redirect("/");
});

app.get("/", async (c) => {
    return c.html(eta.render("index.eta"));
});

app.get("/courses", courseController.showForm);
app.post("/courses", courseController.createCourse);

app.get("/courses/:courseId", courseController.showCourse);
app.post("/courses/:courseId", courseController.updateCourse);
app.post("/courses/:courseId/delete", courseController.deleteCourse);

app.get("/courses/:courseId/feedbacks/:rateId", courseController.showFeedback);
app.post("/courses/:courseId/feedbacks/:rateId", courseController.rateCourse);

export default app;