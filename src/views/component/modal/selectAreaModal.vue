<template>
	<el-dialog custom-class="jz-modal" :width="modalWidth" title="选择区域" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<el-input placeholder="请输入区域名称" size='mini' @keyup.enter.native="searchArea" v-model="searchInput">
		    <el-button slot="append" @click='searchArea' icon="el-icon-search"></el-button>
		</el-input>
		<elemTable 
			:dataList="dataList" 
			@sizeChange='handleSizeChange' 
			@currentChange='handleCurrentChange' 
			@rowDBlclick='handRowDBlclick' 
			:currentPage='pagNum' 
			:pageSizes='pageSizes' 
			:pageSize='pageSize' 
			:pageTotal='pageTotal' >
			<el-table-column property="code" label="编码" min-width="200"></el-table-column>
	    	<el-table-column property="name" label="区域" min-width="150"></el-table-column>
		</elemTable>
	</el-dialog>
</template>

<script>
import mixin from '../../../mixin/mixin.js' //公共方法，包括主要的ajax
export default {
	mixins: [mixin],
	data(){
		return{
			dataList:[],
			searchInput:'',
			searchVal:'',
			pageSizes:[10,20,30],//40页的时候有问题
		}
	},
	props: {
		modal: {
			type: Boolean,
			default: false
		},
	},
	mounted(){
		this.searchTable();	
	},
	methods:{
		searchTable(){
			if(this.searchVal===''){
				this.searchVal = undefined;
			};
			this._ajax({url:this.tootAPI,name:'/areainfo/list',param:{name:this.searchVal}})
			.then(this.renderTable)
		},
		searchArea(){
			this.searchVal=this.searchInput
			this.pageNum=1;
			this.searchTable();
		},
		handRowDBlclick(rv){
			this.$emit('rowVal',rv)
			this.$emit('close',)
		},
		cancel(){
			this.$emit('close')
		},
		beforeClose(done) {
			this.cancel()
			done()
		},
	},
}
</script>