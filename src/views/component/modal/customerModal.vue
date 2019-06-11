<template>
	<el-dialog custom-class="jz-modal customer-modal" :title="customerModalType === 'add' ? '新增客户' : '客户编辑'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="基本信息" name="first">
		    	<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="110px">
		            <el-row>
		                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="渠道" prop="channelCode" >
		                        <selectInput :value.sync="form.channelCode" @selectChange="channelChange" :disabled="typeDisabled">
									<el-option
								      v-for="item in channelList"
								      :key="item.name"
								      :label="item.name"
								      :value="item.code">
								    </el-option>
								</selectInput>
		                    </el-form-item>
		                </el-col>
		                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="所属市场" prop="marketId" >
		                        <selectInput :value.sync="form.marketId" :filterable="true" @selectChange="marketChange" :disabled="typeDisabled">
									<el-option
								      v-for="item in marketList"
								      :key="item.marketName"
								      :label="item.marketName"
								      :value="item.marketCode">
								    </el-option>
								</selectInput>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		            	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" >
		                    <el-form-item label="经营户名称" prop="name">
							    <inputItem :value.sync="form.name"></inputItem>
		                    </el-form-item>
		                </el-col>
		                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="手机号码" prop="tel">
							    <inputItem :value.sync="form.tel"></inputItem>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="经营户类型" prop="type">
		                        <selectInput :value.sync="form.type" :disabled="typeDisabled" @selectChange="typeSelectChange">
									<el-option
								      v-for="item in dataDic.customerType"
								      :key="item.key"
								      :label="item.value"
								      :value="item.key">
								    </el-option>
								</selectInput>
		                    </el-form-item>
		                </el-col>
		                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="经营户性质" prop="property" >
		                        <selectInput :value.sync="form.property" >
									<el-option
								      v-for="item in dataDic.customerProperty"
								      :key="item.key"
								      :label="item.value"
								      :value="item.key">
								    </el-option>
								</selectInput>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		            	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="是否分拣" prop="isSorter">
							    <selectInput :value.sync="form.isSorter" :disabled="isSorterDisabled">
									<el-option
								      v-for="item in dataDic.whether"
								      :key="item.value"
								      :label="item.value"
								      :value="item.key">
								    </el-option>
								</selectInput>
		                    </el-form-item>
		                </el-col>
		                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="是否配送" prop="isDistribution">
							    <selectInput :value.sync="form.isDistribution" :disabled="isDistributionDisabled">
									<el-option
								      v-for="item in dataDic.whether"
								      :key="item.value"
								      :label="item.value"
								      :value="item.key">
								    </el-option>
								</selectInput>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		            	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="证件号" prop="regId">
		                        <inputItem :value.sync="form.regId"></inputItem>
		                    </el-form-item>
		                </el-col>
		                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="法人代表" prop="legalpepresent" >
		                        <inputItem :value.sync="form.legalpepresent"></inputItem>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		            	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="自由选择供应商" prop="isChoiceSupplier">
							    <selectInput :value.sync="form.isChoiceSupplier" :disabled="true">
									<el-option
								      v-for="item in dataDic.whether"
								      :key="item.value"
								      :label="item.value"
								      :value="item.key">
								    </el-option>
								</selectInput>
		                    </el-form-item>
		                </el-col>
		            	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="备案时间" prop="recordDate">
		                    	<div class="block">
									<el-date-picker :readonly='true' v-model="form.recordDate" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期">
									</el-date-picker>
								</div>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		            	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
		                    <el-form-item label="助记码" prop="mnemonic">
							    <inputItem :value.sync="form.mnemonic"></inputItem>
		                    </el-form-item>
		                </el-col>
		                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" >
		                    <el-form-item label="微信openId" prop="wxopenid">
							    <inputItem :value.sync="form.wxopenid" ></inputItem>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" >
		                    <el-form-item label="积分" prop="score">
							    <inputItem :value.sync="form.score" :disabled="true"></inputItem>
		                    </el-form-item>
		               </el-col>
		               <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="sysId == 0">
		                    <el-form-item label="有效期天数" prop="validDay">
							    <inputItem :value.sync="form.validDay" ></inputItem>
		                    </el-form-item>
		               </el-col>
		            </el-row>
		            <el-row>
		            	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="this.customerModalType === 'edit'">
		                    <el-form-item label="经营户编码" prop="code">
							    <inputItem :value.sync="form.code" :disabled="true"></inputItem>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		            <el-row>
		                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
		                    <el-form-item label="地址" prop="address" class="row-block">
		                        <inputItem :value.sync="form.address" type="textarea"></inputItem>
		                    </el-form-item>
		                </el-col>
		                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
		                    <el-form-item label="备注" prop="remark" class="row-block">
							    <inputItem :value.sync="form.remark" type="textarea"></inputItem>
		                    </el-form-item>
		                </el-col>
		            </el-row>
		        </el-form>              
		        <div class="dialog-footer flex-x-end">
		            <elBtn @click="cancel" text="取消">取消</elBtn>
		            <elBtn @click="submit" text="提交" type="primary">提交</elBtn>
		        </div>
		    </el-tab-pane>
		    <el-tab-pane label="供应商设置" name="second" v-if="secondEnabled">
		    	<div style="text-align: center">
				    <el-transfer
					  style="text-align: left; display: inline-block"
					  v-model="selectDataKeyList"
					  filterable
					  :render-content="renderFunc"
					  :titles="['全部供应商', '已关联供应商商家']"
					  :button-texts="['删除关联', '添加关联']"
					  :format="{
					    noChecked: '${total}',
					    hasChecked: '${checked}/${total}'
					  }"
					  @change="handleChange"
					  :data="allDataList">
				    </el-transfer>
				</div>
				<!--<div class="dialog-footer flex-x-center">
					<elBtn @click="perfectSeller"  text="补齐与供应商关联关系" type="primary">补齐供应商关联关系</elBtn>
			    	<elBtn @click="perfectSellerQuotation"  text="补齐供应商报价单客户数据" type="primary">补齐对应供应商报价单数据</elBtn>
			   </div>-->
		    </el-tab-pane>
		    <el-tab-pane label="采购商设置" name="third" v-if="thirdEnabled">
		    	<div style="text-align: center">
				    <el-transfer
					  style="text-align: left; display: inline-block"
					  v-model="selectSaleDataKeyList"
					  filterable
					  :render-content="renderFunc"
					  :titles="['全部采购商', '已关联采购商商家']"
					  :button-texts="['删除关联', '添加关联']"
					  :format="{
					    noChecked: '${total}',
					    hasChecked: '${checked}/${total}'
					  }"
					  @change="handleSaleChange"
					  :data="allSaleDataList">
				    </el-transfer>
				</div>
				<!--<div class="dialog-footer flex-x-center">
					<elBtn @click="perfectBuyer"  text="补齐与采购商关联关系" type="primary">补齐供应商关联关系</elBtn>
			    	<elBtn @click="perfectQuotation"  text="补齐供应商报价单客户数据" type="primary">补齐供应商报价单数据</elBtn>
			    </div>-->
		    </el-tab-pane>
		    <el-tab-pane label="积分明细" name="four">
		    	<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
					<!--<el-table-column type="selection" width="55"></el-table-column>-->
					<el-table-column type="index" width="80" label="序号" />
					<el-table-column prop="changeDate" label="变化日期">
						<template slot-scope="scope">
							<toolTip :content="scope.row.changeDate">
								<div>{{scope.row.changeDate}}</div>
							</toolTip>
						</template>
					</el-table-column>
					<el-table-column prop="changeType" label="变化类型">
						<template slot-scope="scope">
							<selectInput :value.sync="scope.row.changeType" v-if="scope.row.rowEditable">
								<el-option v-for="item in changeTypeList" :key="item.value" :label="item.value" :value="item.key">
								</el-option>
							</selectInput>
							<span v-if="!scope.row.rowEditable">{{renderDic(changeTypeList, scope.row.changeType)}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="oriScore" label="变化前积分">
						<template slot-scope="scope">
							<toolTip :content="scope.row.oriScore">
								<div>{{scope.row.oriScore}}</div>
							</toolTip>
						</template>
					</el-table-column>
					<el-table-column prop="score" label="变化分数">
						<template slot-scope="scope">
							<toolTip :content="scope.row.score">
								<div>{{scope.row.score}}</div>
							</toolTip>
						</template>
					</el-table-column>
					<el-table-column prop="curScore" label="变化后积分">
						<template slot-scope="scope">
							<toolTip :content="scope.row.curScore">
								<div>{{scope.row.curScore}}</div>
							</toolTip>
						</template>
					</el-table-column>
					<el-table-column prop="sourceType" label="来源类型">
						<template slot-scope="scope">
							<selectInput :value.sync="scope.row.sourceType" v-if="scope.row.rowEditable">
								<el-option v-for="item in sourceTypeList" :key="item.value" :label="item.value" :value="item.key">
								</el-option>
							</selectInput>
							<span v-if="!scope.row.rowEditable">{{renderDic(sourceTypeList, scope.row.sourceType)}}</span>
						</template>
					</el-table-column>
				</elemTable>
		    </el-tab-pane>
		</el-tabs>
    </el-dialog>
</template>
<script>
	import local from '../../../local.js'
	import mixin from '../../../mixin/mixin.js'
	import usedModal from '../../component/modal/usedModal.vue'
	export default {
        mixins: [mixin],
        components: {usedModal},
		data() {
			var checkTelephone = (rule, value, callback) => {
		        if (value === '') {
		          	callback(new Error('手机号码必填'));
		        } else {
		        	this._ajax({url: this.rootAPI + "customer/checkExistByLoginName", param: {loginName:this.form.tel, id:this.form.id}})
                    .then((function(d) {
                    	if(d.state == 0) {
                    		callback();
                    	} else {
                    		callback(new Error('手机号码已被注册,请重新输入!'));
                    	}
                	}).bind(this))
		        }
		    };
            var vm = this
			return {
				form: {
					id:'',
					channelCode : '',
					marketId : '',
					marketName : '',
					name : '',
					regId : '',
					legalpepresent : '',
					type : '',
					property : '',
					recordDate : '',
					tel : '',
					address : '',
					remark : '',
					wxopenid: '',
					mnemonic : '',
					isChoiceSupplier : 0,
					isSorter : 0,
					isDistribution : 0,
					selectTab : '',
					validDay : '',
					secondEnabled : false,
					thirdEnabled : false,
                },
                rules: {
                    channelCode: [{required: true, message: '渠道必选' }],
                    marketId: [{required: true, message: '所属市场必选' }],
                    name: [{required: true, message: '经营户名称必填' },this._ruleLength(50)],
                    regId: [this._ruleLength(50)],
                    type: [{required: true, message: '经营户类型必填' }],
                    legalpepresent: [this._ruleLength(20)],
                    tel: [{required: true, validator: checkTelephone, trigger: 'blur'}, this._ruleMobile()],
                    mnemonic: [this._ruleLength(10)],
                    address: [this._ruleLength(200)],
                    remark: [this._ruleLength(100)],
                    validDay: [this._ruleLength(10)],
                    wxopenid: [this._ruleLength(90)],
                },
                sysId : local.get("sessionUser").userId,
                oldSorter : '',
				oldDistribution : '',
                dateTime: [],
                activeName: 'first',
                //穿梭框初始化数据（购买商用户才可以编辑该功能）
                tabDisabled: true,
                allDataList: [],
		        selectDataKeyList: [],
		        //采购商数据
		        allSaleDataList: [],
		        selectSaleDataKeyList: [],
		        typeDisabled:true,
		        searchForm:{
		        	customerId:""
		        },
		        changeTypeList:[],
		        sourceTypeList:[],
		        marketList:[],
		        isSorterDisabled : false,
		        isDistributionDisabled : false,
		        renderFunc(h, option) {
		          return <span>{ option.key } - { option.label }</span>;
		        }
			}
		},
		props: {
			modal: {
				default: false
			},
            customerModalType: {
                default: 'add'
            },
            customer: {
                default: {}
            },
            dataDic:{
            	default: {}
            },
            channelList:{
            	default: {}
            }
		},
        computed: {
            userID() {
//              console.log(this.userId)
                return this.userId
            }
        },
		mounted() {
			if(this.customerModalType === 'add') {
				this.typeDisabled = false;
				this.secondEnabled = false;
				this.thirdEnabled = false;
			}else {
				this.initMarket(this.customer.channelCode);
				this.typeDisabled = true;
				if(this.customer.type == '1002') {
					this.secondEnabled = true;
				} else if(this.customer.type == '1001') {
					this.thirdEnabled = true;
				}
			}
            Object.assign(this.form, this.customer)
            this.searchForm.customerId = this.customer.id;
            this.getInitData();
            this.oldSorter = this.customer.isSorter;
            this.oldDistribution = this.customer.isDistribution
            if(local.get("sessionUser").userId != 0 && local.get("sessionUser").typeCode != 0)  this.form.channelCode = local.get("sessionUser").typeCode
		},
		methods: {
			getInitData() {
				var vm = this;
				this._ajax({
					url: this.rootAPI + 'datadic/list',
					param: {
						dataType: "SCORE_SOURCE_TYPE"
					},
					arr: true
				}).then((function(d) {
					let data = d.aaData;
					vm.sourceTypeList=data
				}).bind(this))
				
				this._ajax({
					url: this.rootAPI + 'datadic/list',
					param: {
						dataType: "SCORE_CHANGE_TYPE"
					},
					arr: true
				}).then((function(d) {
					let data = d.aaData;
					vm.changeTypeList=data
				}).bind(this))
				
			},
			cancel() {
				this.$emit('close')
			},
			submit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = 'customer/update';
                        let id = this.form.id;
                        if(this.customerModalType === 'add') {
                            method = 'customer/create';
                            id = null;
                        }
                        let sorterTemp = '';
                        let distributionTemp = '';
                        if(this.oldSorter != this.form.isSorter) {
                        	sorterTemp = this.form.isSorter
                        }
                        if(this.oldDistribution != this.form.isDistribution) {
                        	distributionTemp = this.form.isDistribution
                        }
                        let user = local.get('sessionUser');
                        o = {
								name : this.form.name,
								regId : this.form.regId,
								legalpepresent : this.form.legalpepresent,
								property : this.form.property,
//								recordDate : this.form.recordDate,
								tel : this.form.tel,
								address : this.form.address,
								remark : this.form.remark,
								wxopenid : this.form.wxopenid,
								mnemonic : this.form.mnemonic,
								validDay : this.form.validDay,
//								isChoiceSupplier : this.form.isChoiceSupplier,
								operator : user.nickName,
								isSorter : sorterTemp,
								isDistribution : distributionTemp,
								id : id
                            }
                        if(!id) {
                        	//新增才允许修改下列属性
                        	Object.assign(o, {
                        		channelCode : this.form.channelCode,
                                marketId : this.form.marketId,
                                marketName : this.form.marketName,
                                type : this.form.type,
                        	});
                        }
//                      console.info(o)
                        this._ajax({url: this.rootAPI + method, param: o})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		this.$message({ type: 'success', message: '操作成功' }); 
                        		this.$emit('submit')
                        	} else {
                        		this.$message({ type: 'failure', message: '操作失败:' + d.msg}); 
                        	}
                        }).bind(this))
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            used() {
				if(this.form.channelCode) {
					this.channelCode1 = this.form.channelCode;
					this.usedModalVisible = true;
				} else {
					this.$message({type: 'info', message: '请选择渠道信息'});
				}
			},
			usedModalClose1(resultData) {
//				console.info(resultData);
				this.form.userdName = resultData.name;
				this.form.customerId = resultData.id;
				this.usedModalVisible = false;
			},
			handleClick(tab, event) {
				this.selectTab = tab
		        if(tab.name == 'second') {
		        	//查询全部供应商
		        	//排除当前form框用户
		        	let excludeIds = []
		        	excludeIds.push(this.form.id)
		        	let param = {
		        			'customerType':'merchant',
		        			excludeId : excludeIds
		        		}
		        	this._ajax({url: this.rootAPI, name: 'customer/queryPageByChannelCode', param: param ,arr: true, loading: 'dataLoading'})
		        	.then((function(d){
		        		let data = d.aaData;
		        		let result = [];
		        		$.each(data, function(i, obj) {
							result.push({
		        				key: obj.id,
					            label: obj.name,
					            disabled: false
		        			});
						});
		        		this.allDataList = result;
		        	}).bind(this));
		        	//查询当前用户已关联的供应商数据
		        	this._ajax({url: this.rootAPI, name: 'suppliercollection/list', param: {'customerId':this.form.id}, loading: 'dataLoading'})
		        	.then((function(d){
		        		let data = d.aaData;
		        		let result = [];
		        		$.each(data, function(i, obj) {
							result.push(obj.sellerId);
						});
		        		this.selectDataKeyList = result;
		        	}).bind(this));
		        }
		        if(tab.name == 'third') {
		        	//查询全部采购商
		        	//排除当前form框用户
		        	let excludeIds = []
		        	excludeIds.push(this.form.id)
		        	let param = {
		        			'customerType':'buyer',
		        			excludeId : excludeIds,
		        			extend : "buyer"
		        		}
		        	this._ajax({url: this.rootAPI, name: 'customer/queryPageByChannelCode', param: param ,arr: true, loading: 'dataLoading'})
		        	.then((function(d){
		        		let data = d.aaData;
		        		let result = [];
		        		$.each(data, function(i, obj) {
							result.push({
		        				key: obj.id,
					            label: obj.name,
					            disabled: false
		        			});
						});
		        		this.allSaleDataList = result;
		        	}).bind(this));
		        	//查询当前用户已关联的采购商数据
		        	this._ajax({url: this.rootAPI, name: 'suppliercollection/list', param: {'sellerId':this.form.id}, loading: 'dataLoading'})
		        	.then((function(d){
		        		let data = d.aaData;
		        		let result = [];
		        		$.each(data, function(i, obj) {
							result.push(obj.customerId);
						});
		        		this.selectSaleDataKeyList = result;
		        	}).bind(this));
		        }
		        if(tab.name == 'four') {
		         	var vm = this;
					Object.assign(this.searchForm, {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					});
					return this._ajax({
						url: this.rootAPI + 'score/list',
						param: this.searchForm,
						loading: 'dataLoading'
					}).then(this.renderTable)
		        }
		    },
		    searchTable() {
		    	var vm = this;
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				});
				return this._ajax({
					url: this.rootAPI + 'score/list',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
		    },
		    handleChange(value, direction, movedKeys) {
		        let param = {
		        	customerName : this.form.name,
	        		customerId : this.form.id,
	        		joininCustomerIdsString : movedKeys.join(',')
	        	}
		        let allData = this.allDataList;
	        	let selectName = [];
	        	$.each(movedKeys, function(i, obj1) {
	        		$.each(allData, function(j, obj2) {
	        			if(obj1 == obj2.key) {
	        				selectName.push(obj2.label);
	        			}
	        		});
	        	});
	        	param.sellerName = selectName.join(',');
		        if(direction === 'left') {
		        	//删除关联
		        	param.type = 2;
		        } else if(direction === 'right'){
		        	//添加关联
		        	param.type = 1;
		        }
		        this._ajax({url: this.rootAPI, name: 'suppliercollection/updateSupplierRelete', param: param})
		        .then((function(d){
		        	if(d.state == 0) {
		        		this.$message({type: 'success', message: '调整关联成功！'});
		        	} else {
		        		this.handleClick(this.selectTab)
		        		this.$message({type: 'info', message: '调整关联失败：'+d.msg});
		        	}
		        }).bind(this))
		    },
		    handleSaleChange(value, direction, movedKeys) {
		        let param = {
		        	sellerName : this.form.name,
	        		sellerId : this.form.id,
	        		joininCustomerIdsString : movedKeys.join(',')
	        	}
		        let allSaleData = this.allSaleDataList;
	        	let selectName = [];
	        	$.each(movedKeys, function(i, obj1) {
	        		$.each(allSaleData, function(j, obj2) {
	        			if(obj1 == obj2.key) {
	        				selectName.push(obj2.label);
	        			}
	        		});
	        	});
	        	param.customerName = selectName.join(',');
		        if(direction === 'left') {
		        	//删除关联
		        	param.type = 2;
		        } else if(direction === 'right'){
		        	//添加关联
		        	param.type = 1;
		        }
		        this._ajax({url: this.rootAPI, name: 'suppliercollection/updateSellerRelete', param: param})
		        .then((function(d){
		        	if(d.state == 0) {
		        		this.$message({type: 'success', message: '调整关联成功！'});
		        	} else {
		        		this.handleClick(this.selectTab)
		        		this.$message({type: 'info', message: '调整关联失败：'+d.msg});
		        	}
		        }).bind(this))
		    },
		    perfectBuyer() {
		    	//供应商补全买方关联
		    	let param = {
		    		sellerId : this.form.id
		    	}
		    	this._ajax({url: this.rootAPI, name: 'suppliercollection/perfectSuppliercollection', param: param})
		        .then((function(d){
		        	if(d.state == 0) {
		        		this.$message({type: 'success', message: '调整关联成功！'});
		        	} else {
		        		this.$message({type: 'info', message: '调整关联失败：'+d.msg});
		        	}
		        	this.handleClick(this.selectTab)
		        }).bind(this))
		    },
		    perfectQuotation() {
		    	let param = {
		    		customerId : this.form.id
		    	}
		    	this._ajax({url: this.rootAPI, name: 'quotation/perfectQuotationInfo', param: param})
		        .then((function(d){
		        	if(d.state == 0) {
		        		this.$message({type: 'success', message: '调整关联成功！'});
		        	} else {
		        		this.$message({type: 'info', message: '调整关联失败：'+d.msg});
		        	}
		        	this.handleClick(this.selectTab)
		        }).bind(this))
		    },
		    perfectSeller() {
		    	let param = {
		    		customerId : this.form.id
		    	}
		    	this._ajax({url: this.rootAPI, name: 'suppliercollection/perfectSuppliercollection', param: param})
		        .then((function(d){
		        	if(d.state == 0) {
		        		this.$message({type: 'success', message: '调整关联成功！'});
		        	} else {
		        		this.$message({type: 'info', message: '调整关联失败：'+d.msg});
		        	}
		        	this.handleClick(this.selectTab)
		        }).bind(this))
		    },
		    perfectSellerQuotation() {
		    	let param = {
		    		buyersId : this.form.id
		    	}
		    	this._ajax({url: this.rootAPI, name: 'quotation/perfectQuotationInfo', param: param})
		        .then((function(d){
		        	if(d.state == 0) {
		        		this.$message({type: 'success', message: '调整关联成功！'});
		        	} else {
		        		this.$message({type: 'info', message: '调整关联失败：'+d.msg});
		        	}
		        	this.handleClick(this.selectTab)
		        }).bind(this))
		    },
		    renderDic(dic, dicKey) {
				let dicShow = '';
				$.each(dic, function(i, obj) {
					if(obj.key == dicKey) {
						dicShow = obj.value;
					}
				});
				return dicShow;
			},
			typeSelectChange(val) {
				let datas = this.dataDic.customerType;
				$.each(datas, (function(i, obj){
					if(obj.key == val) {
						if(obj.extendVal == 'buyer') {
							this.form.isSorter = 0;
							this.form.isDistribution = 0;
							this.isSorterDisabled = true;
							this.isDistributionDisabled = true;
						} else {
							this.isSorterDisabled = false;
							this.isDistributionDisabled = false;
						}
					}
				}).bind(this))
			},
			initMarket(val) {
				this._ajax({
					url: this.rootAPI + 'market/list',
					param: {
						channelCode : val,
						enabled: "1"
					},
					arr: true
				}).then((function(d) {
					let data = d.aaData;
					this.marketList = data;
				}).bind(this))
			},
			channelChange(val) {
				this.initMarket(val);
				this.form.marketName = "";
				this.form.marketId = "";
			},
			marketChange(val) {
				$.each(this.marketList, (function(i, el) {
					if(el.marketCode == val) this.form.marketName = el.marketName;
				}).bind(this))
			}
		}
	}
</script>
<style lang="sass">
    .customer-modal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 110px);
                &>div{
                    width: 100%;
                }
            }
        }
    }
    .el-transfer-panel{
    	width:400px;
    }
</style>
