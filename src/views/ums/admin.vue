<template>
    <div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
        </el-table>
    </div>
</template>


<script lang='ts' setup>
import { ref, toRefs, reactive } from 'vue'

const state = reactive({
    tableData: [],
})

const { tableData } =  toRefs(state)



</script>


<style lang='less' scoped>

</style>
