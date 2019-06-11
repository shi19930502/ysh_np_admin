<template>
	<el-dialog custom-class="jz-modal" :close-on-click-modal="false" :modal="false" :width="modalWidth" title="请选择进场信息" :visible.sync="modal" :before-close='beforeClose'>
		<div class="page-khNolice">
			<searchInputItems>
			<searchInputItem name="进场时间">
				<dateEditorDaterange  :dateValue.sync="dateValue"  :dateRange='dateRange' ></dateEditorDaterange>
			</searchInputItem>
			<searchInputItem name="商家名称">
				<inputItem :value.sync="searchForm.wsSupplierName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="商品名称">
				<inputItem :value.sync="searchForm.productName" @enter="searchTable"></inputItem>
			</searchInputItem>
			</searchInputItems>
			<optionItems >
					<template slot="left">
							<el-button-group>
							<iconBtn iconClass="el-icon-plus" content="加入检验" @click="jianYan">加入检验</iconBtn>
							<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
							<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
						</el-button-group>
					</template>
				</optionItems>
		<!-- 操作按钮 -->
			<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="batchId" label="批次号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.batchId">
						<span>{{scope.row.batchId}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="inDate" label="进场时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.inDate">
						<span>{{scope.row.inDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="wsSupplierName" label="商户名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.wsSupplierName">
						<span>{{scope.row.wsSupplierName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="productName" label="商品名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.productName + ' ['+scope.row.skuName+']'">
						<span>{{scope.row.productName +' ['+ scope.row.skuName+']'}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="weight" label="进场数量">
				<template slot-scope="scope">
					<toolTip :content="scope.row.weight">
						<span>{{scope.row.weight}}</span>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
		</div>
	</el-dialog>
</template>
<script>
	import local from '../../../local.js'
	import mixin from '../../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		props: {
			modal: {
				default: false,
			},
			parentDataList:{
				default: function () {
					return []
				}
			}
		},
		data() {
			return {
				//modal: false,
				searchForm: {
					startTime:'',
					endTime:'',
					wsSupplierName:'',
					productName:'',
					channelId:''
				},
				orderStateList: [], //订单状态
				LOGList: [], //物流状态
				payStateList: [], //付款状态 
				payWayList: [], //支付类型
				dataList: [],
				channelList: [], //渠道
				tempO: {}, //临时存放订单对象
				orderId: '',
				paymentStatusId: null,
				selectClearable: true,
				form: {},
				dateValue:[]
			}
		},
		created() {
			this.searchForm = {};
		},
		mounted() {
			this.searchTable();
		},
		methods: {
			searchTable() {
				if(this.dateValue == null) {
					this.dateValue[0] = this.getBeforeDay_7;
					this.dateValue[1] = this.getToday;
				}
				//查询自己渠道下的进场数据
				let user = local.get('sessionUser');
				let channelId = user.typeCode
				if(channelId == '001' || channelId == ''){
					//超级管理员
					this.searchForm.channelId ='';
				}
				var param = Object.assign({}, this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					startTime: this.dateValue[0],
					endTime: this.dateValue[1],
					statusId: 1
				})
				this._ajax({
					url: this.rootAPI + 'inmarketdetail/listUnionMain', 
					param:param,
					loading: 'dataLoading'})
				.then((d) => {
					let deleted = [];
					let j = 0;
					for (j = 0; j < d.aaData.length; j++) {
						let i = 0;
						for (i = 0; i < this.parentDataList.length; i++) {
							if (this.parentDataList[i].id === d.aaData[j].id) {
								deleted.push(j);
							}
						}
					}
					for (j = deleted.length - 1; j >= 0; j--) {
						d.aaData.splice(deleted[j], 1);
					}
					this.renderTable(d)
				})
			},
			beforeClose(done) {
				this.$emit('close',done)
			},
			jianYan() {
				if(this.delSelection.length === 0) {
					this.$message({
						type: 'info',
						message: '请选择行'
					});
				} else {
					let selection = this.delSelection
					this.confirm('确定加入？', (function() {
						var arr = [],
							o = {}
						selection.forEach(function(el) {
							arr.push(el.id)
						})
						this.beforeClose(arr);				
					}).bind(this))

				}
			},
			reset() {
				this.dateValue = [];
				this.searchForm.channelId ='' ;
				this.searchForm.wsSupplierName='' ;
				this.searchForm.productName = '' ;
				this.searchTable();
			}
		}
	}
</script>