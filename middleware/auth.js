import { jwtDecode } from "jwt-decode";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const tokenCookie = useCookie("token");
  const { user, initializeAuth, getRedirectPath } = useAuth();
  
  console.log('Auth middleware - Current path:', to.path);
  console.log('Auth middleware - Token exists:', !!tokenCookie?.value);
  console.log('Auth middleware - User exists:', !!user.value);

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(to.path);

  // ถ้าไม่มี token
  if (!tokenCookie?.value) {
    console.log('No token, redirecting to login');
    if (!isPublicRoute) {
      return navigateTo("/login");
    }
    return;
  }

  try {
    const decoded = jwtDecode(tokenCookie.value);
    const now = Math.floor(Date.now() / 1000);

    // ตรวจสอบ token หมดอายุ
    if (decoded.exp && decoded.exp < now) {
      console.warn("Token expired");
      tokenCookie.value = null;
      if (!isPublicRoute) return navigateTo("/login");
      return;
    }

    // ถ้ายังไม่มี user data ให้ initialize
    if (!user.value) {
      console.log('Initializing auth...');
      const success = await initializeAuth();
      if (!success && !isPublicRoute) {
        return navigateTo("/login");
      }
    }

    // รอให้ user data โหลดเสร็จก่อนตรวจสอบสิทธิ์
    await nextTick();

    // ถ้าเป็น public route และมี user แล้ว ให้ redirect ไปหน้าที่เหมาะสม
    if (isPublicRoute && user.value) {
      const redirectPath = getRedirectPath();
      console.log('Public route with user, redirecting to:', redirectPath);
      return navigateTo(redirectPath);
    }

    // ตรวจสอบสิทธิ์เข้าถึง admin - ใช้ข้อมูลจาก user object หรือ token
    if (to.path.startsWith("/admin")) {
      const userRole = user.value?.permission || user.value?.role || decoded.permission || decoded.role || "user";
      console.log('Checking admin access for role:', userRole);
      console.log('User object:', user.value);
      
      if (!["admin", "super_admin"].includes(userRole)) {
        console.log('Access denied to admin area, role:', userRole);
        throw createError({
          statusCode: 403,
          statusMessage: `Access denied. Admin privileges required. Current role: ${userRole}`
        });
      }
      console.log('Admin access granted for role:', userRole);
    }

    // Redirect จาก root path ตาม role
    if (to.path === "/") {
      const userRole = user.value?.permission || user.value?.role || decoded.permission || decoded.role || "user";
      const redirectPath = getRedirectPath(userRole);
      if (redirectPath !== "/" && ["admin", "super_admin"].includes(userRole)) {
        console.log('Redirecting admin to admin area');
        return navigateTo(redirectPath);
      }
    }

  } catch (e) {
    console.error("Auth middleware error:", e);
    tokenCookie.value = null;
    if (!isPublicRoute) {
      return navigateTo("/login");
    }
  }
});