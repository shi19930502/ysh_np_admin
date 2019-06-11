<template>
	<div class="page-news">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="渠道">
				<inputItem :value.sync="searchForm.channelName" @enter="search"></inputItem>
			</searchInputItem>
			<searchInputItem name="消息标题">
				<inputItem :value.sync="searchForm.title" @enter="search"></inputItem>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="add">新增</iconBtn>
					<iconBtn iconClass="el-icon-minus" content="删除" @click="dele">删除</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="search">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
		   <!-- <el-table-column prop="customerName" label="用户名称">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.customerName">
		    			<span>{{scope.row.customerName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>-->
		    <el-table-column prop="channelName" label="渠道">
		    	<template slot-scope="scope">
	    			<span>{{scope.row.channelName}}</span>
		      	</template>
		    </el-table-column>
		      <el-table-column prop="title" label="标题">
		    	<template slot-scope="scope">
	    			<span>{{scope.row.title}}</span>
			    </template>
		    </el-table-column>
		    <el-table-column prop="noticeStatus" label="状态">
		    	<template slot-scope="scope">
		    		<span v-for="item in datadicOptions">
			        	<span v-if="scope.row.noticeStatus == item.key">{{item.value}}</span>
					</span>
			    </template>
		    </el-table-column>
		    <el-table-column prop="comment" label="消息内容" :show-overflow-tooltip="true">
		    	<template slot-scope="scope">
	    			<span>{{scope.row.comment}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="supportNum" label="附件数量">
		    	<template slot-scope="scope">
	    			<span>{{scope.row.supportNum}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="publishedDate" label="发布时间">
		    	<template slot-scope="scope">
	    			<span>{{scope.row.publishedDate}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="createdPersonName" label="创建人">
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
		    			<iconBtn iconClass="el-icon-view" content="查看" @click="lookup(scope.row)"></iconBtn>
		    			<iconBtn iconClass="el-icon-edit" content="编辑" @click="edit(scope.row)" v-if="scope.row.noticeStatus ==0"></iconBtn>
					    <iconBtn iconClass="el-icon-circle-check" content="发送" @click="send(scope.row)" v-if="scope.row.noticeStatus ==0"></iconBtn>
					    <iconBtn iconClass="el-icon-minus" content="删除" @click="delRow(scope.row)"></iconBtn>
		    		</el-button-group>		    		
		    	</template>
		    </el-table-column>
		</elemTable>
		<platformModal
			:modal='modalShow'
			v-if='modalShow'
			:modalTitle='modalTitle'
			:messageRow='messageRow'
			:lookup='islookup'
			@close='modalClose'
			></platformModal>
			
			
	</div>
</template> 
<script>
	import local from '../local.js' 
	import mixin from '../mixin/mixin.js'
	import platformModal from './component/modal/platformModal.vue'
	export default {
		mixins: [mixin],
		components: {platformModal},
		data() {
			return {
				searchForm: {
					channelName: '',
					title: '',
				},
				dataList: [],	
				datadicOptions:[],
				selectVal: 1,
				rowOBJ: {},
				//弹出框
				modalTitle:'',
				modalShow:false,
				islookup:false,
				dateValue:[],
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init(){
				this._ajax({url:this.tootAPI,name:'datadic/list',
					param:{}
				}).then((d)=>{
					d.aaData.forEach((val)=>{
						if(val.dataType=='MS_SEND_TYPE'){
							this.datadicOptions.push(val)
						}
					})
					this.search();	
				})
				
				this._ajax({url:this.tootAPI,name:'channel/list',
					param:{}
				}).then((d)=>{
					d.aaData.forEach((val)=>{
						if(val.dataType=='MS_SEND_TYPE'){
							this.datadicOptions.push(val)
						}
					})
					this.search();	
				})
			},
			searchTable() {
				Object.assign(this.searchForm, {
					channelCode:local.get('sessionUser').typeCode,
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				return this._ajax({url: this.rootAPI, name: 'platformnotice/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			search(){
				this.searchTable(this.searchForm)
			},
			reset() {
				Object.assign(this.searchForm, {
					channelName: '',
					title: ''
				})
				this.handleCurrentChange(1)
			},
			add(){
				this.islookup=false;
				this.messageRow={}
				this.modalTitle='新增'
				this.modalShow=true;
			},
			edit(o){
				this.islookup=false;
				this.modalTitle='编辑'
				this.messageRow=o
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
			send(o){
				if(!o.customerId) {
	      			this.$message({ type: 'warning', message: '没有接收人不能发送！' }); 
	      			return;
	      		}
				var vm=this;
				var platflow={
					id:o.id,
					noticeStatus:1,
					//publishedDate:new Date()
				}
				this.confirm('确定发送？', (function() {
					this._ajax({url:this.tootAPI,name:'platformnotice/sendMessage',param:platflow})
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
						this._ajax({url: this.rootAPI + 'platformnotice/delete', param: o, arr:true})
						.then((function(d) {
							this.$message({type: 'success', message: '删除成功'});
							this.handleCurrentChange(1)
						}).bind(this))
	        		}).bind(this))		                        		
	        	}	
			},
			delRow(row) {
		        this.confirm('确定删除？', (function () {
		          var o = {
		            id: [row.id]
		          }
		          this._ajax({
		              url: this.rootAPI + 'platformnotice/delete',
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
		    },
			changeMobile(row) {
				// if(!this.regFloat.test(row.mobile)) {
				// 	console.log(this.regFloat.test(row.mobile))
				// 	row.mobile = 0
				// }
			},
			exportExcel() {
				var fields = ['customerName'],
					filedsName = ['用户名称'],
					fileName = '用户';
				this.searchAll({url: this.rootAPI, name: 'platformnotice/list', param: this.searchForm})
				.then((function(d) {
					if(d.aaData.length > 0) {
						this._csvExport(d.aaData, fields, filedsName, fileName)
					}else {
						this.$message({ type: 'info', message: '无导出数据' });
					}
				}).bind(this))		
			},
			exportExcelBySelect() {
				var fields = ['customerName'],
					filedsName = ['用户名称'],
					fileName = '用户';
				this.$exportExcelBySelect(fields, filedsName, fileName)
			}
		}
	}
</script>