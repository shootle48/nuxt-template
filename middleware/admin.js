export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!isAdmin.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Admin privileges required.'
    })
  }
})
