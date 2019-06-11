<template>
	<div class="page-news">
		<!-- 查询条件 -->
		<searchInputItems>
			<!--<searchInputItem name="渠道">
				<inputItem :value.sync="searchForm.channelName" @enter="search"></inputItem>
			</searchInputItem>-->
			<searchInputItem name="标题">
				<inputItem :value.sync="searchForm.knowledgeTitle" @enter="search"></inputItem>
			</searchInputItem>
			<searchInputItem name="是否启用">
				<selectInput :value.sync="searchForm.enabled" @selectChange="searchTable">
					<el-option label="全部" value=""></el-option>
				    <el-option
				      v-for="item in enabledOptions"
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
					<iconBtn iconClass="el-icon-plus" content="新增" @click="add">新增</iconBtn>
					<!--<iconBtn iconClass="el-icon-minus" content="删除" @click="dele">批量删除</iconBtn>-->
					<iconBtn iconClass="el-icon-search" content="查询" @click="search">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="channelCode" label="渠道">
				<template slot-scope="scope">
					<selectInput :value.sync="scope.row.channelCode" v-if="scope.row.rowEditable">
						<el-option v-for="item in channelList" :key="item.name" :label="item.name" :value="item.code">
						</el-option>
					</selectInput>
					<span v-if="!scope.row.rowEditable">{{renderCommon(channelList, scope.row.channelCode)}}</span>
				</template>
			</el-table-column>
		      <el-table-column prop="knowledgeTitle" label="标题" >
		    	<template slot-scope="scope" >
		    		<span style=" overflow: hidden;    white-space: nowrap;    text-overflow: ellipsis;">{{scope.row.knowledgeTitle}}</span>
			    </template>
		    </el-table-column>
		    <el-table-column prop="statu" label="是否启用">
		    	<template slot-scope="scope">
		    		<tagItem :type="scope.row.enabled ? 'success' : 'danger'" :text="_dicValue(scope.row.enabled, enabledOptions)"></tagItem>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="readingQuantity" label="阅读次数">
		    	<template slot-scope="scope">
	    			<span>{{scope.row.readingQuantity}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="supportQuantity" label="附件数量">
		    	<template slot-scope="scope">
	    			<span>{{scope.row.supportQuantity}}</span>
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
		     <el-table-column prop="lastModifyPersonName" label="最后修改人">
		    	<template slot-scope="scope">
	    			<span>{{scope.row.lastModifyPersonName}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="createdDate" label="最后修改时间">
		    	<template slot-scope="scope">
					<span>{{scope.row.lastModifyTime}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作" width="200">
		    	<template slot-scope="scope">
		    		<el-button-group>
		    			<iconBtn iconClass="el-icon-edit" content="编辑" @click="edit(scope.row)" v-if="!scope.row.rowEditable"></iconBtn>	    
					    <iconBtn iconClass="el-icon-view" content="查看" @click="lookup(scope.row)"></iconBtn>
					    <iconBtn iconClass="el-icon-minus" content="删除" @click="delRow(scope.row)"></iconBtn>
		    		</el-button-group>		    		
		    	</template>
		    </el-table-column>
		</elemTable>
		<KnowledgebaseModal
			:modal='modalShow' 
			 v-if='modalShow' 
			:modalTitle='modalTitle' 
			:messageRow='messageRow' 
			:lookup='islookup' 
			@close='modalClose'
			@submit="modalSubmit"
			></KnowledgebaseModal>
	</div>
</template> 
<script>
	import local from '../local.js' 
	import mixin from '../mixin/mixin.js'
	import KnowledgebaseModal from './component/modal/KnowledgebaseModal.vue'
	export default {
		mixins: [mixin],
		components: {KnowledgebaseModal},
		data() {
			return {
				searchForm: {
					channelName:'',
					knowledgeTitle: '',
					enabled:'',
				}, 
				dataList: [],	
				enabledOptions:[],
				channelList:[],
				selectVal: 1,
				rowOBJ: {},
				//弹出框
				modalTitle:'',
				modalShow:false,
				islookup:false,
			}
		},
		mounted() {
			this.init();
			this._searchDic('IS_ENABLED')
			.then((function(d) {
				this.enabledOptions = this._dicKey(d)
			}).bind(this))
			.then(this.searchTable)
		},
		methods: {
			init(){
				//查询渠道数据
				this._ajax({
						url: this.rootAPI + 'channel/list',
						param: {},
						arr: true
					})
					.then((function(d) {
						Object.assign(this.channelList, d.aaData)
					}).bind(this))

				//查询数据字典，是否审核
				var param1 = {
					dataType: 'GRADE_STATE'
				};
				this._ajax({
						url: this.rootAPI + 'datadic/list',
						param: param1,
						arr: true
					})
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						
					}).bind(this))

			},
			renderCommon(dataList, code) {
				let dataShow = '';
				$.each(dataList, function(i, obj) {
					if(obj.code == code) {
						dataShow = obj.name;
					}
				});
				return dataShow;
			},
			searchTable(){
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				return this._ajax({url: this.rootAPI, name: 'knowledgebase/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			search(){
				this.searchTable(this.searchForm)
			},
			reset() {
				Object.assign(this.searchForm, {
					channelName: '',
					knowledgeTitle: '',
					enabled:'',
				})
				this.handleCurrentChange(1)
			},
			
			//批删
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
						this._ajax({url: this.rootAPI + 'knowledgebase/delete', param: o, arr:true})
						.then((function(d) {
							this.$message({type: 'success', message: '删除成功'});
							this.handleCurrentChange(1)
						}).bind(this))
	        		}).bind(this))		                        		
	        	}	
			},
			add(){
				this.islookup=false;
				this.messageRow={}
				this.modalTitle='新增'
				this.modalShow=true;
			},
			//编辑
			edit(o){
				this.islookup=false;
				this.modalTitle='编辑'
				this.messageRow=o
				this.modalShow=true;
			},
			//查看
			lookup(o){
				this.modalShow=true;
				this.modalTitle='查看'
				this.islookup=true
				this.messageRow=o
			},
			//删除
			delRow(row) {
				this.confirm('确定删除？', (function() {     
        			var o = {
        				id: [row.id],
        			}
					this._ajax({url: this.rootAPI + 'knowledgebase/delete', param: o, arr:true})
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