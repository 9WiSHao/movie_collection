import { API } from '@/api/backend';
interface userRes {
	code: number;
	msg: string;
	data: userData;
}
interface userData {
	userId: number;
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
			userEmail: usernameEmail,
			username: usernameEmail,
			password: password
		})
	});
	const json = (await res.json()) as userRes;
	console.log('登录', json);
	if (json.code !== 200) {
		throw new Error('登录失败，用户名或密码错误');
	}
	return json.data;
}

interface signUpRes {
	code: number;
	msg: string;
	data: null;
}
export async function fetchSignUp(usernameEmail: string, username: string, password: string): Promise<boolean> {
	const res = await fetch(API.register, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			userEmail: usernameEmail,
			username: username,
			password: password
		})
	});
	const json = (await res.json()) as signUpRes;
	console.log('注册', json);

	if (json.code === 200) {
		return true;
	} else {
		return false;
	}
}

interface movie {
	movieId: number;
	title: string;
	img: string;
	director: string;
	writer: string;
	actor: string;
	type: string;
	country: string;
	language: string;
	releaseYear: string;
	time: string;
	bename: string;
	imdb: string;
	rating: string;
	ratingNumber: string;
}
interface movieListRes {
	code: number;
	msg: string;
	data: Array<movie>;
}
export async function fetchMovieList(headIndex: number) {
	const res = await fetch(`${API.getMovieList}/${headIndex}`);
	const json = (await res.json()) as movieListRes;
	console.log('电影数据', json);

	if (json.code !== 200) {
		throw new Error('电影数据获取错误');
	}

	return json.data;
}
export async function fetchMovieCollection(userid: number) {
	const res = await fetch(API.getCollection, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			userId: userid
		})
	});
	const json = (await res.json()) as movieListRes;
	console.log('收藏列表', json);
	if (json.code !== 200) {
		throw new Error('电影数据获取错误');
	}

	return json.data;
}

interface changeCollection {
	code: number;
	msg: string;
	data: null;
}
export async function addCollection(userId: number, movieId: number) {
	const res = await fetch(API.addCollection, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			userId: userId,
			movieId: movieId
		})
	});
	const json = (await res.json()) as changeCollection;
	console.log('添加收藏', json);
	if (json.code !== 200) {
		return false;
	} else {
		return true;
	}
}
export async function deleteCollection(userId: number, movieId: number) {
	const res = await fetch(API.deleteCollection, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			userId: userId,
			movieId: movieId
		})
	});
	const json = (await res.json()) as changeCollection;
	console.log('删除收藏', json);
	if (json.code !== 200) {
		return false;
	} else {
		return true;
	}
}

interface showMovieByTitle_movie {
	movieId: number;
	title: string;
}
interface showMovieByTitle_res {
	code: number;
	msg: string;
	data: Array<showMovieByTitle_movie>;
}
export async function showMovieByTitle(title: string) {
	const res = await fetch(`${API.showMovieByTitle}/${title}`);
	const json = (await res.json()) as showMovieByTitle_res;
	console.log('搜索建议数据', json);

	if (json.code !== 200) {
		throw new Error('搜索建议获取错误');
	}

	return json.data;
}

interface showMovieById_res {
	code: number;
	msg: string;
	data: movie;
}
export async function showMovieById(id: number) {
	const res = await fetch(`${API.showMovieById}/${id}`);
	const json = (await res.json()) as showMovieById_res;
	console.log('点击搜索建议数据', json);

	if (json.code !== 200) {
		throw new Error('搜索建议获取错误');
	}

	return json.data;
}

interface updateUserMsg {
	code: number;
	msg: string;
	data: null;
}
export async function updateUserMsg(userId: number, password: string, avatarBase64: string) {
	const passwordFetch = fetch(API.updatePassword, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			userId: userId,
			password: password
		})
	});

	const avatarFetch = fetch(API.updateAvatar, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			userId: userId,
			avatar: avatarBase64
		})
	});

	const res = await Promise.all([passwordFetch, avatarFetch]);

	if (res[0].status !== 200 || res[1].status !== 200) {
		throw new Error('更新失败');
	}

	return true;
}

interface deleteMovie_res {
	code: number;
	msg: string;
	data: null;
}
export async function deleteMovie(movieId: number) {
	const res = await fetch(`${API.deleteMovie}/${movieId}`, {
		method: 'DELETE'
	});

	const json = (await res.json()) as deleteMovie_res;

	if (json.code !== 200) {
		throw new Error('删除失败');
	} else {
		return true;
	}
}

interface movieForm {
	movieId: string;
	title: string;
	img: string;
	director: string;
	writer: string;
	actor: string;
	type: string;
	country: string;
	language: string;
	releaseYear: string;
	time: string;
	bename: string;
	imdb: string;
	rating: string;
	ratingNumber: string;
}
interface addMovie_res {
	code: number;
	msg: string;
	data: null;
}
export async function addMovie(movie: movieForm) {
	const res = await fetch(API.addMovie, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(movie)
	});
	const json = (await res.json()) as addMovie_res;
	if (json.code !== 200) {
		throw new Error('添加失败');
	} else {
		return true;
	}
}

interface userMsg {
	userId: string;
	username: string;
	password: string;
	userPrivilege: number;
	userEmail: string;
	avatar: string;
}
interface userList_res {
	code: number;
	msg: string;
	data: Array<userMsg>;
}
export async function getAllUser() {
	const res = await fetch(API.getAllUser);
	const json = (await res.json()) as userList_res;
	console.log('用户列表', json);
	if (json.code !== 200) {
		throw new Error('用户列表获取错误');
	}
	return json.data;
}

interface deleteUser_res {
	code: 200;
	msg: 'success';
	data: null;
}
export async function deleteUser(userId: number) {
	const res = await fetch(`${API.deleteUser}/${userId}`, {
		method: 'DELETE'
	});
	const json = (await res.json()) as deleteUser_res;
	if (json.code !== 200) {
		throw new Error('删除失败');
	} else {
		return true;
	}
}
