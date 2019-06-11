<template>
	<el-dialog custom-class="jz-modal bonusRules-modal" :title="bonusRulesModalType === 'add' ? '新增奖金规则' : '奖金规则编辑'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
            <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="110px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="规则使用时间" prop="dateRange" class="required">
                            <dateEditorDaterange :dateValue.sync="dateRange" type="datetimerange" valueFormat="yyyy-MM-dd HH:mm:ss"></dateEditorDaterange>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="规则名称" prop="title">
                            <inputItem :value.sync="form.title" ></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="总资金池" prop="bonusPool">
                            <inputItem :value.sync="form.bonusPool" ></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="每日资金池" prop="bonusPerDay">
                            <inputItem :value.sync="form.bonusPerDay" ></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="中奖概率" prop="odds">
                            <inputItem :value.sync="form.odds" ></inputItem>%
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="最低中奖金额" prop="minBonus">
                            <inputItem :value.sync="form.minBonus" ></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="最高中奖金额" prop="maxBonus">
                            <inputItem :value.sync="form.maxBonus" ></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="参与活动的订单最低金额" prop="startBonusAmount">
                            <inputItem :value.sync="form.startBonusAmount" ></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="单个经营户每天可中奖总额" prop="bonusPerMerchant">
                            <inputItem :value.sync="form.bonusPerMerchant" ></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
						<el-form-item label="备注" prop="content" class="row-block">
							<inputItem :value.sync="form.content" type="textarea"></inputItem>
						</el-form-item>
					</el-col>
                </el-row>                         
            </el-form>              
            <div slot="footer" class="dialog-footer flex-x-end">
                <elBtn @click="cancel" text="取消"></elBtn>
                <elBtn @click="valideSubmit" text="提交" type="primary"></elBtn>
            </div>
        </el-dialog>
</template>
<script>
import mixin from '../../../mixin/mixin.js'
import configs from '../../../configs.js'
	export default {
        mixins: [mixin],
		data() {
			return {
				form: {
					title: '',
					bonusPool: '',
					bonusPerDay: '',
					odds: '',
					minBonus: '',
					maxBonus: '',
					startBonusAmount: '',
					bonusPerMerchant: '',
					content: '',
					startTime: '',
					endTime: '',
                },
                rules: {
                	title:[{required: true, message: '奖金名称不能为空' }, this._ruleLength(50)],
                	bonusPool:[{required: true, message: '总资金池不能为空' }, this._ruleTwoFloat(), this._ruleLength(18)],
                	bonusPerDay:[{required: true, message: '每日资金池不能为空' }, this._ruleTwoFloat(), this._ruleLength(18)],
                	odds:[{required: true, message: '中奖概率不能为空' }, this.ruleOdds()],
                	minBonus:[{required: true, message: '最低中奖金额不能为空' }, this._ruleTwoFloat(), this._ruleLength(18)],
                	maxBonus:[{required: true, message: '最高中奖金额不能为空' }, this._ruleTwoFloat(), this._ruleLength(18)],
                	startBonusAmount:[{required: true, message: '参与活动的订单最低金额不能为空' }, this._ruleTwoFloat(), this._ruleLength(18)],
                	bonusPerMerchant:[{required: true, message: '单个经营户每天可中奖总额不能为空' }, this._ruleTwoFloat(), this._ruleLength(18)],
                    parentChannelCode:[{required: true, message: '参与活动的订单最低金额不能为空' }, this._ruleTwoFloat(), this._ruleLength(18)],
                },
                dateRange:[],
			}
		},
		props: {
			modal: {
				default: false
			},
            bonusRulesModalType: {
                default: 'add'
            },
            bonusRules: {
                default: function() {
                    return {}
                }
            }
		},
		mounted() {  
            Object.assign(this.form, this.bonusRules);
            if(this.bonusRules.startTime && this.bonusRules.endTime) {
            	this.dateRange = [this.bonusRules.startTime, this.bonusRules.endTime]
            }
		},
		methods: {
			ruleOdds(){	
				return {
					validator: (function(rule, value, callback) {
						var val = $.trim(value)
//						let reg = /^\d+(\.\d{1,2})?$/;
						let reg = /^[1-9]\d*$/;
						if(val.length > 0 && !reg.test(val)) {
//			              callback(new Error('请输入大于等于零的数字,最多保留两位小数'))
							callback(new Error('请输入大于等于零的数字'))
			            } else if(parseFloat(val) > 100){
			            	callback(new Error('输的比例不能大于100'))
			            } else {
			              callback();
			            }
					}.bind(this)), trigger: 'blur'
				}
			},
			cancel() {
				this.$emit('close')
			},
			valideSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = 'bonusRules/update';
                        if(this.bonusRulesModalType === 'add') {  
                            method = 'bonusRules/create'
                        }
                        if(this.dateRange.length == 0 || this.dateRange.length != 2) {
                        	this.$message({type: 'warning', message: '奖金规格使用时间范围必填'});
                        	return;
                        }
                        Object.assign(o, this.form, {
                        	startTime : this.dateRange[0],
                        	endTime : this.dateRange[1],
                        	status : 0,
                        	
                        });
                        this._ajax({url: this.rootAPI + method, param: o})
		                .then((function(d) {
		                	if(d.state == 0) {
		                		this.$message({ type: 'success', message: '操作成功' }); 
		                    	this.$emit('close')
		                	} else {
		                		this.$message({ type: 'error', message: '操作失败：'+d.msg }); 
		                	}
		                }).bind(this))
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
		}
	}
</script>
<style lang="sass">
	.bonusRules-modal {
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