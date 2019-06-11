<template>
    <div><br/>
        <!-- 查询条件 -->
        <searchInputItems>
            <searchInputItem name='车牌号'>
                <inputItem :value.sync="searchForm.transporterId" @enter="searchTable" placeHolder="请输入车牌号"></inputItem>
            </searchInputItem>
            <searchInputItem name="渠道" v-if="!isChannel" >
                <cascaderItem  :options="channelSearchList" @change="channelChange" :value.sync="channelName"></cascaderItem>
            </searchInputItem>
            <searchInputItem name="商户名称">
                <selectInput :value.sync="searchForm.wholesalerId" @selectChange="searchTable">
                    <el-option v-for="item in dataDic.wholesalerList" :key="item.key" :label="item.value" :value="item.key">
                    </el-option>
                </selectInput>
            </searchInputItem>
            <searchInputItem name="商品名称">
                <el-autocomplete
                        v-model="searchForm.goodsName"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                ></el-autocomplete>

                <!-- <selectInput :value.sync="searchForm.goodsCode" @selectChange="searchTable" :clearable="true">
                    <el-option v-for="item in dataDic.goodsList" :key="item.key" :label="item.value" :value="item.key">
                    </el-option>
                </selectInput> -->
            </searchInputItem>
            <searchInputItem name="进场时间区间">
                <dateEditorDaterange :dateValue.sync='inDate'>
                </dateeditordaterange>
            </searchInputItem>
        </searchInputItems>
        <!-- 操作按钮 -->
        <optionItems>
            <template slot="left">
                <el-button-group>
                    <iconBtn iconClass="el-icon-plus" content="新增" @click="add" type="success" v-if="frontEndId===1">新增</iconBtn>
                    <!--<iconBtn iconClass="el-icon-check" content="补录" @click="record" type="success">补录</iconBtn>-->
                    <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
                    <iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
                </el-button-group>
            </template>
        </optionItems>

        <!-- 表格 -->
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal"
                   :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"
                   @selectionChange="selectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="inDate" label="进场时间">
                <template slot-scope="scope">
                    <span>{{scope.row.inDate}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="tranId" label="交易凭证号">
                <template slot-scope="scope">
                    <span>{{scope.row.tranId}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="animalQuarantineId" label="动物产品检疫合格证号">
                <template slot-scope="scope">
                    <span>{{scope.row.animalQuarantineId}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="meatInspectionId" label="肉类检疫合格证号">
                <template slot-scope="scope">
                    <span>{{scope.row.meatInspectionId}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="provId" label="产地证明号">
                <template slot-scope="scope">
                    <span>{{scope.row.provId}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="vegInspectionId" label="检测合格证号">
                <template slot-scope="scope">
                    <span>{{scope.row.vegInspectionId}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="transporterId" label="运输车牌号">
                <template slot-scope="scope">
                    <span>{{scope.row.transporterId}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="statusName" label="进场状态">
                <template slot-scope="scope">
                    <span>{{scope.row.statusName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button-group>
                        <iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
                        <!--<iconBtn iconClass="el-icon-edit" content="编辑" @click="edit(scope.row)" v-if="scope.row.sourceId === null"></iconBtn>-->
                        <!--<iconBtn iconClass="el-icon-plus" content="快速新建" @click="fastAdd(scope.row)"></iconBtn>-->
                        <iconBtn iconClass="el-icon-circle-check" content="确认" @click="checkInWeight(scope.row,1)" v-if="scope.row.statusId===0 && frontEndId===1"></iconBtn>
                        <iconBtn iconClass="el-icon-d-arrow-right" content="出场" @click="checkOutWeight(scope.row,2)" v-if="scope.row.statusId===1 && frontEndId===1"></iconBtn>
                        <iconBtn iconClass="el-icon-remove" content="作废" @click="changeStatus(scope.row,3)" v-if="scope.row.statusId===1"></iconBtn>
                    </el-button-group>
                </template>
            </el-table-column>
        </elemTable>
        <inMarketDetailModal :modal="modalShow" :inMarketDetailModalType='modalType' :extendModalType='extendType' v-if="modalShow" @submit="modalSubmit"
                             @close='detailModalClose' :tableRow='tableRow'></inMarketDetailModal>
    </div>
</template>
<script>
    import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
    import local from '../local.js'
    import configs from '../configs.js'
    import inMarketDetailModal from './component/modal/inMarketDetailModal.vue'

    export default {
        mixins: [mixin],
        components: {
            inMarketDetailModal
        },
        data() {
            return {
                frontEndId: configs.frontEndId,
                searchForm: {
                    wholesalerId: '',
                    goodsCode: '',
                    startTime: '',
                    endTime: '',
                    channelCode: '',
                    transporterId: '',
                    batchId: ''
                },
                dataDic: {
                    wholesalerList: [],
                    goodsList: []
                },
                inDate: [],
                dataList: [],
                inMarketDetailModal: false,
                tableRow: {},
                inMarketDetailModalType: 'add',
                extendType: "",
                channelCode: '',
                isChannel: '',
                channelList: [],
                loginName: '',
                channelName: [],
                channelSearchList: [],
            }
        },
        mounted() {
            this.getInitData().then(this.searchTable);
        },
        methods: {
            getInitData() {
                this._ajax({
                    url: this.rootAPI,
                    name: 'channel/listByParent',
                    param: {
                        parentChannelCode: ''
                    }
                })
                    .then((function (d) {
                        this.channelSearchList = d.aaData
                    }).bind(this))
                //查询进场表自己渠道下所有商户名名称和商户编码
                this._ajax({
                    url: this.rootAPI + 'inmarketmain/wholesalerList',
                    param: {},
                    arr: true
                })
                    .then((function(d) {
                        Object.assign(this.dataDic, {
                            wholesalerList: d.aaData
                        });
                    }).bind(this))
                //查询进场表附表中自己渠道下所有商品名称和商品编码
                this._ajax({
                    url: this.rootAPI + 'inmarketdetail/goodsList',
                    param: {},
                    arr: true
                })
                    .then((function (d) {
                        let data = d.aaData;
                        Object.assign(this.dataDic, {
                            goodsList: data
                        });
                    }).bind(this))

                return this._ajax({
                    name: 'channel/list',
                    param: {
                        level: 1
                    }
                })
                    .then((function (d) {
                        Object.assign(this.channelList, d.aaData)
                    }).bind(this))

            },
            channelChange(val) {
                if (val.length > 0) {
                    Object.assign(this.searchForm, {
                        channelCode: val[val.length - 1]
                    })
                } else {
                    Object.assign(this.searchForm, {
                        channelCode: ''
                    })
                }
                // this.searchTable()
            },
            renderDic(dic, dicKey) {
                let dicShow = '';
                $.each(dic, function (i, obj) {
                    if (obj.key == dicKey) {
                        dicShow = obj.value;
                    }
                });
                return dicShow;
            },
            searchTable() {
                let user = local.get('sessionUser');
                this.loginName = user.loginName
                this.channelCode = user.typeCode
                let typeId = user.typeId;
                if(this.loginName == 'admin'|| typeId == '0' || this.channelCode == '' || this.channelCode == '0' || this.channelCode.length == 0) {
                    //超级管理员
                    this.isChannel = false;
                } else {
                    this.searchForm.channelCode = this.channelCode;
                    this.isChannel = true;
                }
                var param = Object.assign({}, this.searchForm, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    startTime: this.inDate ? this.inDate[0] : '',
                    endTime: this.inDate ? this.inDate[1] : ''
                })
                return this._ajax({
                    url: this.rootAPI,
                    name: 'inmarketmain/baseList',
                    param: param,
                    loading: 'dataLoading'
                }).then(this.renderTable)
            },
            reset() {
                this.inDate = [];
                Object.assign(this.searchForm, {
                    wholesalerId: '',
                    goodsCode: '',
                    goodsName: '',
                    startTime: '',
                    endTime: '',
                    channelCode: '',
                    transporterId: '',
                    batchId: ''
                })
                this.handleCurrentChange(1)
                this.channelName = []
            },
            dele() {
                if (this.delSelection.length === 0) {
                    this.$message({
                        type: 'info',
                        message: '请选择行'
                    });
                } else {
                    let selection = this.delSelection
                    this.confirm('确定删除？', (function () {
                        var arr = [],
                            o = {}
                        selection.forEach(function (el) {
                            arr.push(el.id)
                        })
                        o.id = arr
                        o.deleted = 1
                        this._ajax({
                            url: this.rootAPI + 'inmarketmain/delete',
                            param: o,
                            arr: true
                        })
                            .then((function (d) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功'
                                });
                                this.handleCurrentChange(1)
                            }).bind(this))
                    }).bind(this))
                }
            },
            inMarketDetailModalClose() {
                this.inMarketDetailModal = false;
            },
            lookOver(row) {
                this.tableRow = row;
                this.modalCheck();
            },
            edit(row) {
                if (null != row.sourceId) {
                    this.$message({type: 'warning', message: '不可编辑,该数据为同步数据'});
                    return;
                }
                this.tableRow = row;
                this.modalEdit();
                this.extendType = "";
            },
            record(row) {
                this.tableRow = null;
                this.modalAdd();
                this.extendType = "record";
            },
            fastAdd(row) {
                this.tableRow = row;
                this.modalEdit();
                this.extendType = "fastAdd";
            },
            add(row) {
                this.tableRow = null;
                this.modalAdd();
                this.extendType = "";
            },
            detailModalClose() {
                this.searchTable();
                this.modalClose();
            },
            changeStatus(o,statusId) {
                o.statusId = statusId;
                this.confirm(
                    "确定作废？",
                    function() {
                        this._ajax({
                            url: this.rootAPI + "inmarketdetail/updateStatusByMainId",
                            param: o,
                            arr: true
                        }).then(
                            function(d) {
                                if (d.state == 0) {
                                    this.$message({ type: "success", message: "作废成功" });
                                } else if(d.state == 2){
                                    this.$message({ type: "warning", message: d.msg });
                                }
                                else if(d.state == 999){
                                    this.$message({ type: "warning", message: d.msg });
                                }
                                this.searchTable();
                            }.bind(this)
                        );
                    }.bind(this)
                );
                this.searchTable();
            },
            checkInWeight(o) {
                let oldStatus = o.statusId;
                o.statusId = 1;
                this.$prompt('确认进场，请输入进场重量', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{1,6}(\.\d{1,2})?$/,
                    inputErrorMessage: '进场重量必填，且必须是0-1000000'
                }).then(({ value }) => {
                    o.inWeight = value;
                    this._ajax({
                        url: this.rootAPI + "inmarketdetail/updateStatusByMainId",
                        param: o,
                        arr: true
                    }).then(
                        function(d) {
                            if (d.state == 0) {
                                this.$message({ type: "success", message: "确认进场成功" });
                            } else if(d.state == 2){
                                this.$message({ type: "warning", message: d.msg });
                            }
                            this.searchTable();
                        }.bind(this)
                    );

                }).catch(() => {
                    o.statusId = oldStatus;
                    this.$message({
                        type: 'info',
                        message: '取消进场'
                    });
                });
            },
            checkOutWeight(o) {
                let oldStatus = o.statusId;
                o.statusId = 2;
                this.$prompt('确认出场，请输入出场重量', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{1,6}(\.\d{1,2})?$/,
                    inputErrorMessage: '出场重量不符合规定（重量必须是0-1000000）'
                }).then(({ value }) => {
                    o.outWeight = value;
                    this._ajax({
                        url: this.rootAPI + "inmarketdetail/updateStatusByMainId",
                        param: o,
                        arr: true
                    }).then(
                        function(d) {
                            if (d.state == 0) {
                                this.$message({ type: "success", message: "出场成功" });
                            } else if(d.state == 2){
                                this.$message({ type: "warning", message: d.msg });
                            }
                            this.searchTable();
                        }.bind(this)
                    );
                }).catch(() => {
                    o.statusId = oldStatus;
                    this.$message({
                        type: 'info',
                        message: '取消出场'
                    });
                });
            },
            querySearchAsync(queryString, cb) {
                this._ajax({name: 'inmarketdetail/goodsListLikeByGoodsName', param: {
                        goodsName: queryString
                    }})
                    .then((function(d) {
                        if(d.aaData.length > 0) {
                            var data = d.aaData
                            cb(data)
                        }else {
                            cb([])
                        }
                    }).bind(this))
            },
            handleSelect(item) {
                Object.assign(this.searchForm, {
                    goodsCode: item.key
                })
                this.searchTable()
            },
        }
    }
</script>