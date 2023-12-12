<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { fetchLogin, fetchSignUp } from '@/api/http';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import router from '@/router';

const { setInformation } = useUserStore();

const loginFormRef = ref<FormInstance>();
const signUpFormRef = ref<FormInstance>();
const loginForm = reactive({
	usernameEmail: '',
	password: ''
});
const loginRules = reactive<FormRules<typeof loginForm>>({
	usernameEmail: [
		{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
		{ min: 3, message: '用户名或邮箱不会少于3个字符', trigger: 'blur' }
	],
	password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
});
const signUpForm = reactive({
	username: '',
	email: '',
	password: '',
	confirmPassword: ''
});
const signUpRules = reactive<FormRules<typeof signUpForm>>({
	username: [
		{ required: true, message: '用户名不能为空', trigger: 'blur' },
		{ min: 4, max: 16, message: '用户名长度需要在4到16个字符之间', trigger: 'blur' },
		{ pattern: /^[\w-]{4,16}$/, message: '用户名只能包含字母、数字、下划线和短连接线', trigger: 'blur' }
	],
	email: [
		{ required: true, message: '邮箱不能为空', trigger: 'blur' },
		{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
	],
	password: [
		{ required: true, message: '密码不能为空', trigger: 'blur' },
		{ min: 4, message: '密码至少需要4个字符', trigger: 'blur' },
		{ pattern: /^[A-Za-z\d\W_]+$/, message: '密码只能包含大小写字母、特殊符号和数字', trigger: 'blur' }
	],
	confirmPassword: [{ validator: confirm, trigger: 'blur' }]
});
function confirm(rule: any, value: any, callback: any) {
	if (value === '') {
		callback(new Error('请再次输入密码'));
	} else if (value !== signUpForm.password) {
		callback(new Error('两次密码不一致'));
	} else {
		callback();
	}
}

function handleLogin() {
	loginFormRef.value?.validate(async (valid: boolean) => {
		if (valid) {
			console.log(loginForm.usernameEmail);
			console.log(loginForm.password);
			try {
				const res = await fetchLogin(loginForm.usernameEmail, loginForm.password);
				if (res.userPrivilege === 3) throw new Error('登录错误');

				setInformation({
					userId: res.userId,
					username: res.username,
					email: res.userEmail,
					password: res.password,
					userPrivilege: res.userPrivilege,
					avatarUrl: res.avatar || undefined
				});
				if (res.userPrivilege === 1) {
					router.push('/user');
				}
				if (res.userPrivilege === 2) {
					router.push('/admin');
				}
			} catch (err) {
				console.log('登录error', err);
				ElMessage({
					message: '用户名或密码错误',
					type: 'error'
				});
			}
			// router.push('/user')
		} else {
			ElMessage({
				message: '登录信息格式错误',
				type: 'warning'
			});
		}
	});
}
function handleSignUp() {
	signUpFormRef.value?.validate(async (valid: boolean) => {
		if (valid) {
			try {
				console.log(signUpForm.username);
				console.log(signUpForm.email);
				console.log(signUpForm.password);

				const res = await fetchSignUp(signUpForm.email, signUpForm.username, signUpForm.password);
				if (res) {
					ElMessage({
						message: '注册成功,请返回登录',
						type: 'success'
					});
					toggleSign();
				} else {
					ElMessage({
						message: '注册失败',
						type: 'error'
					});
				}
			} catch (err) {
				console.log('注册error', err);
				ElMessage({
					message: '注册错误',
					type: 'error'
				});
			}
		} else {
			ElMessage({
				message: '注册信息格式错误',
				type: 'warning'
			});
		}
	});
}

const signUp = ref(true);
function toggleSign() {
	signUp.value = !signUp.value;
	loginForm.password = '';
	loginForm.usernameEmail = '';
	signUpForm.username = '';
	signUpForm.email = '';
	signUpForm.password = '';
	signUpForm.confirmPassword = '';
}
</script>
<template>
	<div class="background">
		<div class="main">
			<div class="pic-card"><img src="/img/loginleft.jpg" alt="" /></div>
			<div class="right">
				<div class="title">电影收藏管理系统</div>
				<div class="form-sign-in" v-if="signUp">
					<el-form class="form" size="large" ref="loginFormRef" :model="loginForm" :rules="loginRules">
						<el-form-item prop="usernameEmail">
							<el-input v-model="loginForm.usernameEmail" placeholder="用户名 / 邮箱" />
						</el-form-item>
						<el-form-item prop="password">
							<el-input v-model="loginForm.password" placeholder="密码" type="password" show-password autocomplete="off" />
						</el-form-item>
						<el-form-item>
							<el-button type="primary" class="custom-button" @click="handleLogin">登 录</el-button>
						</el-form-item>
					</el-form>
					<div class="sign-up">没有账号？请<el-button text type="primary" @click="toggleSign">注册</el-button></div>
				</div>
				<div class="form-sign-up" v-if="!signUp">
					<el-form class="form" size="large" ref="signUpFormRef" :model="signUpForm" :rules="signUpRules">
						<el-form-item prop="username">
							<el-input v-model="signUpForm.username" placeholder="请输入用户名" />
						</el-form-item>
						<el-form-item prop="email">
							<el-input v-model="signUpForm.email" placeholder="请输入邮箱" />
						</el-form-item>
						<el-form-item prop="password">
							<el-input v-model="signUpForm.password" placeholder="请输入密码" type="password" show-password autocomplete="off" />
						</el-form-item>
						<el-form-item prop="confirmPassword">
							<el-input placeholder="请再次输入密码" v-model="signUpForm.confirmPassword" type="password" show-password autocomplete="off" />
						</el-form-item>
						<el-form-item>
							<el-button type="primary" class="custom-button" @click="handleSignUp">注 册</el-button>
						</el-form-item>
					</el-form>
					<div class="sign-in">返回<el-button text type="primary" @click="toggleSign">登录</el-button>页面</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss">
.background {
	height: 100vh;
	width: 100vw;
	z-index: -9;
	background: url('/img/loginbg.jpg') no-repeat center center;
	background-size: cover;

	.main {
		height: 550px;
		width: 900px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		background-color: #fff;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: black 0px 0px 10px;

		.pic-card {
			width: 45%;
			height: 100%;
			overflow: hidden;

			img {
				height: 100%;
				transform: translateX(-50%);
			}
		}

		.right {
			width: 55%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;

			.title {
				font-size: 40px;
				color: #005573;
				margin-top: 60px;
			}

			.form-sign-in,
			.form-sign-up {
				margin-top: 60px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 360px;

				.form {
					width: 300px;
				}

				.custom-button {
					width: 100%;
				}

				.sign-in,
				.sign-up {
					display: flex;
					align-items: center;
					font-size: small;
					color: gray;
				}
			}
		}
	}
}
</style>
