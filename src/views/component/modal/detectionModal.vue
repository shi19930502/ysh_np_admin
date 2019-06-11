<template>
	<el-dialog custom-class="jz-modal detection-modal" :title="title" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<!--<el-row style="margin-top: -10px;">检验单主信息</el-row>-->
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="110px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="检验单号" prop="detecNum">
						<inputItem :value.sync="form.detecNum" :disabled="true"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="检验员" prop="checkUser">
						<inputItem :value.sync="form.checkUser"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="检验数量" prop="checkNum">
						<inputItem :value.sync="form.checkNum" :disabled="true"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="检验时间" prop="checkDate">
						<div class="block">
							<el-date-picker v-model="form.checkDate" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="备注" prop="checkDescription" class="row-block">
						<inputItem :value.sync="form.checkDescription" type="textarea"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="状态" prop="state">
						<!--<selectInput :value.sync="form.state" :disabled="true">
							<el-option
						      v-for="item in dataDic.auditorStatus"
						      :key="item.value"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>-->
						<span>{{_dicValue(form.state, dataDic.auditorStatus)}}</span>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<!--<el-row>检验单明细</el-row>-->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" v-if="addType" content="添加进场信息" @click="lookOver"></iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" @selectChange="selectChange" :highlightCurrentRow="true">
			<el-table-column width="70">
				<template slot-scope="scope">
					<elBtn @click="delDetail(scope.row)" text="删除" type="danger"></elBtn>
				</template>
			</el-table-column>
			<el-table-column prop="batchId" label="批次号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.batchId">
						<span>{{scope.row.batchId}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="inDate" label="进场日期" width="100">
				<template slot-scope="scope">
					<toolTip :content="scope.row.inDate">
						<span>{{scope.row.inDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="wsSupplierName" label="货主名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.wsSupplierName">
						<span>{{scope.row.wsSupplierName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="goodsCode" label="商品国标码">
				<template slot-scope="scope">
					<toolTip :content="scope.row.goodsCode">
						<span>{{scope.row.goodsCode}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="productName" label="商品名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.productName">
						<span>{{scope.row.productName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="sampleNo" label="样品编码">
				<template slot-scope="scope">
					<inputItem :value.sync="scope.row.sampleNo"></inputItem>
				</template>
			</el-table-column>
			<el-table-column prop="quarantineId" label="检疫证号">
				<template slot-scope="scope">
					<inputItem :value.sync="scope.row.quarantineId"></inputItem>
				</template>
			</el-table-column>
			<el-table-column prop="checkResult" label="检疫结果">
				<template slot-scope="scope">
					<selectInput :value.sync="scope.row.checkResult" :clearable="true">
						<el-option v-for="item in dataDic.detectionResult" :key="item.value" :label="item.value" :value="item.key">
						</el-option>
					</selectInput>
				</template>
			</el-table-column>
			<el-table-column prop="checkDate" label="检测时间" min-width="200" >
				<template slot-scope="scope">
					<el-date-picker v-model="scope.row.checkDate" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
				</template>
			</el-table-column>
		</elemTable>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel" text="取消"></elBtn>
			<elBtn @click="submit" text="提交" type="primary"></elBtn>
		</div>
		<detectionInmarkdetailModal :modal='detectionInmarkdetailModal' :parentDataList="dataList" v-if='detectionInmarkdetailModal' @close='detectionInmarkdetailModalClose'></detectionInmarkdetailModal>

	</el-dialog>
</template>
<script>
	import local from '../../../local.js'
	import mixin from '../../../mixin/mixin.js'
	import detectionInmarkdetailModal from './detectionInmarkdetailModal.vue'
	export default {
		mixins: [mixin],
		components: {
			detectionInmarkdetailModal
		},
		data() {
			var vm = this
			return {
				form: {
					id: null,
					detecNum: '',
					checkUser: '',
					checkNum: '',
					checkDate: null,
					checkDescription: '',
					state: 1,
					createdPersonId: '',
					createdPersonName: '',
					lastModifyPersonId: '',
					lastModifyPersonName: '',
					channelCode: '',
				},
				rules: {
					//报价基础信息
					checkUser: [{
						required: true,
						message: '检验员必填',
						trigger: 'blur'
					}, this._ruleLength(50)],
					checkDescription: [{}, this._ruleLength(200)],
					checkDate: [{
						required: true,
						message: '检验时间必填',
					}],
				},
				inmarkdetailList: [],
				inmarketdetailId: '',
				dataList: [],
				detectionInmarkdetailModal: false,
				modal: false,
				addType:true,
				detectionModalType:'add',
				title:'新增检验检疫',
			}
		},
		props: {
			detection: {
				default: {}
			},
			dataDic: {
				default: {}
			}
		},
		mounted() {
			//this.getInitData();
			//Object.assign(this.form, this.detection);
		},
		methods: {
			show(row) {
				if(row != null) {
					Object.assign(this.form, row);
					this.addType = false;
					this.detectionModalType === 'edit'
					this.title = "检验检疫编辑";
				}else {
					this.detectionModalType === 'add'
					this.addType = true;
					this.title = "新增检验检疫";
					this.form = {};
				}
				this.dataList = [];
				this.getInitData();
				this.modal = true;
			},
			getInitData() {
				//查询自己渠道下的进场数据
				let user = local.get('sessionUser');
				let channelId = user.typeCode
				if(channelId == '001' || channelId == '') {
					//超级管理员
					channelId = '';
				}
				//查询进场数据
				/*this._ajax({url: this.rootAPI + 'inmarketdetail/listUnionMain', param: {channelId : channelId}, loading: 'dataLoading'})
				.then((function(d) {
					this.inmarkdetailList = d.aaData;
				}).bind(this))*/
				//查询检验检疫明细
				var vm = this;
				if(!this.addType) {
					return this._ajax({
						url: this.rootAPI + 'detectioninfo/list',
						param: {
							'mainId': this.form.id
						},
						loading: 'dataLoading'
					}).then((function(d) {
						let data = d.aaData
					 	$.each(data, function(i, obj) {
							obj.batchId= obj.batchNo,
							obj.wsSupplierName = obj.sellerName;
							obj.goodsCode = obj.productCode
							vm.dataList.push(obj);
						});
						if(data.length > 0) {
							this.pageTotal = d.dataCount
						}else {
							this.pageTotal = 0
						}
					}).bind(this))
				}
			},
			cancel() {
				this.$emit('close')
			},
			submit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						let o = {},
							method = 'detectionmain/createOrUpdateByJson';
						let id = this.form.id;
						let data = this.dataList;
						if(data.length == 0) {
							this.$message({
								type: 'warning',
								message: '请添加检验检疫明细'
							});
							return;
						}
						let flag = false
						let flag1 = false
						let flag2 = false
						let flag3 = false
						var slow = '',plow = '';
						for(var i = 0;i < data.length ; i++){
							if(this.form.checkDate && data[i].checkDate) {
								var time1 = new Date(this.form.checkDate.replace("-", "/").replace("-", "/"));
								var time2 = new Date(data[i].checkDate.replace("-", "/").replace("-", "/"));
								if(time1 > time2){
									this.$message({
										type: 'warning',
										message: '明细中的检验日期不能早于主信息的检验日期'
									});
									return;
								}
							}
							if (data[i].sampleNo && data[i].sampleNo.length > 20){ 
								this.$message({
									type: 'warning',
									message: '明细中的样品编码长度不能大于20个字符'
								});
								return;
							};
							if (data[i].sampleNo == null || data[i].sampleNo.length <= 0){
								this.$message({
									type: 'warning',
									message: '明细中的样品编码不能为空'
								});
								return;
							};
							if(!data[i].quarantineId || (data[i].quarantineId && data[i].quarantineId.length > 20)){
								this.$message({
									type: 'warning',
									message: '明细中的检疫证号不能为空且长度不能大于20个字符'
								});
								return;
							};
							
							//判断样品编码和检疫证号是否重复
							if(slow.indexOf(data[i].sampleNo) > -1){
								this.$message({
									type: 'warning',
									message: '样品编码重复：'+data[i].sampleNo
								});
								return;
							}
							if(plow.indexOf(data[i].quarantineId) > -1){
								this.$message({
									type: 'warning',
									message: '检疫证号重复：'+data[i].quarantineId
								});
								return;
							}
							slow = slow +"|"+data[i].sampleNo+"|";
							plow = plow +"|"+data[i].quarantineId+"|";
						}
						o = {
							detecNum: this.form.detecNum,
							checkUser: this.form.checkUser,
							checkNum: this.dataList.length,
							checkDate: this.form.checkDate,
							checkDescription: this.form.checkDescription,
							state: this.form.state,
							detectioninfoList: this.dataList,
							id: this.form.id
						}
						let user = local.get('sessionUser');
						if(this.addType) {
							o.id = null;
							o.createdPersonId = user.userId;
							o.createdPersonName = user.nickName;
							o.channelCode = user.typeCode;
						} else if(!this.addType) {
							o.lastModifyPersonId = user.userId;
							o.lastModifyPersonName = user.nickName;
						}
						o = JSON.stringify(o);
						this._ajax({
								url: this.rootAPI + method,
								param: {
									"jsonStr": o
								}
							})
							.then((function(d) {
								if(d.state == 0) {
									this.$message({
										type: 'success',
										message: '操作成功'
									});
									this.$emit('submit')
								} else {
									this.$message({
										type: 'failure',
										message: '操作失败:' + d.msg
									});
								}
							}).bind(this))
					}
				})
			},
			beforeClose(done) {
				this.$emit('close')
				done()
			},
			closeModal() {
				this.modal = false
			},
			addDetail() {
				let id = this.inmarketdetailId;
				if(id) {
					let data = this.dataList;
					let flag1 = false;
					$.each(this.inmarkdetailList, function(i, obj) {
						let flag = true;
						//校验重复数据,不允许重复添加
						$.each(data, function(j, obj1) {
							if(obj1.inmarketId == obj.id) flag = false;
						});
						if(flag && obj.id == id) {
							//添加数据的时候进行数据转义
							let dataTemp = {
								batchNo: obj.batchId,
								inDate: obj.inDate,
								inmarketId: obj.id,
								sellerCode: obj.wholesalerId,
								sellerName: obj.wholesalerName,
								productCode: obj.goodsCode,
								productName: obj.goodsName,
								sampleNo: obj.sampleNo,
								quarantineId: obj.quarantineId == null ? '' : obj.quarantineId,
								checkResult: obj.checkResult,
								checkDate: obj.checkDate,
								state: 1
							}
							data.push(dataTemp);
						}
						if(!flag && obj.id == id) {
							flag1 = true;
						}
					});
					if(flag1) {
						this.$message({
							type: 'info',
							message: '表格里有该数据，请重新选择'
						});
					}
					this.dataList = data;
					this.setCheckNum();
				} else {
					this.$message({
						type: 'info',
						message: '请选择进场信息'
					});
				}
			},
			delDetail(o) {
				this.deleteArr(this.dataList, o);
				this.setCheckNum();
			},
			//删除表格内数据
			deleteArr(_arr, _obj) {
				let len = _arr.length;
				let index;
				for(var i = 0; i < len; i++) {
					if(_arr[i] == _obj) {
						index = parseInt(i);
					}
				}
				_arr.splice(index, 1);
			},
			setCheckNum() {
				this.form.checkNum = this.dataList.length;
			},
			/*进场明细弹出框*/
			detectionInmarkdetailModalClose(done) {
				let o = {
					id : done
				}
				var vm = this;
				this._ajax({
						url: this.rootAPI + 'inmarketdetail/queryListByids',
						param: {
							'ids': JSON.stringify(o)
						},
						loading: 'dataLoading'
				}).then((function(d) {
					 	let data = d.aaData
					 	$.each(data, function(i, obj) {
							obj.checkResult = 1;
							obj.checkDate =  vm.getToday;
							obj.sellerCode = obj.wholesalerId;
							obj.sellerName = obj.wholesalerName;
							obj.batchNo= obj.batchId;
							obj.inDate= obj.inDate;
							obj.inmarketId= obj.id;
							obj.sellerCode= obj.wholesalerId;
							obj.sellerName= obj.wholesalerName;
							obj.productCode= obj.productCode;
							obj.productName= obj.productName;
							obj.sampleNo= obj.sampleNo;
							obj.quarantineId= obj.quarantineId == null ? '' : obj.quarantineId;
							obj.checkResult= obj.checkResult;
							obj.checkDate= obj.checkDate;
							obj.state= 1
							vm.dataList.push(obj)
						});
						this.pageTotal = this.dataList.length;
						this.detectionInmarkdetailModal = false;
				}).bind(this))
			},
			lookOver() {
				this.detectionInmarkdetailModal = true;
			}
			
		}
	}
</script>
<style lang="sass">
	.detection-modal {
		.row-block {
			.el-form-item__content {
				width: calc(100% - 110px);
				&>div {
					width: 100%;
				}
			}
		}
	}
</style>