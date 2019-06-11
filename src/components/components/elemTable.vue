<template>
	<div class="elem-table">
		<el-table :data="dataList" 
		v-loading="loading"
		ref='multipleTable'
	    element-loading-text="数据加载中"
	    element-loading-spinner="el-icon-loading"
	    element-loading-background="rgba(255, 255, 255, 0.8)"
	    :row-class-name="tableRowClassName"
	    :highlight-current-row="highlightCurrentRow"
	    :border="tableBorder"
	    @current-change="selectChange"
		@row-dblclick='rowDBlclick' @cell-click='cellClick' @selection-change="handleSelectionChange">
		    <slot></slot>
		</el-table>
		<div class="flex-x-end" v-if='isShowPage'>
	      <el-pagination
	        @size-change="handleSizeChange"
	        @current-change="handleCurrentChange"
	        :current-page="currentPage"
	        :page-sizes="pageSizes"
	        :page-size="pageSize"
	        :disabled="disabled"
	        layout="total, sizes, prev, pager, next, jumper"
	        :total="pageTotal">
	      </el-pagination>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'elemTable',
		props: {
			id: {
				default: ''
			},
			currentPage: {
				default: 1,
			},
			pageSizes: {
				default: function() {
					return [10,20,30,40]
				}
			},
			pageSize: {
				default: 10
			},
			pageTotal: {
				default: 0
			},
			dataList: {
				default: function(){
					return []
				}
			},
			loading: {
				default: false
			},
			highlightCurrentRow: {
				default: false
			},
			isShowPage:{
				default:true
			},
			tableBorder:{
				default:false
			}
		},
		methods: {
			handleSizeChange(val) {
				this.$emit('sizeChange', val)
			},
			handleCurrentChange(val) {
				this.$emit('currentChange', val)
			},
			handleSelectionChange(val) {
				this.$emit('selectionChange', val)
			},
			rowDBlclick(row){
				this.$emit('rowDBlclick', row)
			},
			cellClick(row, column){
				this.$emit('cellClick', [row, column])
			},
			tableRowClassName({row, rowIndex}) {
				if (row.rowEditable) {		          
		          if(row.rowError) {
		          	return 'error-row';
		          }else {
		          	return 'editable-row';
		          }
		        }
		        return '';
			},
			selectChange(val) {
				this.$emit('selectChange', val)
			}
		},
		beforeDestroy() {
			this.$emit('update:loading', false)
		}		
	}
</script>