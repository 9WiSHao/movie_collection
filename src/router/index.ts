import { createRouter, createWebHistory } from 'vue-router';
import testPageVue from '@/views/testPage.vue';
import userLogin from '@/views/userLogin.vue';
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			redirect: '/login' // 这里设置重定向
		},
		{
			path: '/login',
			name: 'login',
			component: userLogin
		},
		{
			path: '/test',
			name: 'test',
			component: testPageVue
		}
	]
});

export default router;
