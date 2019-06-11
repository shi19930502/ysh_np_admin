<template>
	<div class="page-channel">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="渠道名称">
				<inputItem :value.sync="searchForm.name" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="启用状态">
				<selectInput :value.sync="searchForm.enabled" @selectChange="searchTable" :clearable="true">
					<el-option
				      v-for="item in dicEnabled"
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
					<iconBtn iconClass="el-icon-plus" content="新增" @click="modalAdd">新增</iconBtn>
					<!-- <iconBtn iconClass="el-icon-minus" content="删除" @click="dele">删除</iconBtn> -->
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
		    <el-table-column prop="name" label="渠道名称">
		    	<template slot-scope="scope">
				    <toolTip :content="scope.row.name">
		    			<span>{{scope.row.name}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <!-- <el-table-column prop="dataDicValue" label="主体编码">
		    	<template slot-scope="scope">
		    			<span>{{scope.row.dataDicValue}}</span>
		      	</template>
		    </el-table-column> -->
		    <el-table-column prop="parentName" label="上级渠道">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.parentName">
		    			<span>{{scope.row.parentName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="enabled" label="启用状态">
		    	<template slot-scope="scope">
		    		<tagItem :type="scope.row.enabled ? 'success' : 'danger'" :text="_dicValue(scope.row.enabled, dicEnabled)"></tagItem>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="comment" label="备注">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.comment">
		    			<span>{{scope.row.comment}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作">
		    	<template slot-scope="scope">
		    		<el-button-group>
		    			<iconBtn iconClass="el-icon-edit" content="编辑" @click="modalEdit(scope.row)" v-if="!scope.row.rowEditable"></iconBtn>	    
					    <iconBtn iconClass="el-icon-check" type="success" content="保存" @click="submitEdit(scope.row)" v-if="scope.row.rowEditable"></iconBtn>
					    <iconBtn iconClass="el-icon-close" type="info" content="取消" @click="cancelEdit(scope.row)" v-if="scope.row.rowEditable"></iconBtn>
					    <!-- <iconBtn iconClass="el-icon-minus" content="删除" @click="delRow(scope.row)"></iconBtn> -->
		    		</el-button-group>		    		
		    	</template>
		    </el-table-column>
		</elemTable>
		<channelModal v-if="modalShow" :modal="modalShow" :channelModalType="modalType" @close="modalClose" :channel="modalObj" @submit="modalSubmit"></channelModal>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import channelModal from './component/modal/channelModal.vue'
	export default {
		mixins: [mixin],
		components: {channelModal},
		data() {
			return {
				searchForm: {
					name: '',
					enabled: '',
					orderField: 'f_parent_channel_code'
				},
				dataList: [],				
				rowOBJ: {}
			}
		},
		mounted() {
			this._searchDic('IS_ENABLED')
			.then((function(d) {
				this.dicEnabled = this._dicKey(d)
			}).bind(this))
			.then(this.searchTable)
		},
		methods: {
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				return this._ajax({name: 'channel/list2', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					name: '',
					enabled: ''
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
			delSubmit(o) {
				this._comfirm('确定删除？')
        		.then((function() {        			
        			return this._ajax({name: 'channel/queryChilds', param: o, arr:true})
        		}).bind(this))
        		.then((function(d) {
        			if(d.aaData.length > 0) {        				
        				this._comfirm('包含未删除的子级，是否需要都删除？')
        				.then((function() {
        					var dataList = d.aaData, flag = true
        					for(var i = 0, l = dataList.length; i < l; i++) {
        						if(dataList[i].enabled === 0) {
        							flag = false
        						}
        					}
        					if(flag) {
        						this._delList(this.rootAPI + 'channel/delete2', o)
        					}else {
        						this.$message({type: 'warning', message: '不能删除，包含未停用的渠道，请先停用后再删除'});
        					}
        				}).bind(this))
				        .catch(this._confirmCancle);
        			}else {
        				this._delList(this.rootAPI + 'channel/delete2', o)
        			}
        		}).bind(this))	
        		.catch(this._confirmCancle);
			}
		}
	}
</script>