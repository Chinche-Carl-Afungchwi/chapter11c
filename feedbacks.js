const getCount = async (id) => {
    const kv = await Deno.openKv();
    const feedbacks = await kv.get(["feedbacks", id]);
    return feedbacks?.value ?? 0;
}

const incrementCount = async (id) => {
    let feedbacks = await getCount(id);
    feedbacks++;
    await setCount(feedbacks, id);
}

const setCount = async (feedbacks, id) => {
    const kv = await Deno.openKv();
    await kv.set(["feedbacks", id], feedbacks);
}

export { getCount, incrementCount };