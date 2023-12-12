<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { Akkarin } from '@/assets/Akkarin';
import { updateUserMsg } from '@/api/http';
const userStore = useUserStore();

const editRef = ref<FormInstance>();
const editForm = reactive({
	password: ''
});
const editRules = reactive<FormRules<typeof editForm>>({
	password: [
		{ message: '密码不能为空', trigger: 'blur' },
		{ min: 4, message: '密码至少需要4个字符', trigger: 'blur' },
		{ pattern: /^[A-Za-z\d\W_]+$/, message: '密码只能包含大小写字母、特殊符号和数字', trigger: 'blur' }
	]
});
function handleEdit() {
	if (!isAvatarProcessed.value) {
		ElMessage({
			message: '头像上传中',
			type: 'warning'
		});
		return;
	}
	editRef.value?.validate(async (valid: boolean) => {
		if (valid) {
			const pwd = editForm.password || userStore.password;
			const avatar = avatarPreview.value === '/img/Akkarin.jpg' ? Akkarin : avatarPreview.value;
			console.log(pwd);
			console.log(avatar);
			const res = await updateUserMsg(userStore.userId, pwd, avatar);
			if (res) {
				userStore.setInformation({
					password: pwd,
					avatarUrl: avatar
				});
				ElMessage({
					message: '修改成功',
					type: 'success'
				});
			} else {
				ElMessage({
					message: '修改失败',
					type: 'error'
				});
			}
		} else {
			ElMessage({
				message: '修改不合规',
				type: 'warning'
			});
		}
	});
}

// 存储图片预览
const avatarPreview = ref(userStore.avatarUrl);
const isAvatarProcessed = ref(true);
// 处理文件选择和读取
function handleAvatarChange(event: Event) {
	isAvatarProcessed.value = false;
	const input = event.target as HTMLInputElement;

	// 如果 input.files 不空，继续
	if (!input.files || input.files.length < 0) return;
	const file = input.files[0];

	// 确保文件是图片类型
	if (!file.type.match('image.*')) {
		ElMessage({
			message: '请选择一个图片文件',
			type: 'warning'
		});
		return;
	}

	// 使用 FileReader 读取文件
	const reader = new FileReader();
	reader.onload = (e: ProgressEvent<FileReader>) => {
		// readAsDataURL 读出来是个base64字符串
		const result = e.target?.result;
		if (typeof result !== 'string') {
			ElMessage({
				message: '图片读取失败',
				type: 'warning'
			});
			return;
		}
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const size = Math.min(img.width, img.height);
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext('2d');

			// 计算剪裁起始点
			const startX = (img.width - size) / 2;
			const startY = (img.height - size) / 2;

			ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size);
			// 上传的图转换成100k一下的
			let quality = 1.0;
			let compressedBase64: string;
			do {
				compressedBase64 = canvas.toDataURL('image/jpeg', quality);
				quality -= 0.1; // 逐步降低质量
			} while (compressedBase64.length > 100 * 1024 && quality > 0); // 检查压缩后的大小

			avatarPreview.value = compressedBase64;
			isAvatarProcessed.value = true;
		};
		// 这步其实也比onload先执行
		img.src = result;
	};
	// 读取文件并将其转换为Base64(实际上这步比前面onload先执行)
	reader.readAsDataURL(file);
}
</script>
<template>
	<div class="user-info">
		<div class="default">
			<div class="avatar"><img :src="userStore.avatarUrl" /></div>
			<div class="username">用户名: {{ userStore.username }}</div>
			<div class="id">id: {{ userStore.userId }}</div>
			<div class="email">邮箱: {{ userStore.email }}</div>
		</div>
		<div class="edit">
			<div class="title">用户信息修改</div>
			<div class="avatar-edit">
				<img :src="avatarPreview || userStore.avatarUrl" class="avatar-preview" />
				<div class="upload-buttom">
					<div class="tip">修改头像</div>
					<input type="file" id="avatarUpload" @change="handleAvatarChange" hidden />
					<label for="avatarUpload" class="upload-label">选择图片</label>
					<div class="tip">如果不上传就是不修改</div>
				</div>
			</div>
			<el-form :rules="editRules" ref="editRef" :model="editForm" label-position="left">
				<el-form-item prop="password" label="修改密码:">
					<el-input v-model="editForm.password" placeholder="如果不输入就是不修改"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button class="confirm-button" type="success" @click="handleEdit">确认修改</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<style scoped lang="scss">
.user-info {
	width: calc(100vw - 220px);
	min-width: 600px;
	height: calc(100vh - 20px);
	margin: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;

	.default {
		width: 100%;
		padding-top: 80px;
		padding-bottom: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #43c0f9;

		.avatar {
			width: 100px;
			height: 100px;
			border-radius: 50%;
			border: #bbbbbb 3px solid;
			overflow: hidden;

			img {
				height: 100px;
			}
		}

		.username {
			margin-top: 10px;
			font-size: x-large;
			font-weight: bold;
		}

		.id,
		.email {
			margin-top: 10px;
		}
	}

	.edit {
		display: flex;
		flex-direction: column;
		align-items: center;

		.title {
			font-size: x-large;
			margin-top: 10px;
		}

		.avatar-edit {
			margin-top: 10px;
			display: flex;

			.avatar-preview {
				width: 100px;
				height: 100px;
				border-radius: 50%;
			}

			.upload-buttom {
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin-left: 20px;

				&:hover {
					background-color: #e1e1e1;
				}

				.upload-label {
					display: block;
					cursor: pointer;
					background-color: #f2f2f2;
					padding: 5px 10px;
					margin-top: 10px;
					border-radius: 5px;
					text-align: center;
				}

				.tip {
					font-size: x-small;
					color: gray;
				}
			}
		}

		.confirm-button {
			margin-top: 10px;
			margin-left: 90px;
		}
	}
}
</style>
