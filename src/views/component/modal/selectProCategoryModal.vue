<template>
    <el-dialog custom-class="jz-modal" :title="title" :visible="modal" ref="dialog" :before-close="beforeClose"
               :close-on-click-modal="false" :width="modalWidth">
        <searchInputItems>
            <searchInputItem name='商品关键字'>
                <inputItem :value.sync="searchForm.keyWord" @enter="searchTable" placeHolder="请输入商品关键字"></inputItem>
            </searchInputItem>
        </searchInputItems>
        <elemTable :dataList="dataList" ref="multipleTable" @current-change="selectChange" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleProSizeChange" @currentChange="handleProCurrentChange" @selectionChange="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="商品名称">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.name">
                        <span>{{scope.row.name}}</span>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="skuName" label="规格名称">
                <template slot-scope="scope">
                    <toolTip :content="scope.row.skuName">
                        <span>{{scope.row.skuName}}</span>
                    </toolTip>
                </template>
            </el-table-column>
            <el-table-column prop="skuPrice" label="售价（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.skuPrice}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="skuMeasure" label="计量单位">
                <template slot-scope="scope">
                    <toolTip :content="renderCommon(measuremethodList, scope.row.skuMeasure)">
                        <span>{{renderCommon(measuremethodList, scope.row.skuMeasure)}}</span>
                    </toolTip>
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
                dateRange:[],
                multipleSelectionAll: [],   // 所有选中的数据包含跨页数据
                multipleSelection: [],   // 当前页选中的数据
                idKey: 'skuId', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
                rowOBJ: {},
                activeName: '1',
                tabList:[],
                measuremethodList:[],
                dataList: [],
                currentRow: null,
                modalWidth: '70%',
                searchForm: {
                    keyWord : '',
                    published: 1
                },
            }
        },
        props: {
            modal: {
                default: false
            },
            title: {
                default: '选择商品'
            },
            params: {
                default: function () {
                    return {}
                }
            },
            customerId:{
                default: ''
            },
            parentDataList:{
                default: function () {
                    return []
                }
            }
        },
        mounted() {
            this._ajax({url: this.rootAPI, name: 'measuremethod/list', param: {}})
                .then((function(d) {
                    this.measuremethodList = d.aaData;
                }).bind(this));
            this._searchDic('PRODUCT_STATUS')
                .then((function(d) {
                    this.dicEnabled = this._dicKey(d);
                    let temp = this.tabList;
                    $.each(this.dicEnabled, function(i, obj) {
                        temp.push({'key' : this.key + '', 'value' : this.value});
                    });
                    this.tabList = temp;
                }).bind(this))
                .then(this.searchTable)
        },
        methods: {
            renderCommon(dataList, code) {
                let dataShow = '';
                $.each(dataList, function(i, obj) {
                    if(obj.code == code) {
                        dataShow = obj.name;
                    }
                });
                return dataShow;
            },
            searchTable() {
                let i = 0;
                let inventoryProductIds = "";
                for (i = 0; i < this.parentDataList.length; i++) {
                    inventoryProductIds += this.parentDataList[i].skuId+ ",";
                }
                inventoryProductIds = inventoryProductIds.substr(0, inventoryProductIds.length - 1);
                Object.assign(this.searchForm, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    customerId: this.customerId,
                    inventoryProductIds: inventoryProductIds
                });
                return this._ajax({
                    name: 'product/queryDtoList',
                    param: this.searchForm,
                    loading: 'dataLoading'
                }).then((d) => {
                        this.renderTable(d);
                        setTimeout(()=>{
                            this.setSelectRow();
                        }, 200)
                    }
                )
            },
            cancel() {
                this.$emit('close')
            },
            beforeClose(done) {
                this.cancel();
                done()
            },
            submit() {
                this.changePageCoreRecordData();
                if (this.multipleSelectionAll.length > 0) {
                    this.$emit('submit', this.multipleSelectionAll)
                } else {
                    this.$message({type: 'warning', message: '请选择商品'});
                }
            },
            handleProCurrentChange(val){
                // 改变页的时候调用一次
                this.changePageCoreRecordData();
                this.handleCurrentChange(val);
            }, handleProSizeChange(val){ // 改变每页显示条数的时候调用一次
                this.changePageCoreRecordData();
                this.handleSizeChange(val)
            },
            // 设置选中的方法
            setSelectRow() {
                if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
                    return;
                }
                // 标识当前行的唯一键的名称
                let idKey = this.idKey;
                let selectAllIds = [];
                this.multipleSelectionAll.forEach(row=>{
                    selectAllIds.push(row[idKey]);
                })
                this.$refs.multipleTable.$refs.multipleTable.clearSelection();
                var i = 0
                for(i = 0; i < this.dataList.length; i++) {
                    if (selectAllIds.indexOf(this.dataList[i][idKey]) >= 0) {
                        // 设置选中，记住table组件需要使用ref="table"
                        this.$refs.multipleTable.$refs.multipleTable.toggleRowSelection(this.dataList[i], true);
                    }
                }
            } ,
            // 记忆选择核心方法
            changePageCoreRecordData () {
                // 标识当前行的唯一键的名称
                let idKey = this.idKey;
                let that = this;
                // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
                if (this.multipleSelectionAll.length <= 0) {
                    this.multipleSelectionAll = this.multipleSelection;
                    return;
                }
                // 总选择里面的key集合
                let selectAllIds = [];
                this.multipleSelectionAll.forEach(row=>{
                    selectAllIds.push(row[idKey]);
                })
                let selectIds = []
                // 获取当前页选中的id
                this.multipleSelection.forEach(row=>{
                    selectIds.push(row[idKey]);
                    // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
                    if (selectAllIds.indexOf(row[idKey]) < 0) {
                        that.multipleSelectionAll.push(row);
                    }
                })
                let noSelectIds = [];
                // 得到当前页没有选中的id
                this.dataList.forEach(row=>{
                    if (selectIds.indexOf(row[idKey]) < 0) {
                        noSelectIds.push(row[idKey]);
                    }
                })
                noSelectIds.forEach(id=>{
                    if (selectAllIds.indexOf(id) >= 0) {
                        for(let i = 0; i< that.multipleSelectionAll.length; i ++) {
                            if (that.multipleSelectionAll[i][idKey] == id) {
                                // 如果总选择中有未被选中的，那么就删除这条
                                that.multipleSelectionAll.splice(i, 1);
                                break;
                            }
                        }
                    }
                })
            },
            handleSelectionChange (val) {
                // table组件选中事件,记得加上@selection-change="handleSelectionChange"
                this.multipleSelection = val;
            }
        }
    }
</script>