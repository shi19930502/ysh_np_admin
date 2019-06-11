<template>
    <el-dialog custom-class="jz-modal" :title="title" :visible="modal" ref="dialog" :before-close="beforeClose"
               :close-on-click-modal="false" :width="modalWidth">
        <searchInputItem name="商户名称">
            <inputItem :value.sync="form.name" @enter="searchTable" ref="nameInput" @keyUp="searchTable"></inputItem>
        </searchInputItem>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                   :loading="modalDataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"
                   @selectionChange="selectionChange" :maxHeight="modalMaxTableHeight" :highlightCurrentRow="true"
                   @selectChange="selectChange">
            <el-table-column prop="name" label="商户名称">
                <template slot-scope="scope">
                    <div>{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="tel" label="联系电话">
                <template slot-scope="scope">
                    <div>{{scope.row.tel}}</div>
                </template>
            </el-table-column>
        </elemTable>
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel" text="取消">取消</elBtn>
            <elBtn @click="submit" text="提交" type="primary">确认选择</elBtn>
        </div>
    </el-dialog>
</template>
<script>
    import mixin from '../../../mixin/mixin.js'

    export default {
        mixins: [mixin],
        data() {
            return {
                dataList: [],
                form: {
                    name: '',
                    enabled: 1
                },
                currentRow: null,
                modalWidth: '70%'
            }
        },
        props: {
            modal: {
                default: false
            },
            title: {
                default: '选择商户'
            },
            params: {
                default: function () {
                    return {}
                }
            }
        },
        mounted() {
            this.searchTable()
        },
        methods: {
            searchTable() {
                Object.assign(this.form, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    customerType: 'merchant',
                });

                this._ajax({
                    url: this.rootAPI,
                    name: 'customer/queryPageByChannelCode',
                    param: this.form,
                    loading: 'modalDataLoading'
                })
                    .then(this.renderTable)
                    .then((function (d) {
                        this.$refs.nameInput.$children[0].focus()
                    }).bind(this));
            },
            cancel() {
                this.$emit('close')
            },
            beforeClose(done) {
                this.cancel();
                done()
            },
            selectChange(val) {
                this.currentRow = val
            },
            submit() {
                this.$emit('submit', this.currentRow)
            }
        }
    }
</script>