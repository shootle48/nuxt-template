export default defineNuxtRouteMiddleware(async () => {
  const { user, isAuthenticated, isAdmin, initializeAuth } = useAuth()
  const tokenCookie = useCookie("token");

  console.log('Admin middleware - Token exists:', !!tokenCookie?.value);
  console.log('Admin middleware - User:', user.value);
  console.log('Admin middleware - isAuthenticated:', isAuthenticated.value);
  console.log('Admin middleware - isAdmin:', isAdmin.value);

  // ถ้าไม่มี token เลย
  if (!tokenCookie?.value) {
    console.log('No token found, redirecting to login');
    return navigateTo('/login')
  }

  // ถ้ายังไม่มี user data ให้ลอง initialize อีกครั้ง
  if (!user.value) {
    console.log('No user data, trying to initialize...');
    const success = await initializeAuth();
    if (!success) {
      console.log('Initialize failed, redirecting to login');
      return navigateTo('/login');
    }
  }

  // รอให้ reactive data อัพเดท
  await nextTick();

  // ตรวจสอบ authentication อีกครั้ง
  if (!isAuthenticated.value) {
    console.log('Not authenticated after init, redirecting to login');
    return navigateTo('/login')
  }

  // ตรวจสอบสิทธิ์ admin
  const userRole = user.value?.permission || user.value?.role;
  console.log('Final role check:', userRole);
  
  if (!["admin", "super_admin"].includes(userRole)) {
    console.log('Admin access denied for role:', userRole);
    throw createError({
      statusCode: 403,
      statusMessage: `Access denied. Admin privileges required. Your role: ${userRole}`
    })
  }

  console.log('Admin access granted for role:', userRole);
})