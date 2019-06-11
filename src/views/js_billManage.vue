<template>
	<div class="clear_batch">
		<searchInputItems>
			<searchInputItem name="账单号">
				<inputItem :value.sync='searchForm.billNo'></inputItem>
			</searchInputItem>
			<searchInputItem name="类型名称">
				<inputItem :value.sync='searchForm.billTypeName'></inputItem>
			</searchInputItem>
			<searchInputItem name="订单号">
				<inputItem :value.sync='searchForm.orderNo'></inputItem>
			</searchInputItem>
			<searchInputItem name="客户名称">
				<inputItem :value.sync='searchForm.customerName'></inputItem>
			</searchInputItem>
			<searchInputItem name="收支类型">
				<selectItem :selectValue.sync='searchForm.inoutType'>
					<el-option v-for="item in inoutTypeOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="结算方式">
				<selectItem :selectValue.sync='searchForm.settleType'>
					<el-option v-for="item in settleTypeOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="账单状态">
				<selectItem :selectValue.sync='searchForm.billStatus'>
					<el-option v-for="item in billStatusOptions" :key="item.value" :label="item.label" :value="item.value">
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
					<iconBtn iconClass="el-icon-check" content="审核" @click="checkAndcancellation('check')">审核</iconBtn>
					<iconBtn iconClass="el-icon-close" content="作废" @click="checkAndcancellation('close')">作废</iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出所选行的Excel" @click="exportSelectExcel">导出所选行的Excel</iconBtn>
					<iconBtn iconClass="el-icon-download" content="查询并导出满足条件的所有Excel" @click="exportSearchExcel">查询并导出满足条件的所有Excel</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :currentPage="pageNum" :pageSize="pageSize" :pageTotal="pageTotal" :loading='dataLoading'>
			<el-table-column type="expand">
				<template slot-scope="props">
					<div style="width: 80%;">
						<elemTable :tableBorder="tableBorder" :dataList='[props.row]' :isShowPage="isShowPage">
							<el-table-column show-overflow-tooltip min-width="140" prop="inName" label="收款账户"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="outName" label="付款账户"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="accountNo" label="对方银行账号"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="accountName" label="对方银行账户名"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="bankCode" label="对方银行行号"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="bankName" label="对方银行行名"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="summary" label="付款详情说明"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="customertNo" label="客户号"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="clearUnitId" label="清算单元"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="orderFrom" label="订单来源"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="settleNo" label="结算单号"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="channelRecCode" label="渠道返回码"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="channelRecMsg" label="渠道返回消息"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="auditorName" label="审核人名称"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="auditDate" label="审核时间"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="lastPayTime" label="上次支付时间"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="payTime" label="支付成功时间"></el-table-column>
							<el-table-column show-overflow-tooltip min-width="140" prop="updateDate" label="修改日期"></el-table-column>
						</elemTable>
					</div>
				</template>
			</el-table-column>
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="billNo" show-overflow-tooltip min-width="100" label="账单号"></el-table-column>
			<el-table-column prop="billTypeName" show-overflow-tooltip min-width="100" label="账单类型名称"></el-table-column>
			<el-table-column prop="orderNo" show-overflow-tooltip min-width="150" label="外部订单号"></el-table-column>
			<el-table-column prop="inoutType" show-overflow-tooltip min-width="120" label="收支类型">
				<template scope="scope">
					<el-tag type="info" v-if="scope.row.inoutType==='收款'">收&nbsp;&nbsp;&nbsp;款</el-tag>
					<el-tag type="primary" v-if="scope.row.inoutType==='支付'">支&nbsp;&nbsp;&nbsp;付</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="settleType" show-overflow-tooltip min-width="120" label="结算方式">
				<template scope="scope">
					<el-tag type="" v-if="scope.row.settleType==='实时收款'">实时收款</el-tag>
					<el-tag type="df" v-else-if="scope.row.settleType==='实时付款'">实时付款</el-tag>
					<el-tag type="qf" v-else-if="scope.row.settleType==='清分'">清&nbsp;&nbsp;&nbsp;分</el-tag>
					<el-tag type="pos" v-else-if="scope.row.settleType==='线下结算'">线下结算</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="perOrEnt" show-overflow-tooltip min-width="120" label="对公对私">
				<template scope="scope">
					<el-tag type="info" v-if="scope.row.perOrEnt==0">对私</el-tag>
					<el-tag type="" v-else-if="scope.row.perOrEnt==1">对公</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="amount" show-overflow-tooltip min-width="120" label="金额(元)"></el-table-column>
			<el-table-column prop="customerName" show-overflow-tooltip min-width="120" label="客户名称"></el-table-column>
			<el-table-column prop="billStatus" show-overflow-tooltip min-width="150" label="账单状态">
				<template scope="scope">
					<el-tag type="success" v-if="scope.row.billStatus==='成功'">成功</el-tag>
					<el-tag type="" v-else-if="scope.row.billStatus==='处理中'">处理中</el-tag>
					<el-tag type="warning" v-else-if="scope.row.billStatus==='失败'">失败</el-tag>
					<el-tag type="jsz" v-else-if="scope.row.billStatus==='待审核'">待审核</el-tag>
					<el-tag type="info" v-else-if="scope.row.billStatus==='待支付'">待支付</el-tag>
					<el-tag type="pos" v-else-if="scope.row.billStatus==='待清分'">待清分</el-tag>
					<el-tag type="danger" v-else-if="scope.row.billStatus==='作废'">作废</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createDate" show-overflow-tooltip min-width="150" label="创建日期"></el-table-column>
			<el-table-column show-overflow-tooltip min-width="130" label="操作" fixed="right">
				<template slot-scope="scope">
					<el-button-group>
						<iconBtn iconClass="el-icon-close" content="作废" @click="handleBtn(scope.$index, scope.row,'close')" v-if='isShowBtn("closeBtn",scope.row)'></iconBtn>
						<iconBtn iconClass="el-icon-check" content="审核" @click="handleBtn(scope.$index, scope.row,'check')" v-if='isShowBtn("checkBtn",scope.row)'></iconBtn>
					</el-button-group>
				</template>
			</el-table-column>
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
				inoutTypeOptions: [
					{ label: "收款", value: 0 },
					{ label: "支付", value: 1 },
				],
				settleTypeOptions: [
					{ label: "实时收款", value: 1 },
					{ label: "实时付款", value: 2 },
					{ label: "清分", value: 3 },
					{ label: "线下结算", value: 9 },
				],
				billStatusOptions: [
					{ label: "成功", value: 0 },
					{ label: "处理中", value: 1 },
					{ label: "失败", value: 2 },
					{ label: "待审核", value: 3 },
					{ label: "待支付", value: 4 },
					{ label: "待清分", value: 5 },
					{ label: "作废", value: 9 },
				],
				searchForm: {
					billNo: '',
					customerName: '',
					orderNo: '',
					billTypeName: '',
					inoutType: '',
					settleType: '',
					billStatus: '',
					dateValue: [],
				},
				fields: ['billNo', 'billTypeName', 'inoutType', 'settleType', 'perOrEnt', 'amount', 'customerName', 'billStatus', 'channelRecCode',
					'channelRecMsg', 'createDate', 'inName', 'outName', 'accountNo', 'accountName', 'bankCode', 'bankName', 'summary', 'customertNo', 'clearUnitId',
					'orderNo', 'orderFrom', 'settleNo', 'auditorName', 'auditDate', 'payTime', 'lastPayTime', 'updateDate'
				],
				filedsName: ['账单号', '账单类型名称', '收支类型', '结算类型', '对公对私', '金额', '客户名称', '账单状态', '渠道返回码', '渠道返回消息',
					'创建时间', '收款账户', '付款账户', '对方银行账号', '对方银行账户名', '对方银行行号', '对方银行行名', '付款详情说明', '客户号', '清算单元',
					'外部订单号', '订单来源', '结算单号', '审核人名称', '审核时间', '支付成功时间', '上次支付时间', '修改日期'
				],
				fileName: '账单管理',
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
			handleDataList(d) {
				this.dataList = this.computeFloat(d)
				return d.aaData
			},
			computeFloat(d) {
				for(let a = 0; a < d.aaData.length; a++) {
					if(d.aaData[a].amount != undefined) {
						d.aaData[a].amount = (d.aaData[a].amount / 100).toFixed(2);
					}
					d.aaData[a].inoutType = this._filterData(d.aaData[a].inoutType, this.inoutTypeOptions)
					d.aaData[a].settleType = this._filterData(d.aaData[a].settleType, this.settleTypeOptions)
					d.aaData[a].billStatus = this._filterData(d.aaData[a].billStatus, this.billStatusOptions)
				}
				return d.aaData
			},
			searchTable() {
				this._ajax({
						url: this.settleAPI,
						name: 'billInfo/list',
						loading: 'dataLoading',
						param: {
							billNo: this.searchForm.billNo,
							billTypeName: this.searchForm.billTypeName,
							customerName: this.searchForm.customerName,
							orderNo: this.searchForm.orderNo,
							inoutType: this.searchForm.inoutType,
							settleType: this.searchForm.settleType,
							billStatus: this.searchForm.billStatus,
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
			//作废和审核
			handleBtn(index, row, name) {
				var confirmName = '',
					urlName = '';
				if(name == 'close') {
					confirmName = '作废'
					urlName = 'billInfo/invalid'
				} else if(name == 'check') {
					confirmName = '审核'
					urlName = 'billInfo/check'
				}
				this.confirm(confirmName + '操作不可逆，是否继续', () => {
					this.cancellationAjax([row.billNo], confirmName, urlName)
				})
			},
			//多个作废和审核
			checkAndcancellation(name) {
				var confirmName = '',
					urlName = '';
				if(name == 'close') {
					confirmName = '作废'
					urlName = 'billInfo/invalid'
				} else if(name == 'check') {
					confirmName = '审核'
					urlName = 'billInfo/check'
				}
				if(this.rowSelection.length > 0) {
					var flg = true;
					for(let a = 0; a < this.rowSelection.length; a++) {
						if(name == 'close' && (this.rowSelection[a].billStatus == '作废' || this.rowSelection[a].billStatus == '成功' || this.rowSelection[a].billStatus == '失败')) {
							flg = false
							break
						} else if(name == 'check' && (this.rowSelection[a].billStatus != '待审核')) {
							flg = false
							break
						}
					}
					if(flg) {
						this.confirm(confirmName + '操作不可逆，是否继续', () => {
							var arr = [];
							this.rowSelection.forEach(function(el) {
								arr.push(el.billNo);
							})
							this.cancellationAjax(arr, confirmName, urlName)
						})
					} else {
						this.$message({
							message: '不能' + confirmName + '已完成的记录，请重新选择！',
							type: 'warning'
						});
					}
				} else {
					this.$message('请选择行');
				}

			},
			cancellationAjax(arr, name, urlName) {
				this._ajax({
					url: this.settleAPI,
					name: urlName,
					loading: 'dataLoading',
					arr: true,
					param: {
						billNo: arr,
					}
				}).then(d => {
					if(d.state === 0) {
						this.$message({
							message: '操作成功',
							type: 'success'
						});
						this.searchTable()
					}
				})
			},
			//是否显示按钮
			isShowBtn(name, row) {
				if(name == 'checkBtn') {
					if(row.billStatus == "待审核") {
						return true
					}
				}
				if(name == 'closeBtn') {
					if(row.billStatus != "成功" && row.billStatus != "失败" && row.billStatus != "作废") {
						return true
					}
				}
			},
			reset() {
				this.pageNum = 1;
				this.pageSize = 10;
				Object.assign(this.searchForm, {
					billNo: '',
					customerName: '',
					orderNo: '',
					billTypeName: '',
					inoutType: '',
					settleType: '',
					billStatus: '',
					dateValue: [],
				})
				this.searchTable();
			},
			exportSearchExcel() {
				this.searchTable();
				this._ajax({
					url: this.settleAPI,
					name: 'billInfo/list',
					loading: 'dataLoading',
					param: {
						billNo: this.searchForm.billNo,
						billTypeName: this.searchForm.billTypeName,
						customerName: this.searchForm.customerName,
						orderNo: this.searchForm.orderNo,
						inoutType: this.searchForm.inoutType,
						settleType: this.searchForm.settleType,
						billStatus: this.searchForm.billStatus,
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