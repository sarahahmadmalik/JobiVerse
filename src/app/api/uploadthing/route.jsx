// import { createRouteHandler } from "uploadthing/next";
// import { UTApi } from "uploadthing/server";

// export const { GET, POST } = createRouteHandler({
//   apiKey: process.env.UPLOADTHING_SECRET,
// });

// export const utapi = new UTApi({
//   apiKey: process.env.UPLOADTHING_SECRET,
// });

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core/route";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
 
});
