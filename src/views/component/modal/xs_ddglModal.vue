<template>
	<el-dialog custom-class="jz-modal" :width="modalWidth" title="订单详情" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<elemTable 
			:dataList="dataList" 
			@sizeChange='handleSizeChange' 
			@currentChange='handleCurrentChange' 
			:currentPage='pagNum' 
			:pageSizes='pageSizes' 
			:pageSize='pageSize' 
			:pageTotal='pageTotal' >
			<el-table-column show-overflow-tooltip property="productName" label="商品名称" min-width="150"></el-table-column>
	    	<el-table-column show-overflow-tooltip property="price" label="单价" min-width="120">
	    		<template slot-scope="scope">  
	    			<inputItem :disabled='orderStatusId!=1' @change='priceInputChange(scope.row)' :value.sync='scope.row.price' ></inputItem>
	    		</template>
	    	</el-table-column>
	    	<el-table-column show-overflow-tooltip property="quantity" label="下单量" min-width="120"></el-table-column>
	    	<el-table-column show-overflow-tooltip property="itemTotal" label="金额" min-width="120"></el-table-column>
	    	<el-table-column show-overflow-tooltip property="sortingWeight" label="成交量" min-width="120">
	    		<template slot-scope="scope">  
	    			<inputItem :disabled='orderStatusId!=1' @change='sortWeightChange(scope.row)' :value.sync='scope.row.sortingWeight' ></inputItem>
	    		</template>
	    	</el-table-column>
	    	<el-table-column show-overflow-tooltip property="sortingTotal" label="成交金额" min-width="120"></el-table-column>
	    	<el-table-column show-overflow-tooltip property="inspectedWeight" label="验收量" min-width="120">
	    		<template slot-scope="scope">  
	    			<inputItem :disabled='orderStatusId!=3' :value.sync='scope.row.inspectedWeight' ></inputItem>
	    		</template>
	    	</el-table-column>
	    	<el-table-column show-overflow-tooltip property="inspectedTotal" label="验收金额" min-width="120"></el-table-column>
	    	<el-table-column show-overflow-tooltip property="comment" label="备注信息" min-width="120"></el-table-column>
		</elemTable>
		<div class="thr_money">
			<div>订单金额：{{indent_money}}</div>
			<div>成交金额：{{sortingTotal_money}}</div>
			<div>实付金额：{{payment_money}}</div>
		</div>
		<div class="buy_message">
			<div class="label">买家留言：</div>
	    	<inputItem :disabled='textareaDisabled' type='textarea' :value.sync='textarea' ></inputItem>
		</div>
		<div slot="footer" v-if='orderStatusId != 0' class="dialog-footer flex-x-end">
            <elBtn @click="submit" text="确认配送" type="primary"></elBtn>
        </div>
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
			pageSizes:[10,20,30],//40页的时候有问题
			indent_money:'--',
			sortingTotal_money:'--',
			payment_money:'--',
			textarea:'',
			textareaDisabled:true,
		}
	},
	props: {
		modal: {
			type: Boolean,
			default: false
		},
		orderStatusId:{
			default: 0,
		},
		paymentStatusId:{
			default: 0,
		},
		orderId: {
			default:''
		}
	},
	mounted(){
		this.searchTable();	
	},
	methods:{
		searchTable(){
			this._ajax({url:this.tootAPI,name:'orderitem/list',
				param:{
					orderId:this.orderId
				}
			}).then(this.renderTable)
		},
		beforeClose(done) {
			this.$emit('close')
			done()
		},
		changeOrderItemState(param){
				this._ajax({url: this.rootAPI + 'orderitem/update', param: param, loading: 'dataLoading'})
				.then((function(d) { 
						if(d.state==0){
                        	this.$message({ type: 'success', message: '操作成功！' }); 
                        	this.searchTable();
						}else{
							this.$message({ type: 'info', message: '操作失败! '+d.msg }); 
						}
                }).bind(this))
		},
		//改变价格
		priceInputChange(row){
			if(this._ruleTwoFloat(row.price)){
				row.price=this._ruleTwoFloat(row.price)
				this.changeOrderItemState(row);
			}
		},
		//填写分拣量
		sortWeightChange(row){
			
		},
		submit(){
			var orderStatusId=this.orderStatusId
			if(this.orderStatusId==3 && this.paymentStatusId==1){
				orderStatusId=this.orderStatusId+1
			}
			this.$emit('close',orderStatusId+1)	//确认后更改订单的状态
		}
	},
}
</script>