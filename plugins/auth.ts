export default defineNuxtPlugin(() => {
  addRouteMiddleware('auth', () => {
    const userCookie = useCookie("userCookie");
    // console.log('firebase', userCookie.value);
    
    if (!userCookie.value) {
        // console.log('firebase', userCookie.value);
        return navigateTo('/admin/sign-in')
    }
  })
})