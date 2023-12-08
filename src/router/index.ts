import { createRouter, createWebHistory } from 'vue-router';
import testPageVue from '@/views/testPage.vue';
import userLogin from '@/views/userLogin.vue';
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			redirect: '/user' // 这里设置重定向
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
		},
		{
			path: '/user',
			name: 'user',
			component: () => import('@/views/user/mainPage.vue'),
			redirect: '/user/info',
			children: [
				{
					path: 'search',
					name: 'userSearch',
					component: () => import('@/views/user/subpage/searchPage.vue')
				},
				{
					path: 'collection',
					name: 'userCollection',
					component: () => import('@/views/user/subpage/collectionPage.vue')
				},
				{
					path: 'info',
					name: 'userInfo',
					component: () => import('@/views/user/subpage/userInfo.vue')
				}
			]
		},
		{
			path: '/admin',
			name: 'admin',
			component: () => import('@/views/admin/mainPage.vue'),
			redirect: '/admin/movie',
			children: [
				{
					path: 'movie',
					name: 'adminMovie',
					component: () => import('@/views/admin/subpage/movieSet.vue')
				},
				{
					path: 'user',
					name: 'adminUser',
					component: () => import('@/views/admin/subpage/userSet.vue')
				}
			]
		}
	]
});

export default router;
