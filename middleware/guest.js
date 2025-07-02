export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, getRedirectPath } = useAuth()
  if (isAuthenticated.value) {
    return navigateTo(getRedirectPath())
  }
})
