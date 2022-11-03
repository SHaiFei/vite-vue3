<template>
    <div class="login">
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" class="demo-ruleForm">
            <el-form-item prop="userName">
                <el-input v-model="ruleForm.userName" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="pwd">
                <el-input v-model="ruleForm.pwd" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script lang='ts' setup>
import { ref, toRefs, reactive } from 'vue'
import { adminLoginApi } from '../../request/api'
import Cookie from 'js-cookie'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// 获取路由
const router = useRouter()
// 获取vuex对象
const store = useStore()
const state = reactive({
    ruleForm: {
        userName: 'admin',
        pwd: '123456'
    }
})

// 解构赋值，平常的解构不会响应式
const { ruleForm } = toRefs(state)

// 表单验证
const validatePass = (rule: unknown, value: string | undefined, cb: (msg?: string) => void) => {
    if (!value) {
        cb("密码不能为空")
    } else {
        cb()
    }

}

// 校验规则
const rules = reactive({
    userName: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
    ],
    pwd: [{ validator: validatePass, trigger: 'blur' }],
})
// 绑定表单对象
let ruleFormRef = ref()

// 提交方法
const submitForm = () => {
    ruleFormRef.value.validate().then(() => {
        adminLoginApi({
            password: ruleForm.value.pwd,
            username: ruleForm.value.userName
        }).then(res => {
            if (res.code === 200) {
                Cookie.set('token', res.data.tokenHead + res.data.token, { expires: 7 })
                store.dispatch('getAdminInfo').then(res => {
                    console.log(res);
                    router.push('/homepage')
                })
                // getAdminInfo().then(res => {
                //     if (res.code === 200) {
                //         // 把菜单列表保存到vuex
                //         store.commit('updateMenus', res.data.menus)
                //         // 登录成功后跳转到首页
                //         router.push('/homepage')
                //     }
                // })
            }
        })
    }).catch(() => {
        console.log('不通过');
    })
}

</script>


<style lang='less' scoped>
// .login {
//     width: 300px;
//     display: flex;
//     word-wrap: break-word;
//     word-break: break-all;
//     text-overflow: ellipsis;
//     overflow: hidden;
// }

// span {
//     word-wrap: break-word;
//     display: inline-block;
// }
</style>
