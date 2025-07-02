export default defineNuxtRouteMiddleware(async () => {
  const { user, isAuthenticated, isAdmin, initializeAuth } = useAuth()

  console.log('Admin middleware - User:', user.value);
  console.log('Admin middleware - isAuthenticated:', isAuthenticated.value);
  console.log('Admin middleware - isAdmin:', isAdmin.value);

  // ถ้ายังไม่ได้ authenticate
  if (!isAuthenticated.value) {
    console.log('Not authenticated, redirecting to login');
    return navigateTo('/login')
  }

  // ถ้ายังไม่มี user data ให้ลอง initialize อีกครั้ง
  if (!user.value) {
    console.log('No user data, trying to initialize...');
    const success = await initializeAuth();
    if (!success) {
      return navigateTo('/login');
    }
  }

  // ตรวจสอบสิทธิ์ admin
  if (!isAdmin.value) {
    const userRole = user.value?.permission || user.value?.role;
    console.log('Admin access denied for role:', userRole);
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Admin privileges required.'
    })
  }

  console.log('Admin access granted');
})