<template>
	<div class="clear_batch">
		<searchInputItems>
			<searchInputItem name="渠道订单号">
				<inputItem :value.sync='searchForm.channelOrderNo'></inputItem>
			</searchInputItem>
			<searchInputItem name="客户名称">
				<inputItem :value.sync='searchForm.customerName'></inputItem>
			</searchInputItem>
			<searchInputItem name="交易类型">
				<selectItem :selectValue.sync='searchForm.tradeType'>
					<el-option v-for="item in tradeTypeOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="状态">
				<selectItem :selectValue.sync='searchForm.status'>
					<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="日期范围">
				<dateEditorDaterange :dateValue.sync='searchForm.dateValue'>
				</dateeditordaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出所选行的Excel" @click="exportSelectExcel">导出所选行的Excel</iconBtn>
					<iconBtn iconClass="el-icon-download" content="查询并导出满足条件的所有Excel" @click="exportSearchExcel">查询并导出满足条件的所有Excel</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :currentPage="pageNum" :pageSize="pageSize" :pageTotal="pageTotal" :loading='dataLoading'>
			<el-table-column type="expand">
				<template slot-scope="props">
					<elemTable :tableBorder="tableBorder" :dataList='[props.row]' :isShowPage="isShowPage">
						<el-table-column show-overflow-tooltip min-width="140" prop="innerOrderNo" label="内部订单号"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="bankRecTradeNo" label="银行返回流水号"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="accountCheckNo" label="对账流水号"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="channelMerchantNo" label="渠道商户号"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="channelRecCode" label="渠道返回码"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="channelRecMsg" label="渠道返回消息"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="payTime" label="支付成功时间"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="origChannelOrderNo" label="关联渠道订单号"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="tradeTime" label="交易时间"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="updateDate" label="修改时间"></el-table-column>
					</elemTable>
				</template>
			</el-table-column>
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="channelOrderNo" show-overflow-tooltip min-width="100" label="渠道订单号"></el-table-column>
			<el-table-column prop="channelCode" show-overflow-tooltip min-width="100" label="渠道号"></el-table-column>
			<el-table-column prop="customertNo" show-overflow-tooltip min-width="150" label="客户号"></el-table-column>
			<el-table-column prop="customerName" show-overflow-tooltip min-width="120" label="客户名称"></el-table-column>
			<el-table-column prop="tradeType" show-overflow-tooltip min-width="150" label="交易类型">
				<template scope="scope">
					<el-tag type="dk" v-if="scope.row.tradeType==='代扣'">代&nbsp;&nbsp;&nbsp;扣</el-tag>
					<el-tag type="df" v-else-if="scope.row.tradeType==='代付'">代&nbsp;&nbsp;&nbsp;付</el-tag>
					<el-tag type="pos" v-else-if="scope.row.tradeType==='POS支付'">POS&nbsp;支&nbsp;付</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="status" show-overflow-tooltip min-width="120" label="状态">
				<template scope="scope">
					<el-tag type="success" v-if="scope.row.status==='成功'">成&nbsp;&nbsp;&nbsp;功</el-tag>
					<el-tag type="" v-else-if="scope.row.status==='结算中'">结&nbsp;算&nbsp;中</el-tag>
					<el-tag type="warning" v-else-if="scope.row.status==='失败'">失&nbsp;&nbsp;&nbsp;败</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="amount" show-overflow-tooltip min-width="150" label="金额(元)"></el-table-column>
			<el-table-column prop="createDate" show-overflow-tooltip min-width="150" label="创建时间"></el-table-column>
		</elemTable>
	</div>
</template>

<script>
	import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
	export default {
		mixins: [mixin],
		data() {
			return {
				dataList: [],
				tradeTypeOptions: [
					{ label: "代扣", value: 1 },
					{ label: "代付", value: 2 },
					{ label: "POS支付", value: 3 },
				],
				statusOptions: [
					{ label: "成功", value: 0 },
					{ label: "处理中", value: 1 },
					{ label: "失败", value: 2 },
				],
				searchForm: {
					channelOrderNo: '',
					customerName: '',
					tradeType: '',
					status: '',
					dateValue: [],
				},
				fields: ['channelOrderNo', 'channelCode', 'customertNo', 'customerName', 'tradeType', 'status', 'amount', 'createDate',
					'innerOrderNo', 'bankRecTradeNo', 'accountCheckNo', 'channelMerchantNo', 'channelRecCode', 'channelRecMsg', 'payTime', 'origChannelOrderNo', 'tradeTime', 'updateDate'
				],
				filedsName: ['渠道订单号', '渠道号', '客户号', '客户名称', '交易类型', '状态', '金额', '创建时间',
					'内部订单号', '银行返回流水号', '对账流水号', '渠道商户号', '渠道返回码', '渠道返回消息', '支付成功时间', '关联渠道订单号', '交易时间', '修改时间'
				],
				fileName: '渠道流水',
				placeHolderCcmc: '场次名称',
				isShowPage: false,
				tableBorder: true,
			}
		},
		computed: {

		},
		mounted() {
			this.searchTable();
		},
		methods: {
			filterData(val, options) {
				for(let a = 0; a < options.length; a++) {
					if(val == options[a].value) {
						return options[a].label
						break
					}
				}
			},
			handleDataList(d) {
				this.dataList = this.computeFloat(d)
				return d.aaData
			},
			computeFloat(d) {
				for(let a = 0; a < d.aaData.length; a++) {
					if(d.aaData[a].amount != undefined) {
						d.aaData[a].amount = (d.aaData[a].amount / 100).toFixed(2);
					}
					d.aaData[a].tradeType = this._filterData(d.aaData[a].tradeType, this.tradeTypeOptions)
					d.aaData[a].status = this._filterData(d.aaData[a].status, this.statusOptions)
				}
				return d.aaData
			},
			searchTable() {
				this._ajax({
						url: this.settleAPI,
						name: 'channelTradeList/list',
						loading: 'dataLoading',
						param: {
							channelOrderNo: this.searchForm.channelOrderNo,
							customerName: this.searchForm.customerName,
							tradeType: this.searchForm.tradeType,
							status: this.searchForm.status,
							startTime: this.searchForm.dateValue[0] ? this.searchForm.dateValue[0] : '',
							endTime: this.searchForm.dateValue[1] ? this.searchForm.dateValue[1] : '',
							pageNum: this.pageNum,
							pageSize: this.pageSize,
							orderField: 'f_create_date',
						}
					})
					//.then(这里是函数字符串，不执行函数，所以不加())
					.then(this.renderTable)
			},
			reset() {
				this.pageNum = 1;
				this.pageSize = 10;
				Object.assign(this.searchForm, {
					channelOrderNo: '',
					customerName: '',
					tradeType: '',
					status: '',
					dateValue: [],
				})
				this.searchTable();
			},
			exportSearchExcel() {
				this.searchTable();
				this._ajax({
					url: this.settleAPI,
					name: 'channelTradeList/list',
					loading: 'dataLoading',
					param: {
						channelOrderNo: this.searchForm.channelOrderNo,
						customerName: this.searchForm.customerName,
						tradeType: this.searchForm.tradeType,
						status: this.searchForm.status,
						startTime: this.searchForm.dateValue[0] ? this.searchForm.dateValue[0] : '',
						endTime: this.searchForm.dateValue[1] ? this.searchForm.dateValue[1] : '',
						orderField: 'f_create_date',
					}
				}).then(d => {
					if(d.aaData.length > 0) {
						this._csvExport(this.computeFloat(d), this.fields, this.filedsName, this.fileName)
					} else {
						this.$message({ type: 'info', message: '无导出数据' });
					}
				})
			},
			exportSelectExcel() {
				this.$exportExcelBySelect(this.fields, this.filedsName, this.fileName)
			}
		},
	}
</script>
<style scoped>

</style>
<style lang="sass">
	/*scoped表示  CSS 只作用于当前组件中的元素*/
	/*lang="sass"表示  可以使用sass写法*/
</style>