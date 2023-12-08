import { defineStore } from 'pinia';
import { ref } from 'vue';

interface userInformation {
	userId?: number;
	username?: string;
	avatarUrl?: string;
	email?: string;
	password?: string;
	userPrivilege?: number;
}
export const useUserStore = defineStore('userStore', () => {
	const userId = ref(-1);
	const username = ref('未登录');
	const avatarUrl = ref('/img/Akkarin.jpg');
	const email = ref('-1');
	const password = ref('-1');
	const userPrivilege = ref(-1);

	function setInformation(data: userInformation) {
		if (typeof data.userId !== 'undefined') userId.value = data.userId;
		if (typeof data.username !== 'undefined') username.value = data.username;
		if (typeof data.avatarUrl !== 'undefined') avatarUrl.value = data.avatarUrl;
		if (typeof data.email !== 'undefined') email.value = data.email;
		if (typeof data.password !== 'undefined') password.value = data.password;
		if (typeof data.userPrivilege !== 'undefined') userPrivilege.value = data.userPrivilege;
	}

	return {
		userId,
		username,
		avatarUrl,
		email,
		password,
		userPrivilege,
		setInformation
	};
});
