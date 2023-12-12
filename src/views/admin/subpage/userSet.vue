<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllUser, deleteUser } from '@/api/http';
onMounted(async () => {
	try {
		const res = await getAllUser();
		if (res) {
			userArr.value = res;
		} else {
			throw new Error('获取用户失败');
		}
	} catch (error) {
		console.log(error);
		ElMessage({
			message: '获取用户失败',
			type: 'error'
		});
	}
});
const userArr = ref([
	{
		userId: '-1',
		username: '加载中...',
		password: 'xxxx',
		userPrivilege: 1,
		userEmail: 'john@example.com',
		avatar: 'https://patchwiki.biligame.com/images/umamusume/e/e8/183qk6wutp4tdyrpz476ujw6x1qzbsa.png'
	}
]);
function privilegeSwitch(privilege: number) {
	switch (privilege) {
		case 1:
			return '普通用户';
		case 2:
			return '管理员';
		default:
			return '已删除';
	}
}
async function handleDeleteUser(id: string) {
	try {
		await ElMessageBox.confirm(`用户ID:${id} 将被删除`, '确认删除', {
			confirmButtonText: '确认删除',
			cancelButtonText: '取消',
			type: 'warning'
		});
		console.log(id);
		const res = await deleteUser(Number(id));
		if (!res) throw new Error('删除失败');

		ElMessage({
			message: '删除成功',
			type: 'success'
		});
		userArr.value = userArr.value.filter((item) => item.userId !== id);
	} catch (error) {
		console.log(error);
		ElMessage({
			message: '删除失败',
			type: 'error'
		});
	}
}
</script>
<template>
	<div>
		<div class="users-container">
			<!-- 假设这里使用某种循环来渲染每个用户 -->
			<div class="user-card" v-for="item in userArr" :key="item.userId">
				<div class="user-avatar">
					<img :src="item.avatar || '/img/Akkarin.jpg'" alt="Avatar" />
				</div>
				<div class="user-details">
					<h3 class="user-name">用户名: {{ item.username }}</h3>
					<p class="user-email">邮箱: {{ item.userEmail }}</p>
					<p class="user-id">用户ID: {{ item.userId }}</p>
					<p class="user-privilege">权限等级: {{ privilegeSwitch(item.userPrivilege) }}</p>
					<p class="user-password">密码: {{ item.password }}</p>
				</div>
				<button class="delete-btn" @click="handleDeleteUser(item.userId)">删除</button>
			</div>
			<!-- 更多用户卡片 -->
		</div>
	</div>
</template>
<style scoped lang="scss">
.users-container {
	width: calc(100vw - 220px);
	min-width: 500px;
	height: calc(100vh - 20px);
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 20px;
}

.user-card {
	display: flex;
	align-items: center;
	width: 100%;
	border: 1px solid #ddd;
	padding: 10px 40px;
	margin-bottom: 15px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

	.user-avatar {
		width: 80px;
		height: 80px;
		border: 2px solid #007bff;
		border-radius: 50%;
		overflow: hidden;
		img {
			width: 80px;
			height: 80px;
			object-fit: cover;
		}
	}

	.user-details {
		flex-grow: 1;
		padding: 0 15px;

		.user-name,
		.user-email,
		.user-id,
		.user-privilege,
		.user-password {
			margin: 5px 0;
			font-size: 1em;
		}

		.user-name {
			font-weight: bold;
		}

		.user-password {
			color: #aaa;
		}
	}

	.delete-btn {
		background-color: #f44336;
		color: white;
		border: none;
		padding: 10px 20px;
		cursor: pointer;
		border-radius: 5px;

		&:hover {
			background-color: #d32f2f;
		}
	}
}
</style>
