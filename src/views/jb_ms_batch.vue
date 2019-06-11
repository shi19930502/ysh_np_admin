<template>
	<div class="page-ms_batch">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="渠道">
				<selectInput :value.sync="searchForm.childChannelCode" @selectChange="search"  :disabled="isChannel">
					<el-option
				      v-for="item in channelList"
				      :key="item.code"
				      :label="item.name"
				      :value="item.code">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="通知类型">
				<selectInput :value.sync="searchForm.smsType" @selectChange="search">
					<el-option label="全部" value=""></el-option>
				    <el-option
				      v-for="item in messageTypeList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="通知内容">
				<inputItem :value.sync="searchForm.comment" @enter="search"></inputItem>
			</searchInputItem>
			<searchInputItem name="发送状态">
				<selectInput :value.sync="searchForm.sendStatus" @selectChange="search">
					<el-option label="全部" value=""></el-option>
					<el-option
				      v-for="item in statusOptions"
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
					<iconBtn iconClass="el-icon-plus" content="添加" @click='add'>添加</iconBtn>
					<iconBtn iconClass="el-icon-minus" content="删除" @click="dele">删除</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="search">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<!--<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出所选到Excel" @click="exportExcelBySelect"></iconBtn>-->
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="channelCode" label="渠道">
		    	<template slot-scope="scope">
		    		<span v-for="item in channelList">
				      <span v-if="scope.row.channelCode == item.code">{{item.name}}</span>
				    </span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="customerIds" label="收信人">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.customerName}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="smsType" label="通知类型">
		    	<template slot-scope="scope">
		    		<span v-for="item in messageTypeList">
				      <span v-if="scope.row.smsType == item.key">{{item.value}}</span>
				    </span>
			    </template>
		    </el-table-column>
		    <el-table-column prop="templateName" label="模板名称">
		    	<template slot-scope="scope">
		    		<span v-for="item in templateList">
				      <span v-if="scope.row.templateName == item.id">{{item.smsTitle}}</span>
				    </span>
			    </template>
		    </el-table-column>
		    <el-table-column prop="isUseTemplate" label="是否使用模板">
		    	<template slot-scope="scope">
		    		<span v-for="item in whetherList">
				      <span v-if="scope.row.isUseTemplate == item.key">{{item.value}}</span>
				    </span>
		      	</template>
		    </el-table-column>
		    <!--<el-table-column prop="comment" label="通知内容">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.comment">
		    			<span>{{scope.row.comment}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>-->
		    <el-table-column prop="sendStatus" label="发送状态">
		    	<template slot-scope="scope">
		    		<span v-for="item in statusOptions">
				      <span v-if="scope.row.sendStatus == item.key">{{item.value}}</span>
				    </span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="sendDate" label="发送时间">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.sendDate}}</span>
		      	</template>
		    </el-table-column>
		    <!-- <el-table-column prop="createdPersonId" label="创建人编码">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.createdPersonId">
		    			<span>{{scope.row.createdPersonId}}</span>
		    		</toolTip>
		      	</template>
		   </el-table-column>-->
		    <el-table-column prop="createdPersonName" label="创建人名称">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.createdPersonName}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="createdDate" label="创建时间">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.createdDate}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作" width="220">
		    	<template slot-scope="scope">
		    		<el-button-group>
		    			<iconBtn iconClass="el-icon-edit" content="编辑" @click="edit(scope.row)" v-if="scope.row.sendStatus ==0"></iconBtn>
					    <iconBtn iconClass="el-icon-circle-check" content="发送" @click="send(scope.row)" v-if="scope.row.sendStatus ==0"></iconBtn>
					    <iconBtn iconClass="el-icon-view" content="查看" @click="lookup(scope.row)"></iconBtn>
					    <iconBtn iconClass="el-icon-minus" content="删除" @click="delRow(scope.row)"></iconBtn>
		    		</el-button-group>		    		
		    	</template>
		    </el-table-column>
		</elemTable>
		<jbMsBatchModal
			:modal='modalShow'
			v-if='modalShow'
			:modalTitle='modalTitle'
			:messageRow='messageRow'
			:lookup='islookup'
			@close='modalClose'
			></jbMsBatchModal>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import local from '../local.js'
	import jbMsBatchModal from './component/modal/jb_ms_batchModal.vue'
	export default {
		mixins: [mixin],
		components: {jbMsBatchModal},
		data() {
			return {
				searchForm: {
					childChannelCode: '',//如果是运营商 默认查询其所有子渠道
					smsType: '',
					sendStatus: ''
				},
				dataList: [],	
				messageTypeList:[],
				channelList: [],
				statusOptions:[],
				whetherList:[],
				templateList:[],
				rowOBJ: {},
				//弹出框
				modalTitle:'',
				modalShow:false,
				islookup:false,
				isChannel: '',
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init(){
				var vm=this;
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				this._ajax({url: this.rootAPI, name: 'datadic/list', loading: 'dataLoading'})
				.then((function(d) {
					d.aaData.map(function(el){
						if(el.dataType=='MESSAGE_TYPE'){
							vm.messageTypeList.push(el);
						}
						if(el.dataType=='MS_SEND_TYPE'){
							vm.statusOptions.push(el);
						}
						if(el.dataType=='WHETHER'){
							vm.whetherList.push(el);
						}
					})
					this.searchTable(this.searchForm)
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
				this._ajax({url: this.rootAPI, name: 'channel/list',
					param:{
						code:local.get('sessionUser').typeCode
					}
				}).then((d)=>{
					this.channelList=d.aaData
					this.searchTable(this.searchForm)
				})
				
				this._ajax({url: this.rootAPI, name: 'smstemplate/list', loading: 'dataLoading'})
				.then((function(d) {
					vm.templateList=d.aaData
					this.searchTable(this.searchForm)
				}).bind(this))
			},
			searchTable(param) {
			   this._ajax({url: this.rootAPI, name: 'batchsendsms/list', param: param, loading: 'dataLoading'}).then(this.renderTable)
			},
			search(){
				this._ajax({url:this.tootAPI,name:'batchsendsms/listByChna',
					param:this.searchForm
				}).then((d)=>{
					this.dataList=d.aaData
				})
			},
			reset() {
				Object.assign(this.searchForm, {
					childChannelCode: local.get('sessionUser').typeCode,
					smsType: '',
					sendStatus: '',
					comment:''
				})
				this.handleCurrentChange(1)
			},	
			add(){ 
				this.islookup=false;
				this.messageRow={}
				this.modalTitle='新增'
				this.modalShow=true;
			},
			lookup(o){
				this.modalShow=true;
				this.modalTitle='查看'
				this.islookup=true
				this.messageRow=o
			},
			modalClose(){
				this.modalShow=false;
				this.messageRow={};
				this.search();
			},
			edit(o) {
				this.islookup=false;
				this.modalTitle='编辑'
				this.messageRow=o
				this.modalShow=true;
			},
			send(o){
				var vm=this;
				var param={}
				Object.assign(param, o);//防止界面改了状态 而后端更改失败 导致维护局不一致
				param.sendStatus=1;
				param.sendDate=this._getCurrentDate(0)
				this.confirm('确定发送？', (function() {
					this._ajax({url:this.tootAPI,name:'batchsendsms/update',param:param})
					.then((d)=>{
						if(d.state==0){
							this.$message({ type: 'success', message: '操作成功！' }); 
							this.search();
	                    }
					})
				}).bind(this))	
			},
			dele() {			
	        	if(this.delSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.delSelection
	        		this.confirm('确定删除？', (function() {     
	        			var arr = [], o = {}
						selection.forEach(function(el) {
							arr.push(el.id)
						})	
						o.id = arr
						this._ajax({url: this.rootAPI + 'batchsendsms/delete', param: o, arr:true})
						.then((function(d) {
							this.$message({type: 'success', message: '删除成功'});
							this.handleCurrentChange(1)
						}).bind(this))
	        		}).bind(this))		                        		
	        	}	
			},
			delRow(row) {
				this.confirm('确定删除？', (function() {     
        			var o = {
        				id: [row.id]
        			}
					this._ajax({url: this.rootAPI + 'batchsendsms/delete', param: o, arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '删除成功'});
						this.handleCurrentChange(1)
					}).bind(this))
        		}).bind(this))	
			},
			changeMobile(row) {
				// if(!this.regFloat.test(row.mobile)) {
				// 	console.log(this.regFloat.test(row.mobile))
				// 	row.mobile = 0
				// }
			}
		}
	}
</script>