<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user';
import router from '@/router';
const { userId, username, avatarUrl, } = useUserStore()
const selected = ref(1)
function handleToSearch() {
    router.push('/user/search')
    selected.value = 1
}
function handleToCollection() {
    router.push('/user/collection')
    selected.value = 2

}
function handleToUserInfo() {
    router.push('/user/info')
    selected.value = 3
}
</script>
<template>
    <div class="root">
        <div class="left">
            <div class="bgc">
            </div>
            <div class="title">电影收藏管理系统</div>
            <div class="user">
                <div class="avatar"><img :src="avatarUrl"></div>
                <div class="name">{{ username }}</div>
                <div class="type">用户</div>
            </div>
            <div class="menu">
                <div :class="['search', selected === 1 ? 'selected' : '']" @click="handleToSearch">电影搜索</div>
                <div :class="['collection', selected === 2 ? 'selected' : '']" @click="handleToCollection">我的收藏</div>
                <div :class="['user-info', selected === 3 ? 'selected' : '']" @click="handleToUserInfo">用户中心</div>
            </div>
        </div>
        <div class="right">
            <router-view />
        </div>
    </div>
</template>
<style scoped lang="scss">
.root {
    width: 100vw;
    height: 100vh;
    display: flex;

    .left {
        width: 200px;
        min-width: 200px;
        height: 100%;
        background-color: #1a232a;
        position: relative;


        .bgc {
            background-color: #212b34;
            height: 110px;
            width: 100%;
            position: absolute;
        }

        .title {
            margin-top: 20px;
            width: 100%;
            text-align: center;
            font-size: 20px;
            font-weight: bolder;
            color: #fff;
            position: relative;
            z-index: 2;
        }

        .user {
            width: 100%;
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 2;

            .avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: #fff 3px solid;
                overflow: hidden;

                img {
                    width: 100%;
                }
            }

            .name {
                color: #fff;
                margin-top: 10px;
            }

            .type {
                color: #fff;
                font-size: x-small;
            }
        }

        .menu {
            margin-top: 40px;
            width: 100%;

            div {
                width: 100%;
                margin-top: 4px;
                padding: 14px 0;
                text-align: center;
                color: #fff;

                &:hover {
                    cursor: pointer;
                    background-color: #2a343c;
                }

                &:active {
                    background-color: #969696;
                }
            }

        }
    }
}

.selected {
    background-color: #2a343c;
}
</style>