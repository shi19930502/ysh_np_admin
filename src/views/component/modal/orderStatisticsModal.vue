<template>
	<el-dialog custom-class="jz-modal" :close-on-click-modal="false" width="1280px"  title="当日订单明细" :visible.sync="modal" :before-close='beforeClose'>
		<div class="page-khNolice">
            <iconBtn iconClass="el-icon-download" content="导出" @click="exportExcel" type="success" >导出</iconBtn>
			<elemTable :showPagination="false" :dataList="dataList" @sizeChange='handleSizeChange' @currentChange='handleCurrentChange' :currentPage='pagNum' :pageSizes='pageSizes' :pageSize='pageSize' :pageTotal='pageTotal'>
				<el-table-column prop="orderUmber" label="订单号">
					<template slot-scope="scope">
						<toolTip :content="scope.row.orderUmber">
							<span>{{scope.row.orderUmber}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="orderStatusId" label="下单金额">
					<template slot-scope="scope">
						<toolTip :content="scope.row.orderTotal">
							<span>{{Math.round(scope.row.orderTotal/100).toFixed(2)}}&nbsp;元</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="orderStatusId" label="分拣金额">
					<template slot-scope="scope">
						<toolTip :content="scope.row.sortingOrderTotal">
							<span>{{Math.round(scope.row.sortingOrderTotal/100).toFixed(2)}}&nbsp;元</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="buyerName" label="买方名称">
					<template slot-scope="scope">
						<toolTip :content="scope.row.buyerName">
							<span>{{scope.row.buyerName}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="sellerName" label="卖方名称">
					<template slot-scope="scope">
						<toolTip :content="scope.row.sellerName">
							<span>{{scope.row.sellerName}}</span>
						</toolTip>
					</template>
				</el-table-column>
				<el-table-column prop="orderStatusId" label="订单状态">
					<template slot-scope="scope">
						<span v-for="item in orderStateList">
				      <span v-if="scope.row.orderStatusId == item.key">{{item.value}}</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="paymentStatusId" label="付款状态">
					<template slot-scope="scope">
						<span v-for="item in payStateList">
				      <span v-if="scope.row.paymentStatusId == item.key">{{item.value}}</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="payType" label="支付类型">
					<template slot-scope="scope">
						<span v-for="item in payWayList">
				      <span v-if="scope.row.payType == item.key">{{item.value}}</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="shippingStatusId" label="物流状态">
					<template slot-scope="scope">
						<span v-for="item in LOGList">
				      <span v-if="scope.row.shippingStatusId == item.key">{{item.value}}</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="createdDate" label="下单时间">
					<template slot-scope="scope">
						<span>{{scope.row.createdDate}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button-group>
							<iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
						</el-button-group>
					</template>
				</el-table-column>

			</elemTable>
			<xsOrdergl :modal='xs_orderglModal' v-if='xs_orderglModal' @close='xs_orderglModalClose' :tableRow='table'></xsOrdergl>
		</div>
	</el-dialog>
</template>
<script>
	import local from '../../../local.js'
	import mixin from '../../../mixin/mixin.js'
	import xsOrdergl from './xs_orderglModal.vue'
	export default {
		mixins: [mixin],
		props: {
			/*modal: {
				default: false,
			},*/
			tableRow: {
				default: {},
			}
		},
		components: {
			xsOrdergl
		},
		data() {
			return {
				modal: false,
				searchForm: {
					sellerId: '', //如果是运营商 默认查询其所有子渠道
					createdDate: ''
				},
				orderStateList: [], //订单状态
				LOGList: [], //物流状态
				payStateList: [], //付款状态 
				payWayList: [], //支付类型
				dataList: [],
				channelList: [], //渠道
				tempO: {}, //临时存放订单对象
				xs_orderglModal: false,
				orderId: '',
				paymentStatusId: null,
				selectClearable: true,
				form: {},
				table: {}
			}
		},
		created() {
			this.init();
		},
		mounted() {
			//this.form = this.tableRow;
			//this.searchTable();
		},
		methods: {
			show(row) {
				this.form = row;
				this.modal = true;
				this.init(); 
				this.searchTable(row);
			},
			init() {
				var vm = this;
				this._ajax({
						url: this.rootAPI,
						name: 'datadic/list',
						loading: 'dataLoading'
					})
					.then((function(d) {
						d.aaData.map(function(el) {
							if(el.dataType == 'ORDER_STATUS') {
								vm.orderStateList.push(el);
							}
							if(el.dataType == 'TRANSPORT_STATUS') {
								vm.LOGList.push(el);
							}
							if(el.dataType == 'PAY_STATUS') {
								vm.payStateList.push(el);
							}
							if(el.dataType == 'PAY_WAY') {
								vm.payWayList.push(el);
							}
						})
					}).bind(this))

				return this._ajax({
						url: this.rootAPI,
						name: 'channel/list',
						param: {
							code: local.get('sessionUser').typeCode
						},
						loading: 'dataLoading'
					})
					.then((function(d) {
						d.aaData.map(function(el) {
							vm.channelList.push(el);
						})
					}).bind(this))
			},
			searchTable(row) {
				if(row == null){
					row = this.form;
				}else{
					this.orderStateList =[];
					this.payStateList =[];
					this.payWayList =[];
					this.LOGList =[];
				}
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					createdDate: row.orderDate,
					sellerId: this.form.sellerId, 
					buyerId: this.form.buyerId, 
				})
				this._ajax({
						url: this.rootAPI,
						name: 'order/queryOrderBySellerIdAndCreateTimeWithoutPage',
						param: this.searchForm,
						loading: 'dataLoading'
					})
					.then(this.renderTable)
			},
			search() {
				this.searchTable()
			},
			changeMobile(row) {
				// if(!this.regFloat.test(row.mobile)) {
				// 	console.log(this.regFloat.test(row.mobile))
				// 	row.mobile = 0
				// }
			},
			cellClick() {

			},
			beforeClose(done) {
				this.$emit('close')
				done()
			},
			xs_orderglModalClose() {
				this.xs_orderglModal = false;
			},
			lookOver(row) {
                row.orderDate = this.form.orderDate;
                this.table = row;
				this.xs_orderglModal = true;
			},
			selectionChange(val) {},
            exportExcel() {
                var fields = ['orderUmber', 'orderTotal', 'sortingOrderTotal', 'buyerName', 'sellerName', 'orderStatusId', 'paymentStatusId', 'payType', 'shippingStatusId', 'createdDate'],
                    filedsName = ['', '', "", '', '', '', '', '', '订单日期:', this.form.orderDate],
                    // filedsName = ['订单号', "下单金额(元)", "分拣金额(元)", '买方名称', '卖方名称', '订单状态', '付款状态', '支付类型', '物流状态', '下单时间'],
                    fileName = this.form.orderDate + '订单明细统计表';
                let user = local.get('sessionUser');
                this.sellerId = user.typeCode;
                var param = Object.assign({}, {
                    sellerId: this.sellerId,
                    createdDate: this.form.orderDate
                })
                this._ajax({
                    url: this.rootAPI + 'order/queryOrderBySellerIdAndCreateTimeWithoutPage',
                    param: param,
                    arr: true
                }).then((data)=>{
                    let table = data.aaData;
                    let orderTotalSum = 0;
                    let sortingOrderTotalSum = 0;
                    table.forEach(function (row) {
                        orderTotalSum += row.orderTotal;
                        sortingOrderTotalSum += row.sortingOrderTotal;
                        row.orderTotal = (row.orderTotal / 100).toFixed(2)
                        row.sortingOrderTotal = (row.sortingOrderTotal / 100).toFixed(2)
                        let orderStatus = this.orderStateList.find((item) => {
                            return item.key === row.orderStatusId;
                        });
                        let paymentStatus = this.payStateList.find((item) => {
                            return item.key === row.paymentStatusId;
                        });
                        let payType = this.payWayList.find((item) => {
                            return item.key === row.payType;
                        });
                        let shippingStatus = this.LOGList.find((item) => {
                            return item.key === row.shippingStatusId;
                        });
                        row.orderStatusId = orderStatus.value;
                        row.paymentStatusId = paymentStatus.value;
                        row.payType = payType.value;
                        row.shippingStatusId = shippingStatus.value;
                    }.bind(this));
                    let header = [{
                        orderUmber: "",
                        orderTotal: "",
                        sortingOrderTotal: "",
                        buyerName:  "",
                        sellerName: "",
                        orderStatusId: "",
                        paymentStatusId: "",
                        payType: "",
                        shippingStatusId: "",
                        createdDate: "",
                    },{
                        orderUmber: "订单号",
                        orderTotal: "下单金额(元)",
                        sortingOrderTotal: "分拣金额(元)",
                        buyerName:  "买方名称",
                        sellerName: "卖方名称",
                        orderStatusId: "订单状态",
                        paymentStatusId: "付款状态",
                        payType: "支付类型",
                        shippingStatusId: "物流状态",
                        createdDate: "下单时间",
                    }]
                    let footer = [{
                        orderUmber: "订单金额合计:",
                        orderTotal: (orderTotalSum/100).toFixed(2) + '元',
                        shippingStatusId: "分拣金额合计:",
                        createdDate: (sortingOrderTotalSum/100).toFixed(2) + '元',
                    }]
                    header = header.concat(table);
                    header = header.concat(footer);
                    this._exportExcel(header, fields, filedsName, fileName)
                })
            },
            modalClose() {
                this.modalParams = {}
                this.xs_orderglModal = false;
                this.modalType = 'add'
            },
		}
	}
</script>