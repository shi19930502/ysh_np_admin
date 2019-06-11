<template>
	<div class="page-news">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="发送渠道">
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
					<iconBtn iconClass="el-icon-minus" content="删除" @click="dele">删除</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="search">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="channelName" label="发送渠道">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.channelName}}</span>
		      	</template>
		    </el-table-column>
		      <el-table-column prop="title" label="消息标题">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.title}}</span>
			    </template>
		    </el-table-column>
		    <el-table-column prop="noticeStatus" label="消息状态">
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
		    <el-table-column label="操作" width="180">
		    	<template slot-scope="scope">
		    		<el-button-group>
					    <iconBtn iconClass="el-icon-view" content="查看" @click="lookup(scope.row)" v-if="scope.row.noticeStatus ==0"></iconBtn>
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
					id:'',
					channelName: '',
					title: '',
					noticeStatus:'',
				},
				form:{
					id:'',
					noticeStatus:'',
				},
				id:'',
				dataList: [],	
				datadicOptions:[],
				selectVal: 1,
				rowOBJ: {},
				//弹出框
				modalTitle:'',
				noticeStatus:'',
				modalShow:false,
				islookup:false,
				dateValue:[],
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init(){
				this._ajax({url:this.tootAPI,name:'datadic/list',
					param:{}
				}).then((d)=>{
					d.aaData.forEach((val)=>{
						if(val.dataType=='MSG_LOOKUP_STATE'){
							this.datadicOptions.push(val)
						}
					})
					this.search();	
				})
			},
			searchTable() {
				Object.assign(this.searchForm, {
					customerId:local.get('sessionUser').userId,
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				return this._ajax({url: this.rootAPI, name: 'platformnoticeflow/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			search(){
				this.searchTable(this.searchForm)
			},
			reset() {
				Object.assign(this.searchForm, {
					channelName: '',
					title: '',
					noticeStatus:'',
				})
				this.handleCurrentChange(1)
			},
			lookup(o){
				this.modalShow=true;
				this.modalTitle='查看消息'
				this.islookup=true
				this.messageRow=o;
				Object.assign(this.form, {
					customerId:local.get('sessionUser').userId,
					id:this.messageRow.id,
        			noticeStatus:this.noticeStatus=1,
				})
				this._ajax({
						url:this.tootAPI,
						name:'platformnoticeflow/update',
						param:this.form,
					})
				this.searchTable()
			},
			modalClose(){
				this.modalShow=false;
				this.messageRow={};
				this.search();
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
				this.confirm('确定删除？', (function() {     
        			var o = {
        				id: [row.id]
        			}
					this._ajax({url: this.rootAPI + 'platformnotice/delete', param: o, arr:true})
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