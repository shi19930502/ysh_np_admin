<template>
	<el-dialog custom-class="jz-modal dataCheck-modal" title="系统重复数据校验及详情" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-collapse v-model="activeNames">
		  	<el-collapse-item  name="1">
		  		<template slot="title">
			     	采购商供应商关注关系重复--{{dataListCount1}}条
			    </template>
			    <el-table :data="dataList1" style="width: 100%">
      				<el-table-column prop="sellerId" label="供应商备案用户id" width="180"></el-table-column>
      				<el-table-column prop="sellerName" label="供应商名称" width="380"></el-table-column>
      				<el-table-column prop="buyerId" label="采购商备案用户id" width="180"></el-table-column>
      				<el-table-column prop="buyerName" label="采购商名称" width="380"></el-table-column>
    			</el-table>
		  	</el-collapse-item>
		  	<el-collapse-item name="2">
			    <template slot="title">
			     	备案用户编码重复--{{dataListCount2}}条
			    </template>
			    <el-table :data="dataList2" style="width: 100%">
      				<el-table-column prop="customerId" label="备案用户id" width="180"></el-table-column>
      				<el-table-column prop="customerName" label="备案用户名称" width="380"></el-table-column>
    			</el-table>
		  	</el-collapse-item>
		  	<el-collapse-item name="3">
			   	<template slot="title">
			     	采购商商圈设置重复--{{dataListCount3}}条
			    </template>
			    <el-table :data="dataList3" style="width: 100%">
      				<el-table-column prop="merchantId" label="备案用户id" width="80"></el-table-column>
      				<el-table-column prop="merchantName" label="备案用户名称" width="350"></el-table-column>
      				<el-table-column prop="customerName" label="客户名称" width="350"></el-table-column>
      				<el-table-column prop="tel" label="客户手机号" width="180"></el-table-column>
      				<el-table-column prop="customerIndex" label="客户编码" width="100"></el-table-column>
    			</el-table>
		  	</el-collapse-item>
		  	<el-collapse-item name="4">
			    <template slot="title">
			     	备案用户渠道设置重复--{{dataListCount4}}条
			    </template>
			    <el-table :data="dataList4" style="width: 100%">
      				<el-table-column prop="merchantId" label="备案用户id" width="180"></el-table-column>
      				<el-table-column prop="merchantName" label="备案用户名称" width="380"></el-table-column>
    			</el-table>
		  	</el-collapse-item>
		  	<el-collapse-item name="5">
			    <template slot="title">
			     	采购商报价单设置重复--{{dataListCount5}}条
			    </template>
			    <el-table :data="dataList5" style="width: 100%">
      				<el-table-column prop="customerId" label="备案用户id" width="180"></el-table-column>
      				<el-table-column prop="customerName" label="备案用户名称" width="380"></el-table-column>
    			</el-table>
		  	</el-collapse-item>
		  	<el-collapse-item name="6">
			    <template slot="title">
			     	采购商商品收藏设置重复--{{dataListCount6}}条
			    </template>
			    <el-table :data="dataList6" style="width: 100%">
      				<el-table-column prop="f_created_person_id" label="采购商id" width="80"></el-table-column>
      				<el-table-column prop="f_created_person_name" label="采购商名称" width="300"></el-table-column>
      				<el-table-column prop="f_seller_name" label="被收藏商家名称" width="300"></el-table-column>
      				<el-table-column prop="f_product_name" label="被收藏的重复商品名称" width="200"></el-table-column>
      				<el-table-column prop="f_sku_name" label="被收藏的重复商品规格名称" width="200"></el-table-column>
    			</el-table>
		  	</el-collapse-item>
		  	<el-collapse-item name="7">
			    <template slot="title">
			     	供应商内还有采购商没有设置商圈--{{dataListCount7}}条
			    </template>
			    <el-table :data="dataList7" style="width: 100%">
      				<el-table-column prop="merchantId" label="供应商备案用户id" width="180"></el-table-column>
      				<el-table-column prop="merchantName" label="供应商备案用户名称" width="380"></el-table-column>
    			</el-table>
		  	</el-collapse-item>
		  	<el-collapse-item name="8">
			    <template slot="title">
			     	存在供应商没有店铺--{{dataListCount8}}条
			    </template>
			    <el-table :data="dataList8" style="width: 100%">
      				<el-table-column prop="customerId" label="备案用户id" width="180"></el-table-column>
      				<el-table-column prop="customerName" label="备案用户名称" width="380"></el-table-column>
    			</el-table>
		  	</el-collapse-item>
		</el-collapse>
	</el-dialog>
</template>
<script>
	import local from '../../../local.js'
	import mixin from '../../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				dataList1:[],
				dataListCount1:0,
				dataList2:[],
				dataListCount2:0,
				dataList3:[],
				dataListCount3:0,
				dataList4:[],
				dataListCount4:0,
				dataList5:[],
				dataListCount5:0,
				dataList6:[],
				dataListCount6:0,
				dataList7:[],
				dataListCount7:0,
				dataList8:[],
				dataListCount8:0,
			}
		},
		props: {
			modal: {
				default: false,
			},
		},
		mounted() {
			this.checkSuppliercollectionRepeat();
			this.checkCustomerCodeRepeat();
			this.checkCustomergroupmappingRepeat();
			this.checkMerchantchannelmappingRepeat();
			this.checkQuotationcustomermappingRepeat();
			this.checkProductcollectionRepeat();
			this.checkNoCustomergroup();
			this.checkNoStore();
			
		},
		methods: {
			checkSuppliercollectionRepeat() {
				this._ajax({url: this.rootAPI + 'commonDataCheck/checkSuppliercollectionRepeat', param: {}, loading: 'dataLoading'})
                .then((function(d) { 
                	this.dataList1 = d.aaData;
            		this.dataListCount1 = d.aaData.length
                }).bind(this))
			},
			checkCustomerCodeRepeat() {
				this._ajax({url: this.rootAPI + 'commonDataCheck/checkCustomerCodeRepeat', param: {}, loading: 'dataLoading'})
                .then((function(d) { 
                	this.dataList2 = d.aaData;
                	if(d.aaData.length == 1 && d.aaData[0] == null) {
                		this.dataListCount2 = 0
                	} else {
                		this.dataListCount2 = d.aaData.length
                	}
                }).bind(this))
			},
			checkCustomergroupmappingRepeat() {
				this._ajax({url: this.rootAPI + 'commonDataCheck/checkCustomergroupmappingRepeat', param: {}, loading: 'dataLoading'})
                .then((function(d) { 
                	this.dataList3 = d.aaData;
            		this.dataListCount3 = d.aaData.length
                }).bind(this))
			},
			checkMerchantchannelmappingRepeat() {
				this._ajax({url: this.rootAPI + 'commonDataCheck/checkMerchantchannelmappingRepeat', param: {}, loading: 'dataLoading'})
                .then((function(d) { 
                	this.dataList4 = d.aaData;
                	this.dataListCount4 = d.aaData.length
                }).bind(this))
			},
			checkQuotationcustomermappingRepeat() {
				this._ajax({url: this.rootAPI + 'commonDataCheck/checkQuotationcustomermappingRepeat', param: {}, loading: 'dataLoading'})
                .then((function(d) { 
                	this.dataList5 = d.aaData;
            		this.dataListCount5 = d.aaData.length
                }).bind(this))
			},
			checkProductcollectionRepeat() {
				this._ajax({url: this.rootAPI + 'commonDataCheck/checkProductcollectionRepeat', param: {}, loading: 'dataLoading'})
                .then((function(d) { 
                	this.dataList6 = d.aaData;
            		this.dataListCount6 = d.aaData.length
                }).bind(this))
			},
			checkNoCustomergroup() {
				this._ajax({url: this.rootAPI + 'commonDataCheck/checkNoCustomergroup', param: {}, loading: 'dataLoading'})
                .then((function(d) { 
                	this.dataList7 = d.aaData;
            		this.dataListCount7 = d.aaData.length
                }).bind(this))
			},
			checkNoStore() {
				this._ajax({url: this.rootAPI + 'commonDataCheck/checkNoStore', param: {}, loading: 'dataLoading'})
                .then((function(d) { 
                	this.dataList8 = d.aaData;
            		this.dataListCount8 = d.aaData.length
                }).bind(this))
			},
			beforeClose() {
				this.$emit('close')
			}
		}
	}
</script>
<style lang="sass">
	
</style>