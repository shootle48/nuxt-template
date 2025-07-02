import { jwtDecode } from "jwt-decode";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie("token");
  const { user, initializeAuth, getRedirectPath } = useAuth();
  

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(to.path);

  if (!token?.value) {
    if (!isPublicRoute) {
      return navigateTo("/login");
    }
    return;
  }

  try {
    const decoded = jwtDecode(token.value);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < now) {
      console.warn("Token expired");
      token.value = null;
      if (!isPublicRoute) return navigateTo("/login");
      return;
    }

    if (!user.value) {
      const success = await initializeAuth();
      if (!success && !isPublicRoute) {
        return navigateTo("/login");
      }
    }

    if (isPublicRoute && user.value) {
      const redirectPath = getRedirectPath();
      return navigateTo(redirectPath);
    }

    const userRole = decoded.permission || decoded.role || "user";

    if (to.path.startsWith("/admin")) {
      if (!["admin", "super_admin"].includes(userRole)) {
        return navigateTo("/");
      }
    }

    if (to.path === "/") {
      const redirectPath = getRedirectPath(userRole);
      if (redirectPath !== "/") {
        return navigateTo(redirectPath);
      }
    }

  } catch (e) {
    console.error("Invalid JWT:", e);
    token.value = null;
    if (!isPublicRoute) {
      return navigateTo("/login");
    }
  }
});
