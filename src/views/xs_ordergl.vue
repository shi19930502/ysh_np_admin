<template>
	<div class="page-xs_ddgl">
		<!-- 查询条件 -->
		<searchInputItem name="订单号">
			<inputItem :value.sync="searchForm.orderUmber" @enter="search"></inputItem>
		</searchInputItem>
		<searchInputItem name="采购商">
			<inputItem :value.sync="searchForm.buyerName" @enter="search"></inputItem>
		</searchInputItem>
		<searchInputItem name="供应商">
			<inputItem :value.sync="searchForm.sellerName" @enter="search"></inputItem>
		</searchInputItem>
		<searchInputItems>
			<searchInputItem name="渠道">				
				<!-- <selectInput :clearable='selectClearable' :value.sync="searchForm.childChannelCode" @selectChange="search" :disabled="isChannel">
					<el-option
				      v-for="item in channelList"
				      :key="item.code"
				      :label="item.name"
				      :value="item.code">
				    </el-option>
				</selectInput> -->

				<cascaderItem :options="channelList" @handleItemChange="handleItemChange" @change="channelChange" :value.sync="parentChannel" :filterable="false" ></cascaderItem>
			</searchInputItem>
			<searchInputItem name="订单状态">
				<selectInput :clearable='selectClearable' :value.sync="searchForm.orderStatusId" @selectChange="search">
					
					<el-option
				      v-for="item in orderStateList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="付款状态">
				<selectInput :clearable='selectClearable' :value.sync="searchForm.paymentStatusId" @selectChange="search">
					
					<el-option
				      v-for="item in payStateList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="支付类型">
				<selectInput :clearable='selectClearable' :value.sync="searchForm.payType" @selectChange="search">
					
					<el-option
				      v-for="item in payWayList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="物流状态">
				<selectInput :clearable='selectClearable' :value.sync="searchForm.shippingStatusId" @selectChange="search">
					
					<el-option
				      v-for="item in LOGList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="search">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable  ref="multipleTable" :dataList="dataList" @cellClick='cellClick' :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="orderUmber"  label="订单号">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.orderUmber}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="channelCode" label="渠道">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.channelName}}</span>
		    	</template>		    	
		    </el-table-column>
		    <el-table-column prop="orderStatusId" label="订单状态">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.orderStatusName}}</span>
		    	</template>		    	
		    </el-table-column>
		    <el-table-column prop="buyerName" label="买方名称">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.buyerName}}</span>
		    	</template>		    	
		    </el-table-column>
		    <el-table-column prop="sellerName" label="卖方名称">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.sellerName}}</span>
		    	</template>		    	
		    </el-table-column>
		    <el-table-column prop="paymentStatusId" label="付款状态">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.payStatusName}}</span>
		    	</template>		    	
		    </el-table-column>
		    <el-table-column prop="payType" label="支付类型">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.payWayStatusName}}</span>
		    	</template>		    	
		    </el-table-column>
		    <el-table-column prop="shippingStatusId" label="物流状态">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.shippingStatusName}}</span>
		    	</template>		    	
		    </el-table-column>
		    <el-table-column prop="createdDate" label="下单时间">
		    	<template slot-scope="scope">
		    		<span>{{scope.row.createdDate}}</span>
		    	</template>		    	
		    </el-table-column>
		    <el-table-column label="操作">
		    	<template slot-scope="scope">
		    		<el-button-group>
				    	<iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
					</el-button-group>		    		
		    	</template>
		    </el-table-column>
		    
		</elemTable>
		<xsOrdergl
			:modal='xs_orderglModal'
			v-if='xs_orderglModal'
			@close='xs_orderglModalClose'
			:tableRow='tableRow'
		></xsOrdergl>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import xsOrdergl from './component/modal/xs_orderglModal.vue'
	export default {
		mixins: [mixin],
		components: {xsOrdergl},
		data() {
			return {
				searchForm: {
					childChannelCode: '',//如果是运营商 默认查询其所有子渠道
					orderUmber: '',
					orderStatusId: '',
					paymentStatusId: '',
					payType: '',
					shippingStatusId:'',
					buyerName: '',
					sellerName: ''
				},
				orderStateList:[],	//订单状态
				LOGList:[],	//物流状态
				payStateList:[],	//付款状态 
				payWayList:[],		//支付类型
				dataList: [],	
				channelList: [],	//渠道
				tempO: {},//临时存放订单对象
				xs_orderglModal:false,
				orderId:'',
				paymentStatusId:null,
				orderStatusId:null,
				tableRow:{},
				selectClearable:true,
				isChannel:'',
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init(){
				var vm=this;				
				this._ajax({url: this.rootAPI, name: 'datadic/list'})
				.then((function(d) {
					d.aaData.map(function(el){
						if(el.dataType=='ORDER_STATUS'){
							vm.orderStateList.push(el);
						}
						if(el.dataType=='TRANSPORT_STATUS'){
							vm.LOGList.push(el);
						}
						if(el.dataType=='PAY_STATUS'){
							vm.payStateList.push(el);
						}
						if(el.dataType=='PAY_WAY'){
							vm.payWayList.push(el);
						}
					})
					this.searchTable()
				}).bind(this))
				
				let user = local.get('sessionUser');
				var loginName = user.loginName
				var channelCode = user.typeCode
				let typeId =  user.typeId;
				if(loginName == 'admin'|| typeId == '0' || channelCode == '' || channelCode == '0' || channelCode.length == 0) {
					//超级管理员
					this.isChannel = false;
				} else {
					//各渠道管理员
					this.searchForm.childChannelCode = channelCode;
					this.isChannel = true;
				}
				this._ajax({name: 'channel/listByParentAndNotIsLastChannel', param: {parentChannelCode: '', filteEnabled: 1, isNotfilteLast: 1}})
	            .then((function(d) {
	                this.channelList = d.aaData      
	            }).bind(this))



				// this._ajax({url: this.rootAPI, name: 'channel/list',
				// param:{
				// 	code:local.get('sessionUser').typeCode
				// },
				// loading: 'dataLoading'})
				// .then((function(d) {
				// 	d.aaData.map(function(el){
				// 		vm.channelList.push(el);
				// 	})
				// 	this.searchTable()
				// }).bind(this))
			},
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				return this._ajax({url: this.rootAPI, name: 'order/list', param: this.searchForm, loading: 'dataLoading'})
				.then(this.renderTable)
//				.then(()=>{	
//					this.$nextTick(() =>{
//						this.$refs.multipleTable.$refs.multipleTable.toggleRowSelection(this.dataList[0]);
//					})
//				})
			},
			search(){
				this.searchTable()
			},
			reset() {
				Object.assign(this.searchForm, {
					childChannelCode: local.get('sessionUser').typeCode,
					orderUmber: '',
					orderStatusId: '',
					paymentStatusId: '',
					payType: '',
					shippingStatusId:'',
					buyerName: '',
					sellerName: ''
				})
				this.handleCurrentChange(1)
			},
			//批量删除
			dele() {			
	        	if(this.delSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.delSelection
	        		this.confirm('确定删除？', (function() {     
	        			var arr = [], o = {}
						selection.forEach(function(el) {
							arr.push(el.Id)
						})	
						o.Id = arr
						this.delet(o);
	        		}).bind(this))		                        		
	        	}	
			},
			delRow(row) {
				this.confirm('确定删除？', (function() {     
        			var o = {
        				Id: [row.Id]
        			}
        			this.delet(o);
        		}).bind(this))	
			},
			dele(o){
				this._ajax({url: this.rootAPI + 'order/delete', param: o, arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '删除成功'});
						this.handleCurrentChange(1)
					}).bind(this))
			},
			changeMobile(row) {
				// if(!this.regFloat.test(row.mobile)) {
				// 	console.log(this.regFloat.test(row.mobile))
				// 	row.mobile = 0
				// }
			},
			cellClick(){
				
			},
			xs_orderglModalClose(){
				console.log(this.dataList)
				this.xs_orderglModal=false;
			},
			lookOver(row){
				this.tableRow=row
				this.xs_orderglModal=true;
			},
			selectionChange(val){
//				console.log(val)
			},
			channelChange(val) {
                if(val.length > 0) {
                    Object.assign(this.searchForm, {childChannelCode: val[val.length - 1]})
                }else {
                    Object.assign(this.searchForm, {childChannelCode: ''})
                }
            },
		}
	}
</script>