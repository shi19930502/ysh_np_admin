<template>
	<div class="page-user">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="市场编码">
				<inputItem :value.sync="searchForm.marketCode" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="市场名称">
				<inputItem :value.sync="searchForm.marketName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="所属渠道">
				<selectInput :value.sync="searchForm.channelCode" @selectChange="searchTable" :clearable="true">
					<el-option
				      v-for="item in dicChannel"
				      :key="item.code"
				      :label="item.name"
				      :value="item.code" >
				    </el-option>
				</selectInput>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="modalAdd">新增</iconBtn>
					<iconBtn iconClass="el-icon-minus" content="删除" @click="dele">删除</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="marketCode" label="市场编码">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.marketCode}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="marketName" label="市场名称">
		    	<template slot-scope="scope">
		    			<span>{{dicTime(scope.row.marketName)}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="statu" label="所属渠道">
		    	<template slot-scope="scope">
		    		{{scope.row.channelName}}
		      	</template>
		    </el-table-column>
			<el-table-column prop="statu" label="是否启用">
				<template slot-scope="scope">
					<tagItem :type="scope.row.enabled==1 ? 'success' : 'danger'" :text="_dicValue(scope.row.enabled, dicEnabled)"></tagItem>
				</template>
			</el-table-column>
		    <el-table-column label="操作">
		    	<template slot-scope="scope">
		    		<el-button-group>
		    			<iconBtn iconClass="el-icon-edit" content="编辑" @click="modalEdit(scope.row)"></iconBtn>
					    <iconBtn iconClass="el-icon-minus" content="删除" @click="delRow(scope.row)"></iconBtn>
		    		</el-button-group>		    		
		    	</template>
		    </el-table-column>
		</elemTable>
		<marketModal v-if="modalShow" :modal="modalShow" 
		:userRoleModalType="modalType" @close="modalClose" 
		:defaultChecked="defaultChecked"
		:userRole="modalObj" @submit="modalSubmit"></marketModal>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import configs from '../configs.js'
	import local from '../local.js'
	import marketModal from './component/modal/marketModal.vue'
	export default {
		mixins: [mixin],
		components: {marketModal},
		data() {
			return {
				searchForm: {
					marketCode:'',
					marketName:'',
					channelCode:'',
				},
				dataList: [],
				dicChannel:[],
				dicEnabled:[{key:0,value:'停用'},{key:1,value:'启用'}],
				defaultChecked: []				
			}
		},
		mounted() {
			var vm = this;
			this._ajax({
				url:this.tootAPI,
				name:'channel/list',
				param:{enabled: '1'}
			}).then((d)=>{
				vm.dicChannel=d.aaData
				vm.searchTable();
			})
		},
		methods: {
			dicTime(time){
				return time.substring(0,10);
			},
			searchTable() {
				var user = local.get('sessionUser')
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				Object.assign(this.searchForm, {
					createPersonId: user.userId
				})
				return this._ajax({url: this.rootAPI +'market/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					marketCode:'',
					marketName:'',
					channelCode:'',
				})
				this.handleCurrentChange(1)
			},			
			dele() {			
	        	if(this.delSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.delSelection
	        		var arr = [], o = {}
					selection.forEach(function(el) {
						arr.push(el.id)
					})	
					o.id = arr
					this.delSubmit(o)		                        		
	        	}	
			},
			delRow(row) {
				var o = {
    				id: [row.id]
    			}
				this.delSubmit(o)
			},
			modalEdit(o) {
				this.modalObj = o
				this.modalType = 'edit'
				this.modalShow = true
			},
            modalClose() {
            	this.defaultChecked = []
				this.modalObj = {}
				this.modalShow = false
				this.modalType = 'add'
			},
			delSubmit(o) {
				this._comfirm('确定删除？')
				.then((function() {
					return this._ajax({url: this.rootAPI +'/market/delete', param: o, arr:true})
				}).bind(this))
				.then((function(d) {
					if(d.state == 0) {
						this.$message({type: 'success', message: '删除成功'});
					}
					this.handleCurrentChange(1)
				}).bind(this))
				.catch(this._confirmCancle);
			}
		}
	}
</script>