<template>
	<div class="page-data-merchantStatistics">
		<searchInputItems>
			<searchInputItem name="渠道">
				<selectInput :value.sync="searchForm.channelCode" @selectChange="searchTable" :disabled="isChannel">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="订单创建时间">
				<dateEditorDaterange type="date" :showShortcuts="showShortcuts" :dateValue.sync="createdDate"></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel">导出Excel</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="index" width="150" label="序号"/>
			<el-table-column prop="buyerName" label="采购商名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.buyerName">
						<span>{{scope.row.buyerName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="orderCount" label="订单数量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderCount">
						<span>{{scope.row.orderCount}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="sortingOrderTotal" label="订单金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.sortingOrderTotal + '元'">
						<span v-if="scope.row.sortingOrderTotal != null">{{scope.row.sortingOrderTotal + '元'}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button-group>
						<iconBtn iconClass="el-icon-view" content="查看商品明细" @click="lookOver(scope.row)">查看商品明细</iconBtn>
					</el-button-group>
				</template>
			</el-table-column>
		</elemTable>
		<buyerStatisticsModal :modal="buyerStatisticsModal" v-if='buyerStatisticsModal' @close='buyerStatisticsModalClose' :tableRow='tableRow'></buyerStatisticsModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import configs from '../configs.js'
	import buyerStatisticsModal from './component/modal/buyerStatisticsModal.vue'
	export default {
		mixins: [mixin],
		components: {
			buyerStatisticsModal
		},
		data() {
			return {
				searchForm: {
					extendIndex: 1,
					createdDate: '',
					channelCode: ''
				},
				dateRange: [],
				pieLoading: false,
				dataDic: {
					productList: [],
					storeNameList: []
				},
				channelList: [],
				dataList: [],
				isChannel: '',
				showShortcuts: false,
				createdDate: '',
				buyerStatisticsModal: false
			}
		},
		mounted() {
			this._ajax({
					name: 'channel/list',
					param: {
						level: 1
					}
				})
				.then((function(d) {
					Object.assign(this.channelList, d.aaData)
				}).bind(this))
			this.searchTable();
		},
		methods: {
			searchTable() {
				let user = local.get('sessionUser');
				this.loginName = user.loginName
				this.channelCode = user.typeCode
				let typeId = user.typeId;
				if(this.loginName == 'admin' || typeId == '0' || this.channelCode == '' || this.channelCode == '0' || this.channelCode.length == 0) {
					//超级管理员
					this.isChannel = false;
				} else {
					//各渠道管理员
					this.searchForm.channelCode = this.channelCode;
					this.isChannel = true;
				}
				if(this.createdDate == '') {
					this.createdDate = this.getToday;
				}
				var param = Object.assign({}, this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					createdDate: this.createdDate
					//distributionTimeBegin:this.distributionTimeBegin.replace("-","-").replace("-","-"),
				})

				this._ajax({
					url: this.rootAPI,
					name: 'order/buyerOrMerchantStatistics',
					param: param,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			reset() {
				this.createdDate = ''
				this.searchForm.channelCode = ''
				this.searchTable();
			},
			buyerStatisticsModalClose() {
				this.buyerStatisticsModal = false;
			},
			lookOver(row) {
				this.tableRow = row;
				this.buyerStatisticsModal = true;
			},
			// 渲染图表
			exportExcel() {
				this.searchTable();
				if(this.dataList.length == 0) {
					this.$message({
						type: 'warning',
						message: '没有导出数据'
					});
					return;
				}
				let user = local.get('sessionUser');
				this.loginName = user.loginName
				this.channelCode = user.typeCode
				let typeId = user.typeId;
				if(this.loginName == 'admin' || typeId == '0' || this.channelCode == '' || this.channelCode == '0' || this.channelCode.length == 0) {
					//超级管理员
					this.isChannel = false;
				} else {
					//各渠道管理员
					this.searchForm.channelCode = this.channelCode;
					this.isChannel = true;
				}
				if(this.createdDate == '') {
					this.createdDate = this.getToday;
				}
				var vm = this;
				//window.open(configs.excelUrl + '?distributionTimeBegin=' + vm.distributionTimeBegin + '&extendIndex=' + vm.searchForm.extendIndex + '&channelCode=' + vm.searchForm.channelCode)
				window.location.href = configs.excelUrl + '?createdDate=' + vm.createdDate + '&extendIndex=' + vm.searchForm.extendIndex + '&channelCode=' + vm.searchForm.channelCode
			}
		}
	}
</script>

<style lang="sass">
	.page-khNolice {
		.toubu_B {
			height: 60px;
			border-bottom: 1px solid #D1D1D1;
			margin: 10px;
			.tliel_name {
				float: left;
				font-size: 25px;
			}
			.addanniu {
				float: right;
			}
		}
		.toubu_A {
			height: 80px;
			padding: 10px;
			.tliel_name {
				float: left
			}
			.addanniu {
				float: right;
			}
		}
	}
</style>