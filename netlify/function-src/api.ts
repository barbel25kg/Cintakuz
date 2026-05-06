import serverless from "serverless-http";
import app from "../../artifacts/api-server/src/app";

export const handler = serverless(app, {
  // Netlify redirect strips /api prefix (e.g. /api/auth/login → /auth/login).
  // Express mounts everything under /api, so we restore the prefix here.
  request(request: any) {
    if (!request.url.startsWith("/api")) {
      request.url = "/api" + request.url;
    }
  },
});
