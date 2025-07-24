const openRoutes = require("./openRoutes");

const isPublicRoute = (req) => {
  return openRoutes.some(route =>
    route.method === req.method &&
    route.path.test(req.path)
  );
};

module.exports = isPublicRoute;
