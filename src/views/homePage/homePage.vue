<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div>电商运营平台</div>
            </el-header>
            <el-container>
                <el-aside width="240px">
                    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                        default-active="2" text-color="#fff" :unique-opened="true" :router="true">
                        <el-sub-menu :index="menus.id + ''" v-for="menus in newMenus" :key="menus.id">
                            <template #title>
                                <span>{{ menus.title }}</span>
                            </template>
                            <template v-for="subMenu in menus.children" :key="subMenu.id">
                                <el-menu-item :index="'/' + menus.name + '/' + subMenu.name" v-if="subMenu.hidden">
                                    {{ subMenu.title }}
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
    <!-- <div class="homepage_container">
        <div class="homepage_header">
            头部
        </div>
        <div class="homepage_menu">
            菜单
        </div>
        <div class="homepage_content">
            右侧内容
        </div>
    </div> -->
</template>


<script lang='ts' setup>
import { ref, toRefs, reactive, computed } from 'vue'
import { useStore } from 'vuex';
// export default {
//     setup() {
        interface MenuObj {
            parentId: number
            id: number
            title: string
            hidden: 0 | 1
            name: string
            children?: MenuObj[]
        }

        interface NewMenus {
            [key: number]: MenuObj
        };
        const store = useStore();
        const newMenus = computed<NewMenus>(() => store.getters.getNewMenus)
//     }

// }


</script>


<style lang='less' scoped>
.el-aside {
    background-color: rgb(84, 92, 100)
}

.homepage_container {
    height: 100%;
    width: 100%;
}

.common-layout,
.el-container {
    width: 100%;
    height: 100%;
}

.el-header {
    height: 70px;
    background-color: #5293de;
    font-size: 25px;
    width: 100%;
    line-height: 70px;
    color: #fff;
}
</style>
