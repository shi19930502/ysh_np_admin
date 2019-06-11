<template>
	<el-dialog custom-class="jz-modal order-modal" :close-on-click-modal="false"  :modal="false" width="1270px" title="订单详情" :visible="modal" :before-close='beforeClose'>
        <el-form class="modal-form" v-if="modal" :model="form"  :inline="true"  label-width="120px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="订单号">
						<inputItem :disabled='formDisabled' :value.sync='form.orderUmber'></inputItem>	
			    	</el-form-item>
			   </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="采购商名称">
						<inputItem :disabled='formDisabled' :value.sync='form.buyerName'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="物流方式">
						<inputItem :disabled='formDisabled' :value.sync='form.distributionTypeName'></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="预计配送时间">
						<inputItem :disabled='formDisabled' :value.sync='form.distributionTime'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="支付方式">
						<inputItem :disabled='formDisabled' :value.sync='form.payWayStatusName'></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="支付流水号">
						<inputItem :disabled='formDisabled' :value.sync='form.paymentSerialNumber'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="订单金额(元)">
						<inputItem :disabled='formDisabled' :value.sync="form.orderTotal"></inputItem>
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="分拣金额(元)">
						<inputItem :disabled='formDisabled' :value.sync="form.sortingOrderTotal"></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="验收金额(元)">
						<inputItem :disabled='formDisabled' :value.sync="form.inspectedOrderTotal"></inputItem>	
			    	</el-form-item>
			   </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">					
				 	<el-form-item label="备注">
				 		<inputItem type='textarea' :disabled='formDisabled' :value.sync='form.comment'></inputItem>								
			    	</el-form-item>		    	
			   </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="form.orderStatusId === '7' || form.orderStatusId === '6'">
			    	<el-form-item label="取消原因">
						<inputItem type='textarea' :disabled='formDisabled' :value.sync='form.cancelReason'></inputItem>	
			    	</el-form-item>
			   	</el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="">
                        <iconBtn iconClass="el-icon-download" content="导出" @click="exportExcel" type="success" >导出</iconBtn>
                    </el-form-item>
                </el-col>
			</el-row>
		</el-form>
		
		<elemTable 
			:dataList="dataList" 
			@sizeChange='handleSizeChange' 
			@currentChange='handleCurrentChange' 
			:currentPage='pagNum' 
			:pageSizes='pageSizes' 
			:pageSize='pageSize' 
			:pageTotal='pageTotal' >
			<el-table-column show-overflow-tooltip property="productName" label="商品名称" min-width="150"></el-table-column>
			<el-table-column show-overflow-tooltip property="skuName" label="规格" min-width="60"></el-table-column>
			<el-table-column show-overflow-tooltip property="oriPrice" label="基本价格" width="150">
		      	<template slot-scope="scope">
		    		<span>{{_priceFormat(scope.row.oriPrice)+' 元/'+scope.row.baseMeasureName}}</span>
		      	</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="price" label="实际价格" width="150">
				<template slot-scope="scope">
		    		<span>{{_priceFormat(scope.row.price)+' 元/'+scope.row.skuMeasureName}}</span>
		      	</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="quantity" label="需求量" width="150">
				<template slot-scope="scope">
		    		<span v-if="scope.row.quantity != null">{{scope.row.quantity+' '+scope.row.skuMeasureName}}</span>
		      </template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="itemTotal" label="需求金额" width="150">
				<template slot-scope="scope">
		    		<span v-if="scope.row.itemTotal != null">{{_priceFormat(scope.row.itemTotal)+' 元'}}</span>
		      	</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="sortingWeight" label="分拣量" min-width="110">
				<template slot-scope="scope">
		    		<span v-if="scope.row.sortingWeight != null">{{scope.row.sortingWeight+' '+scope.row.skuMeasureName}}</span>
		      </template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="sortingTotal" label="分拣金额" min-width="110">
				<template slot-scope="scope">
		    		<span v-if="scope.row.sortingTotal != null">{{_priceFormat(scope.row.sortingTotal)+' 元'}}</span>
		      	</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="inspectedWeight" label="验收量" min-width="110">
				<template slot-scope="scope">
		    		<span v-if="scope.row.inspectedWeight != null">{{scope.row.inspectedWeight+' '+scope.row.skuMeasureName}}</span>
		      </template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="inspectedTotal" label="验收金额（元）" min-width="110">
				<template slot-scope="scope">
		    		<span v-if="scope.row.inspectedTotal != null">{{_priceFormat(scope.row.inspectedTotal)+' 元'}}</span>
		      	</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip property="batchId" label="批次号" min-width="90"></el-table-column>
			<el-table-column show-overflow-tooltip property="suyuanCode" label="溯源码" min-width="120"></el-table-column>
			<el-table-column show-overflow-tooltip property="comment" label="备注" min-width="150"></el-table-column>
		</elemTable>
	</el-dialog>
</template>

<script>
import mixin from '../../../mixin/mixin.js' //公共方法，包括主要的ajax
export default {
	mixins: [mixin],
	props:{
		modal:{
			default:false,
		},
		tableRow:{
			default:function(){
				return {}
			},
		}
	},
	data(){
		return{
			dataList:[],
			formDisabled:true,
			form:{},
		}
	},
	mounted(){
		Object.assign(this.form, this.tableRow)
 		Object.assign(this.form, {
            orderTotal: this._priceFormat(this.form.orderTotal),
            sortingOrderTotal: this._priceFormat(this.form.sortingOrderTotal),
            inspectedOrderTotal: this._priceFormat(this.form.inspectedOrderTotal)
        })
        var str = "", el = this.form
		if(el.distributionTimeBegin) {
			if(el.distributionTimeBegin.split(":").length > 0) {
				str = str + el.distributionTimeBegin.split(":")[0] + ":" + el.distributionTimeBegin.split(":")[1]
			}else {
				str = str + el.distributionTimeBegin
			}	            		
		}
		if(el.distributionTimeEnd) {
			if(el.distributionTimeEnd.split(":").length > 0) {
				str = str + "-" + el.distributionTimeEnd.split(" ")[1].split(":")[0] + ":" + el.distributionTimeEnd.split(" ")[1].split(":")[1]
			}else {
				str = str + "-" + el.distributionTimeEnd
			}	            		
		}
		el.distributionTime = str
		this.searchTable();	
	},
	methods:{
		searchTable(){
			this._ajax({url:this.
				tootAPI,name:'orderitem/list',
				param:{orderId: this.form.id,pageNum: this.pageNum,pageSize: this.pageSize}
			}).then(this.renderTable)
		},
		beforeClose(done) {
			this.$emit('close')
			done()
		},
        exportExcel() {
        	var orderUmber = this.form.orderUmber || ''
        	var buyerName = this.form.buyerName || ''
        	var sellerName = this.form.sellerName || ''
        	var orderDate = this.form.orderDate || ''
            var fields = ['productName', 'skuName', 'oriPrice', 'price', 'quantity', 'itemTotal', 'sortingWeight', 'sortingTotal', 'batchId', 'suyuanCode', 'comment'],
                filedsName = ['订单号:', orderUmber, '', '采购商名称:', buyerName, '', "供应商名称:", sellerName, "", '下单日期:', orderDate],
                // filedsName = ['商品名称', '规格', '基本价格', '实际价格', '需求量', '需求金额(元)', "分拣量", "分拣金额(元)","批次号", '溯源码',"备注"],
                fileName = this.form.orderUmber + '订单详情统计表';

            this._ajax({
                url: this.rootAPI + 'orderitem/getOrderItemList',
                param:{orderId: this.form.id}
            }).then((data)=>{
                let table = data.aaData;
                let orderTotalSum = 0;
                let sortingOrderTotalSum = 0;
                
                table.forEach(function (row) {
                    row.oriPrice = row.oriPrice === null ? '' : this._priceFormat(row.oriPrice) + ' 元/' + row.baseMeasureName;
                    row.price = row.price === null ? '' : this._priceFormat(row.price) + ' 元/' + row.skuMeasureName;
                    row.quantity = row.quantity === null ? '' : row.quantity+' '+row.skuMeasureName;
                    row.itemTotal = row.itemTotal === null ? '' : this._priceFormat(row.itemTotal) + ' 元';
                    row.sortingWeight = row.sortingWeight === null ? '' : row.sortingWeight + ' ' + row.skuMeasureName;
                    row.sortingTotal = row.sortingTotal === null ? '' : this._priceFormat(row.sortingTotal) + ' 元';
                    row.batchId = row.batchId === null ? '' : row.batchId + ';'
                    row.suyuanCode = row.suyuanCode === null ? '' : row.suyuanCode + ';'
                }.bind(this));
                let header = [{
                    productName: "预计配送时间:",
                    skuName: this.form.distributionTimeBegin === null ? '' : this.form.distributionTimeBegin,
                    oriPrice: "",
                    price: "订单金额:",
                    quantity: this.form.orderTotal === null ? ''   + '元' : this.form.orderTotal + '元',
                    itemTotal: "",
                    sortingWeight: "分拣金额:",
                    sortingTotal: this.form.sortingOrderTotal === null ? ''  + '元' : this.form.sortingOrderTotal + '元',
                    batchId: "",
                    suyuanCode: "验收金额:",
                    comment: this.form.inspectedOrderTotal === null ? '' + '元' : this.form.inspectedOrderTotal + '元',
                },{
                    productName: "",
                    skuName: "",
                    oriPrice: "",
                    price: "",
                    quantity: "",
                    itemTotal: "",
                    sortingWeight: "",
                    sortingTotal: "",
                    batchId: "",
                    suyuanCode: "",
                    comment: "",
                },{
                    productName: "商品名称",
                    skuName: "规格",
                    oriPrice: "基本价格",
                    price: "实际价格",
                    quantity: "需求量",
                    itemTotal: "需求金额(元)",
                    sortingWeight: "分拣量",
                    sortingTotal: "分拣金额(元)",
                    batchId: "批次号",
                    suyuanCode: "溯源码",
                    comment: "备注",
                }];

                header = header.concat(table);
                this._exportExcel(header, fields, filedsName, fileName)
            })
        },
	},
}
</script>