<template>
	<div class="clear_batch">
		<searchInputItems>
			<searchInputItem name="结算单号">
				<inputItem :value.sync='searchForm.settleNo'></inputItem>
			</searchInputItem>
			<searchInputItem name="客户名称">
				<inputItem :value.sync='searchForm.customerName'></inputItem>
			</searchInputItem>
			<searchInputItem name="审核人名称">
				<inputItem :value.sync='searchForm.auditorName'></inputItem>
			</searchInputItem>
			<searchInputItem name="对公对私">
				<selectItem :selectValue.sync='searchForm.perOrEnt'>
					<el-option v-for="item in perOrEntOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="结算状态">
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
					<elemTable :tableBorder="tableBorder" :dataList='[props.row]' :isShowPage="isShowPage">
						<el-table-column show-overflow-tooltip min-width="140" prop="customertNo" label="客户号"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="clearUnitId" label="清算单元"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="beginDate" label="起始会计日期"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="endDate" label="结束会计日期"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="inAccNo" label="收款账户"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="outAccNo" label="付款账户"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="recAccountNo" label="收款银行账号"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="recAccountName" label="收款方银行账户名"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="recBankCode" label="收款方银行行号"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="recBankName" label="付款方银行行名"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="summary" label="付款详情说明"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="placeId" label="清算场次"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="clearBatchId" label="清算批次流水"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="clearCount" label="情分流水条数"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="auditDate" label="审核时间"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="channelRecCode" label="渠道返回码"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="channelRecMsg" label="渠道返回消息"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="lastPayTime" label="上次支付时间"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="payTime" label="支付成功时间"></el-table-column>
						<el-table-column show-overflow-tooltip min-width="140" prop="updateDate" label="修改日期"></el-table-column>
					</elemTable>
				</template>
			</el-table-column>
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="settleNo" show-overflow-tooltip min-width="100" label="结算单号"></el-table-column>
			<el-table-column prop="customerName" show-overflow-tooltip min-width="100" label="客户名称"></el-table-column>
			<el-table-column prop="perOrEnt" show-overflow-tooltip min-width="150" label="对公对私">
				<template scope="scope">
					<el-tag type="info" v-if="scope.row.perOrEnt==0">对私</el-tag>
					<el-tag type="" v-else-if="scope.row.perOrEnt==1">对公</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="placeName" show-overflow-tooltip min-width="120" label="清算场次名称"></el-table-column>
			<el-table-column prop="auditorName" show-overflow-tooltip min-width="120" label="审核人名称"></el-table-column>
			<el-table-column prop="status" show-overflow-tooltip min-width="150" label="状态">
				<template scope="scope">
					<el-tag type="success" v-if="scope.row.status==='结算成功'">结算成功</el-tag>
					<el-tag type="" v-else-if="scope.row.status==='结算中'">结算中</el-tag>
					<el-tag type="warning"  v-else-if="scope.row.status==='结算失败'">结算失败</el-tag>
					<el-tag type="jsz"  v-else-if="scope.row.status==='待审核'">待审核</el-tag>
					<el-tag type="info"  v-else-if="scope.row.status==='待结算'">待结算</el-tag>
					<el-tag type="danger"  v-else-if="scope.row.status==='作废'">作废</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="amount" show-overflow-tooltip min-width="150" label="金额（元）"></el-table-column>
			<el-table-column prop="createDate" show-overflow-tooltip min-width="150" label="创建日期"></el-table-column>
			<el-table-column show-overflow-tooltip min-width="150" label="操作">
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
				perOrEntOptions: [
					{ label: "对公", value: 1 },
					{ label: "对私", value: 0 },
				],
				statusOptions: [
					{ label: "结算成功", value: 0 },
					{ label: "结算中", value: 1 },
					{ label: "结算失败", value: 2 },
					{ label: "待审核", value: 3 },
					{ label: "待结算", value: 4 },
					{ label: "作废", value: 9 },
				],
				searchForm: {
					settleNo: '',
					customerName: '',
					auditorName:'',
					perOrEnt: '',
					status: '',
					dateValue: [],
				},
				fields: ['settleNo', 'customerName', 'perOrEnt', 'placeName', 'auditorName', 'status', 'amount', 'clearCount', 'createDate',
					'beginDate', 'endDate', 'customertNo', 'clearUnitId', 'inAccNo', 'outAccNo', 'recAccountNo', 'recAccountName', 'recBankCode', 'recBankName', 'summary',
					'placeId', 'clearBatchId', 'auditDate', 'channelRecCode', 'channelRecMsg', 'payTime', 'lastPayTime', 'updateDate'
				],
				filedsName: ['结算单号', '客户名称', '对公对私', '清算场次名称', '审核人名称', '状态', '金额', '清分流水条数', '创建日期',
					'起始会计日期', '结束会计日期', '客户号', '清算单元', '收款账户', '付款账户', '收款方银行账号', '收款方银行账户名', '收款方银行行号', '收款方银行行名', '付款详情说明',
					'清算场次', '清算批次流水', '审核时间', '渠道返回码', '渠道返回消息', '支付成功时间', '上次支付时间', '修改日期'
				],
				fileName: '结算信息',
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
			computeFloat(d){
				for(let a = 0; a < d.aaData.length; a++) {
					if(d.aaData[a].amount != undefined) {
						d.aaData[a].amount = (d.aaData[a].amount / 100).toFixed(2);
					}
					d.aaData[a].perOrEnt = this._filterData(d.aaData[a].perOrEnt, this.perOrEntOptions)
					d.aaData[a].status = this._filterData(d.aaData[a].status, this.statusOptions)
				}
				return d.aaData
			},
			searchTable() {
				this._ajax({
						url: this.settleAPI,
						name: 'settleInfo/list',
						loading: 'dataLoading',
						param: {
							settleNo: this.searchForm.settleNo,
							customerName: this.searchForm.customerName,
							auditorName: this.searchForm.auditorName,
							perOrEnt: this.searchForm.perOrEnt,
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
			//作废和审核
			handleBtn(index,row,name){
				var confirmName='',urlName='';
				if(name=='close'){
					confirmName='作废'
					urlName='settleInfo/invalid'
				}else if(name=='check'){
					confirmName='审核'
					urlName='settleInfo/check'
				}
				this.confirm(confirmName+'操作不可逆，是否继续',()=>{
					this.cancellationAjax([row.settleNo],confirmName,urlName)
				})
			},
			//多个作废和审核
			checkAndcancellation(name){
				var confirmName='',urlName='';
				if(name=='close'){
					confirmName='作废'
					urlName='settleInfo/invalid'
				}else if(name=='check'){
					confirmName='审核'
					urlName='settleInfo/check'
				}
				if(this.rowSelection.length>0){
					var flg=true;
					for(let a=0;a<this.rowSelection.length;a++){
						if(name == 'close'&& (this.rowSelection[a].status=='作废'||this.rowSelection[a].status=='结算成功'||this.rowSelection[a].status=='结算失败')){
							flg=false
							break
						}else if(name=='check'&&(this.rowSelection[a].status!='待审核')){
							flg=false
							break
						}
					}
					if(flg){
						this.confirm(confirmName+'操作不可逆，是否继续',()=>{
							var arr=[];
							this.rowSelection.forEach(function(el){
								arr.push(el.settleNo);
							})
							this.cancellationAjax(arr,confirmName,urlName)
						})
					}else{
						this.$message({
				          message: '不能'+confirmName+'已完成的记录，请重新选择！',
				          type: 'warning'
					    });
					}
				}else{
					this.$message('请选择行');
				}
			},
			cancellationAjax(arr,name,urlName){
				this._ajax({
					url: this.settleAPI,
					name: urlName,
					loading: 'dataLoading',
					arr:true,
					param: {
						settleNo:arr,
					}
				}).then(d=>{
					if(d.state===0){
						this.$message({
				          message: '操作成功',
				          type: 'success'
				        });
						this.searchTable()
					}
				})
			},
			//是否显示按钮
			isShowBtn(name,row){
				if(name=='checkBtn'){
					if(row.status == "待审核"){
						return true
					}
				}
				if(name=='closeBtn'){
					if(row.status != "结算成功" && row.status !="结算失败" &&row.status != "作废"){
						return true
					}
				}
			},
			reset() {
				this.pageNum=1;
				this.pageSize=10;
				Object.assign(this.searchForm, {
					settleNo: '',
					customerName: '',
					auditorName:'',
					perOrEnt: '',
					status: '',
					dateValue: [],
				},)
				this.searchTable();
			},
			exportSearchExcel() {
				this.searchTable();
				this._ajax({
					url: this.settleAPI,
					name: 'settleInfo/list',
					loading: 'dataLoading',
					param: {
						billTypeId: this.searchForm.billTypeId,
						customerName: this.searchForm.customerName,
						perOrEnt: this.searchForm.perOrEnt,
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