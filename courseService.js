const createCourse = async (course) => {
    course.id = crypto.randomUUID();
    const kv = await Deno.openKv();
    await kv.set(["courses", course.id], course);
};

const listCourses = async () => {
    const kv = await Deno.openKv();
    const courseEntries = await kv.list({ prefix: ["courses"] });
    const courses = [];
    for await (const entry of courseEntries) {
        courses.push(entry.value);
    }
    return courses;
};

const getCourse = async (id) => {
    const kv = await Deno.openKv();
    const course = await kv.get(["courses", id]);
    return course?.value ?? {};
};

const updateCourse = async (id, course) => {
    course.id = id;
    const kv = await Deno.openKv();
    await kv.set(["courses", id], course);
}

const deleteCourse = async (id) => {
    const kv = await Deno.openKv();
    await kv.delete(["courses", id]);
};

const showFeedback = async (courseId, rateId) => {
	const kv = await Deno.openKv();
	const feedback = await kv.get(["feedback", courseId, rateId]);
    return feedback?.value ?? 0;
};

const rateCourse = async (courseId, rateId) => {
	const kv = await Deno.openKv();
	const feedback = await kv.get(["feedback", courseId, rateId]);
	feedback.value++;
	await kv.set(["feedback", courseId, rateId], feedback.value);
};

export { createCourse, getCourse, listCourses, updateCourse, deleteCourse, showFeedback, rateCourse };