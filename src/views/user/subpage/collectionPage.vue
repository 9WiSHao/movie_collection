<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { StarFilled } from '@element-plus/icons-vue';
import { fetchMovieCollection, addCollection, deleteCollection } from '@/api/http';
import { useUserStore } from '@/stores/user';
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
		const collectedMoviesArr = await fetchMovieCollection(userStore.userId);
		moviesArr.value = collectedMoviesArr;
		const collectedMovieIds = new Set(collectedMoviesArr.map((movie) => movie.movieId));
		moviesArr.value = moviesArr.value.map((movie) => ({
			...movie,
			is_collected: collectedMovieIds.has(movie.movieId)
		}));
	} catch (err) {
		console.log(err);
	}
});

async function handleCollection(e: MouseEvent) {
	const target = e.target as HTMLElement;
	const collectionClick = target.closest('.star2');
	if (!collectionClick) return;
	const movieId = collectionClick.getAttribute('data-id');

	const selectedIndex = moviesArr.value.findIndex((movie) => movie.movieId === Number(movieId));

	if (!moviesArr.value[selectedIndex].is_collected) {
		// const res = await addCollection(userStore.userId, Number(movieId));
		const res = await addCollection(userStore.userId, Number(movieId));
		if (res) {
			moviesArr.value[selectedIndex].is_collected = true;
			ElMessage({
				message: '电影收藏成功',
				type: 'success'
			});
		} else {
			ElMessage({
				message: '电影收藏超时',
				type: 'error'
			});
		}
	} else {
		const res = await deleteCollection(userStore.userId, Number(movieId));
		if (res) {
			moviesArr.value[selectedIndex].is_collected = false;
			ElMessage({
				message: '取消电影收藏',
				type: 'success'
			});
		} else {
			ElMessage({
				message: '取消收藏失败',
				type: 'error'
			});
		}
	}
}
</script>
<template>
	<div class="background">
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
							<div class="top-right" :data-id="item.movieId" @click="handleCollection">
								<div>
									<el-icon :size="30" :color="item.is_collected ? 'gold' : '#999999'" class="star2" :data-id="item.movieId">
										<StarFilled />
									</el-icon>
								</div>
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
		</div>
	</div>
</template>
<style scoped lang="scss">
.gery {
	color: #999999;
}

.background {
	width: calc(100vw - 220px);
	min-width: 1000px;
	height: calc(100vh - 20px);
	margin: 0 10px;
	overflow: auto;

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
	}
}
</style>
