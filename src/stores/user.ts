import { defineStore } from 'pinia';
import { ref } from 'vue';

interface userInformation {
	userId?: string;
	username?: string;
	avatarUrl?: string;
	email?: string;
	password?: string;
}
export const useUserStore = defineStore('userStore', () => {
	const userId = ref('');
	const username = ref('');
	const avatarUrl = ref('');
	const email = ref('');
	const password = ref('');

	function setInformation(data: userInformation) {
		if (typeof data.userId !== 'undefined') userId.value = data.userId;
		if (typeof data.username !== 'undefined') username.value = data.username;
		if (typeof data.avatarUrl !== 'undefined') avatarUrl.value = data.avatarUrl;
		if (typeof data.email !== 'undefined') email.value = data.email;
		if (typeof data.password !== 'undefined') password.value = data.password;
	}

	return {
		userId,
		username,
		avatarUrl,
		email,
		password,
		setInformation
	};
});
