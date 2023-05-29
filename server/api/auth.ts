export default defineEventHandler(async (event) => {
    const { user } = await readBody(event)
    // console.log("user", user.uid)
    event.node.req = user;
    return { updated: true }
})
