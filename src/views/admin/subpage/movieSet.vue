<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { Ref } from 'vue';
import { Search, CirclePlus } from '@element-plus/icons-vue';
import { fetchMovieList, showMovieById, showMovieByTitle, addMovie } from '@/api/http';
import { useUserStore } from '@/stores/user';
import { deleteMovie } from '@/api/http';
const userStore = useUserStore();

const moviesArr = ref<any>([
	{
		movieId: 1,
		title: '加载中',
		img: '',
		director: '加载中',
		writer: '加载中',
		actor: '加载中',
		type: '加载中',
		country: '加载中',
		language: '加载中',
		releaseYear: '加载中',
		time: '加载中',
		bename: '加载中',
		imdb: '加载中',
		rating: '1',
		ratingNumber: '1'
	}
]);

onMounted(async () => {
	try {
		moviesArr.value = await fetchMovieList(1);
	} catch (err) {
		console.log(err);
	}
});

const searchInput = ref('');
const showSuggestions = ref(false);
const hoverSuggestion = ref(false);
const suggestions = ref([{ movieId: -1, title: '搜索中...' }]);

async function onSearchInput() {
	if (searchInput.value.trim() !== '') {
		showSuggestions.value = true;
		const res = await showMovieByTitle(searchInput.value);
		if (res.length !== 0) {
			suggestions.value = res;
		} else {
			suggestions.value = [{ movieId: -1, title: '...未找到结果' }];
		}
	} else {
		showSuggestions.value = false;
	}
}
function hideSuggestions() {
	setTimeout(() => {
		if (!hoverSuggestion.value) {
			showSuggestions.value = false;
		}
	}, 300);
}
async function handleclickSuggestion(e: MouseEvent) {
	const target = e.target as HTMLElement;
	if (!target.closest('.suggestion-item')) return;
	hoverSuggestion.value = false;
	showSuggestions.value = false;
	console.log(target.innerText);
	console.log(target.dataset.id);
	const res = await showMovieById(Number(target.dataset.id));
	console.log(res);
	moviesArr.value = [{ ...res }];
	paginationShow.value = false;
}

const dialogVisible = ref(false);
const movieForm = reactive({
	movieId: '',
	title: '',
	img: '',
	director: '',
	writer: '',
	actor: '',
	type: '',
	country: '',
	language: '',
	releaseYear: '',
	time: '',
	bename: '',
	imdb: '',
	rating: '',
	ratingNumber: ''
});
async function submitMovie() {
	try {
		console.log('提交的电影信息:', movieForm);
		const res = await addMovie(movieForm);
		console.log(res);

		if (!res) throw new Error('电影添加失败');

		ElMessage({
			message: '电影添加成功',
			type: 'success'
		});
	} catch (err) {
		console.log('电影添加失败', err);
		ElMessage({
			type: 'error',
			message: '电影添加失败'
		});
	}
}

async function handleDelete(e: MouseEvent) {
	const target = e.target as HTMLElement;
	const deleteClick = target.closest('.delete1');
	if (!deleteClick) return;
	const Id = deleteClick.getAttribute('data-id');
	const movie = deleteClick.getAttribute('data-movie');

	try {
		await ElMessageBox.confirm(`电影${movie} 将被删除`, '确认删除', {
			confirmButtonText: '确认删除',
			cancelButtonText: '取消',
			type: 'warning'
		});
		console.log(Id, movie);
		const res = await deleteMovie(Number(Id));
		if (!res) throw new Error('电影删除失败');
		moviesArr.value = moviesArr.value.filter((item) => item.movieId !== Number(Id));
		ElMessage({
			type: 'success',
			message: '成功删除电影'
		});

		setTimeout(() => {}, 1000);
	} catch (err) {
		console.log('电影删除失败', err);

		ElMessage({
			type: 'warning',
			message: '取消删除操作'
		});
	}
}

const paginationShow = ref(true);
const currentPage = ref(1);
const scrollContainer: Ref<HTMLElement | null> = ref(null);
const handleCurrentChange = async (val: number) => {
	currentPage.value = val;
	const start = (val - 1) * 10 + 1;
	console.log(currentPage.value);
	console.log(start);
	moviesArr.value = await fetchMovieList(start);
	if (scrollContainer.value) {
		scrollContainer.value.scrollTop = 0;
	}
};
</script>
<template>
	<div class="background" ref="scrollContainer">
		<div class="top">
			<div class="search">
				<el-input v-model="searchInput" class="search-input" @input="onSearchInput" @blur="hideSuggestions" placeholder="此处输入搜索电影" :prefix-icon="Search" />
				<transition name="fade">
					<div v-if="showSuggestions" class="suggestions" @click="(hoverSuggestion = true), handleclickSuggestion($event)" @mouseleave="(hoverSuggestion = false), hideSuggestions()">
						<div v-for="item in suggestions" :key="item.movieId" :data-id="item.movieId" class="suggestion-item">
							{{ item.title }}
						</div>
					</div>
				</transition>
			</div>
		</div>
		<div class="add-movie">
			<el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">添加电影</el-button>
			<el-dialog v-model="dialogVisible" title="添加电影" width="50%">
				<el-form :model="movieForm" label-width="120px">
					<el-form-item label="电影ID">
						<el-input v-model="movieForm.movieId"></el-input>
					</el-form-item>
					<el-form-item label="标题">
						<el-input v-model="movieForm.title"></el-input>
					</el-form-item>
					<el-form-item label="图片链接">
						<el-input v-model="movieForm.img"></el-input>
					</el-form-item>
					<el-form-item label="导演">
						<el-input v-model="movieForm.director"></el-input>
					</el-form-item>
					<el-form-item label="编剧">
						<el-input v-model="movieForm.writer"></el-input>
					</el-form-item>
					<el-form-item label="主演">
						<el-input v-model="movieForm.actor"></el-input>
					</el-form-item>
					<el-form-item label="类型">
						<el-input v-model="movieForm.type"></el-input>
					</el-form-item>
					<el-form-item label="国家/地区">
						<el-input v-model="movieForm.country"></el-input>
					</el-form-item>
					<el-form-item label="语言">
						<el-input v-model="movieForm.language"></el-input>
					</el-form-item>
					<el-form-item label="上映时间">
						<el-input v-model="movieForm.releaseYear"></el-input>
					</el-form-item>
					<el-form-item label="电影时长">
						<el-input v-model="movieForm.time"></el-input>
					</el-form-item>
					<el-form-item label="电影其他名称">
						<el-input v-model="movieForm.bename"></el-input>
					</el-form-item>
					<el-form-item label="IMDB链接">
						<el-input v-model="movieForm.imdb"></el-input>
					</el-form-item>
					<el-form-item label="评分">
						<el-input v-model="movieForm.rating"></el-input>
					</el-form-item>
					<el-form-item label="评分人数">
						<el-input v-model="movieForm.ratingNumber"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogVisible = false">取消</el-button>
						<el-button
							type="primary"
							@click="
								submitMovie();
								dialogVisible = false;
							"
							>确认</el-button
						>
					</span>
				</template>
			</el-dialog>
		</div>
		<div class="main">
			<div v-for="item in moviesArr" :key="item.movieId" class="movies">
				<div class="index">
					<div>{{ item.movieId }}</div>
				</div>
				<div class="message">
					<img :src="item.img" />
					<div class="right-text">
						<div class="top2">
							<div class="top-left">
								<div class="title">
									<div class="title-text">{{ item.title }}</div>
									<div class="time">{{ item.time }}</div>
								</div>
								<div class="bename"><span class="gery">别称: </span>{{ item.bename }}</div>
								<div class="type">{{ item.type }}</div>
							</div>
							<div class="top-right" :data-id="item.movieId" @click="handleDelete">
								<div class="delete1" :data-id="item.movieId" :data-movie="item.title">删除</div>
							</div>
						</div>
						<div class="staff">
							<div class="director"><span class="gery">导演: </span>{{ item.director }}</div>
							<div class="writer"><span class="gery">编剧: </span>{{ item.writer }}</div>
							<div class="actor"><span class="gery">主演: </span>{{ item.actor }}</div>
						</div>
						<div class="other">
							<div class="country"><span class="gery">制片国家/地区: </span>{{ item.country }}</div>
							<div class="language"><span class="gery">语言: </span>{{ item.language }}</div>
							<div class="release-yeae"><span class="gery">上映日期: </span>{{ item.releaseYear }}</div>
							<div class="imdb"><span class="gery">IMDb: </span>{{ item.imdb }}</div>
						</div>
					</div>
				</div>
				<div class="rating">
					<div class="score">{{ item.rating }}</div>
					<div class="number">{{ item.ratingNumber.length > 4 ? `${item.ratingNumber.slice(0, -4)}万` : item.ratingNumber }}人评价</div>
				</div>
			</div>
			<div class="pagination" v-if="paginationShow"><el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="prev, pager, next" :total="260"> </el-pagination></div>
		</div>
	</div>
</template>
<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.gery {
	color: #999999;
}

.background {
	width: calc(100vw - 220px);
	min-width: 1000px;
	height: calc(100vh - 20px);
	margin: 0 10px;
	overflow: auto;

	.top {
		width: 100%;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;

		.search {
			width: 70%;
			position: relative;

			.search-input {
				width: 100%;
			}

			.suggestions {
				position: absolute;
				width: 100%;
				background-color: #fff;
				border: 1px solid #ccc;
				border-radius: 0 0 5px 5px;
				top: 32px;

				.suggestion-item {
					padding: 5px 30px;
					color: #606266;
					font-size: smaller;

					&:hover {
						background-color: #f5f5f5;
						cursor: pointer;
					}
				}
			}
		}
	}

	.main {
		width: 100%;
		height: 100%;

		& > div {
			width: 100%;
			margin-top: 10px;
		}

		.movies {
			display: flex;
			justify-content: space-between;
			padding-top: 10px;
			border-top: #eeeeee 1px solid;

			.index {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 10px;

				div {
					font-size: xx-large;
					color: #acacac;
					font-weight: 900;
					font-style: italic;
				}
			}

			.message {
				width: 100%;
				min-width: 850px;
				display: flex;

				img {
					height: 220px;
				}

				.right-text {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding: 0 6px;
					width: 100%;

					.top2 {
						display: flex;
						justify-content: space-between;

						.top-left {
							.title {
								display: flex;
								align-items: end;

								.title-text {
									font-size: larger;
									margin-right: 4px;
								}

								.time {
									font-size: small;
									font-weight: bold;
									color: #999999;
								}
							}

							.bename {
								font-size: small;
								color: #999999;
							}

							.type {
								font-size: small;
							}
						}
						.top-right {
							color: #fff;
							div {
								cursor: pointer;
								background-color: #f44336;
								border: none;
								border-radius: 5px;
								padding: 10px 20px;
								cursor: pointer;
								&:hover {
									background-color: #d32f2f;
								}
							}
						}
					}

					.staff {
						font-size: small;
					}

					.other {
						font-size: small;
					}
				}
			}

			.rating {
				width: 80px;
				min-width: 80px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.score {
					font-size: xx-large;
					font-weight: 900;
					color: gold;
				}

				.number {
					font-size: xx-small;
					color: #bbbbbb;
				}
			}
		}
		.pagination {
			display: flex;
			justify-content: center;
		}
	}
}
</style>
