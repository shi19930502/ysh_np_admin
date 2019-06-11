<template>
	<div class="page-ms_batch">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="模板类型">
				<selectInput :value.sync="searchForm.smsType" @selectChange="searchTable">
					<el-option label="全部" value=""></el-option>
					<el-option
				      v-for="item in smsTypeList"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="模板名称">
				<inputItem :value.sync="searchForm.smsTitle" ></inputItem>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新添模板" @click="add">新添模板</iconBtn>
					<iconBtn iconClass="el-icon-minus" content="删除" @click="dele">删除</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading"  @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="smsType" label="模板类型">
		    	<template slot-scope="scope">
		    		<span v-for="item in smsTypeList">
				      <span v-if="scope.row.smsType == item.key">{{item.value}}</span>
				    </span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="smsTitle" label="模板名称">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.smsTitle}}</span>
		      	</template>
		    </el-table-column>
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
		     <el-table-column prop="lastModifyPersonName" label="最后修改人名称">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.lastModifyPersonName}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="lastModifyTime" label="最后修改时间">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.lastModifyTime}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作">
		    	<template slot-scope="scope">
		    		<el-button-group>
		    			<iconBtn iconClass="el-icon-view" content="查看" @click="lookup(scope.row)"></iconBtn>
		    			<iconBtn iconClass="el-icon-edit" content="编辑" @click="edit(scope.row)" ></iconBtn>
						<iconBtn iconClass="el-icon-minus" content="删除" @click="delRow(scope.row)"></iconBtn>
		    		</el-button-group>		    		
		    	</template>
		    </el-table-column>
		</elemTable>
		<smsTemplModal 
			:modal='modalShow' 
			v-if='modalShow' 
			:modalTitle='modalTitle' 
			:messageRow='messageRow' 
			:lookup='islookup' 
			@close='modalClose'
			@add='modalAdd'
			>
		</smsTemplModal>	
		
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import smsTemplModal from './component/modal/sms_TemplModal.vue'
	export default {
		mixins: [mixin],
		components: {smsTemplModal},
		data() {
			return {
				dataList: [],	
				smsTypeList:[],
				templateList:[],
				//弹出框
				modalTitle:'',
				modalShow:false,
				islookup:false,
				searchForm: {
					smsType: '',
					smsTitle: '',
					comment: '',
					remark: '',
					lastModifyTime:'',
				},
			}
		},
		mounted() {
			this.init();
			this.searchTable()
		},
		methods: {
			modalAdd(modalTitle,form){
				if(this.modalTitle=="新增"){
					form.sendStatus=0
					this._ajax({url:this.tootAPI,name:'smstemplate/baseCreate',param:form})
						.then((d)=>{
							if(d.state==0){
								this.searchTable();
		                        this.$message({ type: 'success', message: '操作成功' }); 
		                    }else if(d.state==2){
								this.searchTable();
		                    	 this.$message({ type: 'warning', message: d.msg }); 
		                    }
						})
						
				}else{
					this._ajax({url:this.tootAPI,name:'smstemplate/update',param:form})
					.then((d)=>{
						if(d.state==0){
							this.searchTable();
	                        this.$message({ type: 'success', message: '操作成功' }); 
	                    }
					})
				}
			},
			init(){
				var vm=this;
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				this._ajax({url: this.rootAPI, name: 'datadic/list',param:{
					dataType:"MESSAGE_TYPE"
				}, loading: 'dataLoading'})
				.then((function(d) {
						this.smsTypeList = d.aaData;
				}).bind(this))	
			},
			//获取模板信息
			searchTable() {
				this._ajax({
					url: this.rootAPI, 
					name: 'smstemplate/list', 
					param: this.searchForm, 
					loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					smsType: '',
					smsTitle: '',
				})
				this.handleCurrentChange(1)
			},	
			add(){
				this.islookup=false;
				this.messageRow={}
				this.modalTitle='新增'
				this.modalShow=true;
			},
			dele() {			
	        	if(this.delSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.delSelection
	        		this.confirm('确定删除？', (function() {     
	        			var arr = []
						selection.forEach(function(el) {
							arr.push(el.id)
						})	
						this._ajax({url: this.rootAPI + 'smstemplate/delete', param: {
							id:arr
						}, arr:true})
						.then((function(d) {
							this.$message({type: 'success', message: '删除成功'});
							this.handleCurrentChange(1)
						}).bind(this))
	        		}).bind(this))		                        		
	        	}	
			},
			//查看
			lookup(o){
				this.modalShow=true;
				this.modalTitle='查看'
				this.islookup=true
				this.messageRow=o
			},
			//编辑
			edit(o){
				this.islookup=false;
				this.modalTitle='编辑'
				this.messageRow=o
				this.modalShow=true;
			},
			//删除
			delRow(row) {
				this.confirm('确定删除？', (function() {     
        			var o = {
        				id: [row.id]
        			}
					this._ajax({url: this.rootAPI + 'smstemplate/delete', param: o, arr:true})
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
			},
		}
	}
</script>