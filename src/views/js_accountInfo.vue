<template>
	<div class="clear_batch">
		<searchInputItems>
			<searchInputItem name="客户名称">
				<inputItem :value.sync='searchForm.customerName'></inputItem>
			</searchInputItem>
			<searchInputItem name="收支类型">
				<selectItem :selectValue.sync='searchForm.inoutTye'>
					<el-option v-for="item in inoutTypeOptions" :key="item.value" :label="item.label" :value="item.value">
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
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="accountName" show-overflow-tooltip min-width="100" label="账户名称"></el-table-column>
			<el-table-column prop="customertNo" show-overflow-tooltip min-width="120" label="客户号"></el-table-column>
			<el-table-column prop="customerName" show-overflow-tooltip min-width="120" label="客户名称"></el-table-column>
			<el-table-column prop="clearUnitId" show-overflow-tooltip min-width="100" label="清算单元"></el-table-column>
			<el-table-column prop="balance" show-overflow-tooltip min-width="150" label="余额(元)"></el-table-column>
			<el-table-column prop="inoutTye" show-overflow-tooltip min-width="100" label="余额类型">
				<template scope="scope">
					<el-tag type="info" v-if="scope.row.inoutTye==='收款'">收&nbsp;&nbsp;&nbsp;款</el-tag>
					<el-tag type="primary"  v-else-if="scope.row.inoutTye==='支付'">支&nbsp;&nbsp;&nbsp;付</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="creditLine" show-overflow-tooltip min-width="130" label="授信额度(元)"></el-table-column>
			<el-table-column prop="freezeBalance" show-overflow-tooltip min-width="130" label="冻结金额(元)"></el-table-column>
			<el-table-column prop="createDate" show-overflow-tooltip min-width="140" label="创建日期"></el-table-column>
			<el-table-column prop="updateDate" show-overflow-tooltip min-width="140" label="修改日期"></el-table-column>
		</elemTable>
	</div>
</template>

<script>
	import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
	export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					customerName: '',
					inoutTye: '',
					dateValue: [],
				},
				placeHolderCcmc: '场次名称',
				dataList: [],
				inoutTypeOptions: [
					{ label: "收款", value: 0 },
					{ label: "支付", value: 1 }
				],
				fields: ['accountName', 'customertNo', 'customerName', 'clearUnitId', 'balance', 'inoutTye', 'creditLine', 'freezeBalance', 'createDate', 'updateDate'],
				filedsName: ['账户名称', '客户号', '客户名称', '清算单元', '余额', '余额类型', '授信额度', '冻结金额', '创建日期', '修改日期'],
				fileName: '账户信息',
			}
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
					if(d.aaData[a].balance != undefined) {
						d.aaData[a].balance = (d.aaData[a].balance / 100).toFixed(2);
					}
					if(d.aaData[a].freezeBalance != undefined) {
						d.aaData[a].freezeBalance = (d.aaData[a].freezeBalance / 100).toFixed(2);
					}
					if(d.aaData[a].creditLine != undefined) {
						d.aaData[a].creditLine = (d.aaData[a].creditLine / 100).toFixed(2);
					}
					d.aaData[a].inoutTye = this._filterData(d.aaData[a].inoutTye, this.inoutTypeOptions)
				}
				return d.aaData
			},
			searchTable() {
				this._ajax({
						url: this.settleAPI,
						name: 'accountInfo/list',
						loading: 'dataLoading',
						param: {
							inoutTye: this.searchForm.inoutTye,
							customerName: this.searchForm.customerName,
							pageNum: this.pageNum,
							pageSize: this.pageSize,
							startTime: this.searchForm.dateValue[0] ? this.searchForm.dateValue[0] : '',
							endTime: this.searchForm.dateValue[1] ? this.searchForm.dateValue[1] : '',
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
					customerName: '',
					inoutTye: '',
					dateValue: [],
				})
				this.searchTable();
			},
			exportSearchExcel() {
				this.searchTable();
				this._ajax({
					url: this.settleAPI,
					name: 'accountInfo/list',
					loading: 'dataLoading',
					param: {
						inoutTye: this.searchForm.inoutTye,
						customerName: this.searchForm.customerName,
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