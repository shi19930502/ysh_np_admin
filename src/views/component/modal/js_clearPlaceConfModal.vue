<template>
	<el-dialog custom-class="jz-modal" :width="modalWidth" :title="title" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<el-form class="modal-form" :rules="rules" ref="form" v-if="modal" :model="form" :inline="true" label-width="120px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
					<el-form-item label="清算场次名称：" prop="placeName">
						<inputItem :disabled='formDisabled' :value.sync='form.placeName'></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
					<el-form-item label="账单类型：" prop="billTypeId">
						<selectItem :selectValue.sync='form.billTypeId'>
							<el-option v-for="item in billTypeIdOptions" :key="item.id" :label="item.billTypeName" :value="item.id">
							</el-option>
						</selectItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
					<el-form-item label="场次间隔时间：" prop="settleSpace">
						<inputItem :disabled='formDisabled' :value.sync='form.settleSpace'></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
					<el-form-item label="结算周期：" prop="settlePeriod">
						<inputItem :disabled='formDisabled' :value.sync='form.settlePeriod'></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
					<el-form-item label="客户号：" prop="customertNo">
						<inputItem :disabled='formDisabled' :value.sync='form.customertNo'></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
					<el-form-item label="清算单元：" prop="clearUnitId">
						<inputItem :disabled='formDisabled' :value.sync='form.clearUnitId'></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel" text="取消"></elBtn>
			<elBtn @click="submit" text="提交" type="primary"></elBtn>
		</div>
	</el-dialog>
</template>

<script>
	import mixin from '../../../mixin/mixin.js' //公共方法，包括主要的ajax
	export default {
		mixins: [mixin],
		data() {
			var reg_int= (rule, value, callback) => {
		        var patt1 = new RegExp("^[0-9]*$");
				var result = patt1.test(value);
				if(!result){
					callback(new Error('请输入数字！'));
				}
				if(value>=2147483648){
					callback(new Error('请输入范围为0~2147483648的数字！'));
				}
				callback();
	      	};
			return {
				form: {
					placeName: '',
					billTypeId: '',
					customertNo: '',
					clearUnitId: '',
					settleSpace: '',
					settlePeriod: '',
				},
				rules: {
					placeName: [{ required: true, message: '清算场次名称不能为空' }, this._ruleLength(20)],
					billTypeId: [{ required: true, message: '请选择账单类型', trigger: 'change' }, ],
					settleSpace: [{ required: true, message: '场次间隔时间不能为空'},{ validator: reg_int, trigger: 'blur' } ],
					settlePeriod: [{ required: true, message: '结算周期不能为空'},{ validator: reg_int, trigger: 'blur' } ],
				},
				row: {},
				formDisabled: false,
				billTypeIdOptions: [],
			}
		},
		props: {
			modal: {
				type: Boolean,
				default: false
			},
			title: {
				default: "账户详情"
			},
			rowList: {
				default: function() {
					return {}
				}
			}
		},
		mounted() {
			Object.assign(this.form, this.rowList)
			this.init()
		},
		methods: {
			init() {
				this._ajax({
					url: this.settleAPI,
					name: 'billTypeConf/list',
					loading: 'dataLoading',
					arr: true,
					param: {},
				}).then(d => {
					if(d.state === 0) {
						this.billTypeIdOptions=d.aaData
					}
				})
			},
			cancel() {
				this.$emit('close')
			},
			beforeClose(done) {
				this.cancel()
				done()
			},
			submit() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						var name = 'clearPlaceConf/create';
						if(this.title == '编辑') {
							name = 'clearPlaceConf/update'
							//Object.assign(this.form,{updateDate:moment().format('YYYY-MM-DD HH:mm:ss')})
						} else if(this.title == '添加') {
							//Object.assign(this.form,{createDate:moment().format('YYYY-MM-DD HH:mm:ss')})
						}
						this._ajax({
							url: this.settleAPI,
							name: name,
							loading: 'dataLoading',
							arr: true,
							param: this.form,
						}).then(d => {
							if(d.state === 0) {
								this.$message({
									type: 'success',
									message: '操作成功'
								});
								this.cancel();
								this.$emit('submit')
							}
						})
					} else {
						this.$message({
							type: '',
							message: '请按正确的格式输入'
						});
					}
				})

			}
		},
	}
</script>

<style>

</style>