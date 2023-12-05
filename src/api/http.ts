import { API } from './backend';
interface userRes {
	code: number;
	msg: string;
	data: userData;
}
interface userData {
	userId: string;
	username: string;
	password: string;
	userPrivilege: number;
	userEmail: string;
	avatar?: string;
}
export async function fetchLogin(usernameEmail: string, password: string): Promise<userData> {
	const res = await fetch(API.login, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: usernameEmail,
			password: password
		})
	});
	const json = (await res.json()) as userRes;
	if (json.code !== 200) {
		throw new Error('登录失败，用户名或密码错误');
	}
	return json.data;
}
