<template>
	<el-dialog custom-class="jz-modal" :width="modalWidth" :title="title" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<el-form class="modal-form" :rules="rules" ref="form" v-if="modal" :model="form" :inline="true" label-width="120px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="账单类型名称：" prop="billTypeName">
						<inputItem :disabled='formDisabled' :value.sync='form.billTypeName'></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="收支类型：" prop="inoutType">
						<selectItem :selectValue.sync='form.inoutType'>
							<el-option v-for="item in inoutTypeOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</selectItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="结算方式：" prop="settleType">
						<selectItem :selectValue.sync='form.settleType'>
							<el-option v-for="item in settleTypeOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</selectItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="是否需要审核：">
						<switchItem :value.sync="form.isAudit">
						</switchItem>
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
			return {
				form: {
					billTypeName: '',
					inoutType: '',
					settleType: '',
					isAudit: '',
				},
				rules: {
					billTypeName: [{ required: true, message: '账单类型名称不能为空' }, this._ruleLength(20)],
					inoutType:[{ required: true, message: '请选择收支类型' ,trigger: 'change'}],
					settleType:[{ required: true, message: '请选择结算方式',trigger: 'change'},],
				},
				row: {},
				formDisabled: false,
				modalWidth: '700',
				inoutTypeOptions: [
					{ label: "收款", value: 0 },
					{ label: "支付", value: 1 },
				],
				settleTypeOptions: [
					{ label: "实时收款", value: 1 },
					{ label: "实时付款", value: 2 },
					{ label: "清分", value: 3 },
					{ label: "线下结算", value: 9 },
				],
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
			console.log(this.form.billTypeName)
			this.init()
		},
		methods: {
			init() {
				console.log('init')
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
						var name = 'billTypeConf/create';
						if(this.title == '编辑') {
							name = 'billTypeConf/update'
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