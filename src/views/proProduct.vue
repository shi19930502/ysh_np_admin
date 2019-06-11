<template>
	<div class="page-user">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="商品名称">
				<inputItem :value.sync="searchForm.name" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="所属商户">
				<inputItem :value.sync="searchForm.customerName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="所属渠道">
				<cascaderItem :options="channelList" @change="channelChange" :value.sync="channelName"></cascaderItem>
			</searchInputItem>
			<searchInputItem name="所属分类">
				<cascaderItem :options="categoryList" @change="categoryChange" :value.sync="categoryName" :propss="propss"></cascaderItem>
			</searchInputItem>
			<searchInputItem name="创建时间">
				<dateEditorDaterange :dateValue.sync="dateRange"></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-plus" content="新增商品模板" @click="addProModal">新增商品模板</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="expand">
		      <template slot-scope="props">
		      	<div class="row-expand-box">
		      		<div class="row-expand-row">
			        	<div class="row-expand-label">创建人</div>
			        	<div>{{props.row.createdPersonName}}</div>
			        </div>
			        <div class="row-expand-row">
			        	<div class="row-expand-label">创建时间</div>
			        	<div>{{props.row.createdDate}}</div>
			        </div>
			        <div class="row-expand-row">
			        	<div class="row-expand-label">最后修改人</div>
			        	<div>{{props.row.lastModifyPersonName}}</div>
			        </div>
			        <div class="row-expand-row">
			        	<div class="row-expand-label">最后修改时间</div>
			        	<div>{{props.row.lastModifyTime}}</div>
			        </div>
			        <div class="row-expand-row">
			        	<div class="row-expand-label">描述</div>
			        	<div>{{props.row.remark}}</div>
			        </div>
		      	</div>		        
		      </template>
		    </el-table-column>
			<el-table-column prop="code" label="商品编码">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.code">
		    			<span>{{scope.row.code}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="name" label="商品名称">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.name">
		    			<span>{{scope.row.name}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="gbgoodsid" label="国标码">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.gbgoodsid">
		    			<span>{{scope.row.gbgoodsid}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="skuName" label="规格">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.skuName">
		    			<span>{{scope.row.skuName}}</span>
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
		    <el-table-column prop="customerName" label="所属商户" width="120">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.customerName">
		    			<span>{{scope.row.customerName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="categoryName" label="所属分类">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.categoryName">
		    			<span>{{scope.row.categoryName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="channelName" label="所属渠道">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.channelName">
		    			<span>{{scope.row.channelName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="measureMethodName" label="计量方式">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.measureMethodName">
		    			<span>{{scope.row.measureMethodName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="productPicUrl" label="图片">
		    	<template slot-scope="scope">
		    		<imgItem :path="scope.row.productPicUrl"></imgItem>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="published" label="启用状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dicValue(scope.row.skuPublished, dicEnabled)">
		    			<span>{{_dicValue(scope.row.skuPublished, dicEnabled)}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		     <el-table-column prop="deleted" label="规格删除状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dicValue(scope.row.skuDeleted, dicDeleted)">
		    			<span>{{_dicValue(scope.row.skuDeleted, dicDeleted)}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="deleted" label="商品删除状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dicValue(scope.row.deleted, dicDeleted)">
		    			<span>{{_dicValue(scope.row.deleted, dicDeleted)}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		</elemTable>
		<proAndDetailModal v-if="proAndDetailModalShow" :modal="proAndDetailModalShow" @close="proAndDetailModalClose" ></proAndDetailModal>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import proAndDetailModal from './component/modal/proAndDetailModal.vue'
	export default {
		mixins: [mixin],
		components: {proAndDetailModal},
		data() {
			return {
				searchForm: {
					name: '',
					channelCode: '',
					categoryCode:'',
					startTime: '',
					endTime: '',
					customerName: ''
				},
				channelName: [],
				categoryName: [],
				dataList: [],				
				rowOBJ: {},
				channelList: [],
				categoryList: [],
				propss: {
                    label: 'name',
                    value: 'code',
                    children: 'childList',
                },
                dateRange: [],
                proAndDetailModalShow : false,
			}
		},
		mounted() {
			this._searchDic('PRODUCT_STATUS')
			.then((function(d) {
				this.dicEnabled = this._dicKey(d)
			}).bind(this))
			this._searchDic('IS_DELETED')
			.then((function(d) {
				this.dicDeleted = this._dicKey(d)
			}).bind(this))
            this._ajax({url: this.rootAPI, name: 'channel/listByParent', param: {parentChannelCode: ''}})
            .then((function(d) {
                this.channelList = d.aaData      
            }).bind(this))
            this._ajax({url: this.rootAPI, name: 'category/childList', param: {parentCategoryId: 'top'}})
            .then((function(d) {
                this.categoryList = d.aaData      
            }).bind(this))
			this.searchTable()
		},
		methods: {			
			searchTable() {
				var dateRange = {
					startTime: '',
					endTime: ''
				}				
				if(this.dateRange && this.dateRange.length > 0) {
					dateRange = {
						startTime: this.dateRange[0],
						endTime: this.dateRange[1]
					}
				}
				Object.assign(this.searchForm, dateRange, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize,
				})
				return this._ajax({url: this.rootAPI, name: 'product/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					name: '',
					channelCode: '',
					categoryCode:'',
					startTime: '',
					endTime: '',
					customerName: ''
				})
				this.channelName = []
				this.categoryName = []
				this.dateRange = []
				this.handleCurrentChange(1)
			},			
			channelChange(val) {
				if(val.length > 0) {
                    Object.assign(this.searchForm, {channelCode: val[val.length - 1]})
                }else {
                    Object.assign(this.searchForm, {channelCode: ''})
                }
                this.searchTable()
			},
			categoryChange(val) {
				if(val.length > 0) {
						Object.assign(this.searchForm, {categoryCode: val[val.length - 1]})
				}else {
						Object.assign(this.searchForm, {categoryCode: ''})
				}
        this.searchTable()
			},
			addProModal() {
				this.proAndDetailModalShow = true;
			},
			proAndDetailModalClose() {
				this.proAndDetailModalShow = false;
				this.searchTable()
			}
		}
	}
</script>