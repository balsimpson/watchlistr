export default defineNuxtPlugin(() => {
	addRouteMiddleware("auth", () => {
		const userCookie = useCookie("userCookie");
		// console.log('firebase', userCookie.value);
		const config = useRuntimeConfig();

		if (
			// !userCookie.value
			// @ts-ignore
			userCookie.value.uid !== config.public.ADMIN_UID
		) {
			// @ts-ignore
			// console.log('firebase', userCookie.value.uid, config.public);
			return navigateTo("/admin/sign-in");
		}
	});
});
