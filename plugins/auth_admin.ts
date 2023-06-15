export default defineNuxtPlugin(() => {
	addRouteMiddleware("auth_admin", () => {
		const userCookie = useCookie("userCookie");
		// console.log('firebase', userCookie.value);
		const config = useRuntimeConfig();

		if (userCookie.value) {
			if (
				// !userCookie.value
				// @ts-ignore
				userCookie.value.uid !== config.public.ADMIN_UID
			) {
				// @ts-ignore
				// console.log('firebase', userCookie.value.uid, config.public);
				return navigateTo("/admin/sign-in");
			} else {
				// @ts-ignore
				// console.log('else', userCookie.value.uid, config.public.ADMIN_UID);
			}
		} else {
			return navigateTo("/admin/sign-in");
		}

	});
});
