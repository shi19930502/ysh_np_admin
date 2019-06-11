<template>
	<div class="page-user">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="分类名称">
				<inputItem :value.sync="searchForm.name" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="父级分类">
				<inputItem :value.sync="searchForm.parentName" @enter="searchTable"></inputItem>
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
			<!-- <searchInputItem name="启用状态">
				<rateItem :value.sync="searchForm.rate"></rateItem>
			</searchInputItem> -->
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="modalAdd" v-if="sysId == 0">新增</iconBtn>
					<iconBtn iconClass="el-icon-minus" content="删除" @click="dele" v-if="sysId == 0">删除</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="search">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55" v-if="sysId == 0"></el-table-column>
			<el-table-column prop="code" label="商品编码">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.code">
		    			<span>{{scope.row.code}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="name" label="分类名称">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.name">
		    			<span>{{scope.row.name}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="gbgoodsId" label="国标码">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.gbgoodsId">
		    			<span>{{scope.row.gbgoodsId}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="vulgo" label="别名">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.vulgo">
		    			<span>{{scope.row.vulgo}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="parentName" label="父级分类">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.parentName">
		    			<span>{{scope.row.parentName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="fullName" label="分类全名">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.fullName">
		    			<span>{{scope.row.fullName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="enabled" label="启用状态">
		    	<template slot-scope="scope">
		    		<tagItem :type="scope.row.enabled ? 'success' : 'danger'" :text="_dicValue(scope.row.enabled, dicEnabled)"></tagItem>
		      	</template>
		    </el-table-column>
		    <!--<el-table-column prop="categoryPicUrl" label="图片">
		    	<template slot-scope="scope">
		    		<imgItem :path="scope.row.categoryPicUrl"></imgItem>
		      	</template>
		    </el-table-column>-->
		    <el-table-column prop="remark" label="描述">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.remark">
		    			<span>{{scope.row.remark}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作">
		    	<template slot-scope="scope">
		    		<el-button-group>
		    			<iconBtn iconClass="el-icon-edit" content="编辑" @click="modalEdit(scope.row)" v-if="!scope.row.rowEditable && sysId == 0"></iconBtn>	    
					    <iconBtn iconClass="el-icon-check" type="success" content="保存" @click="submitEdit(scope.row)" v-if="scope.row.rowEditable"></iconBtn>
					    <iconBtn iconClass="el-icon-close" type="info" content="取消" @click="cancelEdit(scope.row)" v-if="scope.row.rowEditable"></iconBtn>
					    <iconBtn iconClass="el-icon-minus" content="删除" @click="delRow(scope.row)" v-if="sysId == 0"></iconBtn>
		    		</el-button-group>		    		
		    	</template>
		    </el-table-column>
		</elemTable>
		<categoryModal v-if="modalShow" :modal="modalShow" :categoryModalType="modalType" @close="modalClose" :category="modalObj" @submit="modalSubmit"></categoryModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import categoryModal from './component/modal/categoryModal.vue'
	export default {
		mixins: [mixin],
		components: {categoryModal},
		data() {
			return {
				searchForm: {
					name: '',
					enabled: '',
					parentName: '',
					orderField: 'f_parent_category_id',
				},
				dataList: [],				
				rowOBJ: {},
				//控制只有超级管理员可以操作商品分类数据
				sysId : local.get("sessionUser").userId
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
			search() {
				this.handleCurrentChange(1);
			},
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				return this._ajax({name: 'category/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					name: '',
					enabled: '',
					parentName: ''
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
        			return this._ajax({name: 'category/queryChilds', param: o, arr:true})
        		}).bind(this))
        		.then((function(d) {
        			if(d.aaData.length > 0) {        				
        				this._comfirm('包含未删除的子级，是否需要全部删除？')
        				.then((function() {
        					var dataList = d.aaData, flag = true
        					for(var i = 0, l = dataList.length; i < l; i++) {
        						if(dataList[i].enabled === 0) {
        							flag = false
        						}
        					}
        					if(flag) {
        						this._ajax({name: 'category/delete2', param: o, arr:true})
		        				.then((function(d){
		        					if(d.state == 0) {
		        						this.$message({type: 'success', message: '操作成功'});
		        						this.searchTable()
		        					}
		        				}).bind(this))
        					}else {
        						this.$message({type: 'warning', message: '不能删除，包含未停用的分类，请先停用后再删除'});
        					}
        				}).bind(this))
				        .catch(this._confirmCancle);
        			}else {
        				this._ajax({name: 'category/delete2', param: o, arr:true})
        				.then((function(d){
        					if(d.state == 0) {
        						this.$message({type: 'success', message: '操作成功'});
        						this.searchTable()
        					}
        				}).bind(this))
        			}
        		}).bind(this))	
//      		.catch(this._confirmCancle);
			}
		}
	}
</script>