// import type { IncomingMessage, ServerResponse } from "http";
// import { readBody } from 'h3'

// export default async (req: IncomingMessage, res: ServerResponse) => {

//     if(req.method !== 'POST') return 'Must be post request'

//     // @ts-ignore
//     const { user } = await readBody(req) // only for POST request
//     console.log("user", user)
//     // @ts-ignore
//     req.user = user;

//     return { updated: true }
// };

export default defineEventHandler(async (event) => {
    const { user } = await readBody(event)
    // console.log("user", user.uid)
    event.node.req = user;
    return { updated: true }
})
