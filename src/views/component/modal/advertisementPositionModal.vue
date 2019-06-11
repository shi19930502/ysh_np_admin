<template>
	<el-dialog custom-class="jz-modal" :title="advertisementPositionModalType === 'add' ? '新增广告位' : '编辑广告位'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="广告位编码" prop="code">
						<inputItem :value.sync="form.code"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="广告位名称" prop="name">
						<inputItem :value.sync="form.name"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="是否启用" prop="status">
						<el-select v-model="form.status" placeholder="请选择">
							<el-option label="停用" value="0"></el-option>
							<el-option label="启用" value="1"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="备注" prop=remark>
						<inputItem :autosize="true" type="textarea" :value.sync="form.remark"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">

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
	import local from "../../../local.js";
	import mixin from "../../../mixin/mixin.js";
	import configs from "../../../configs.js";
	export default {
		mixins: [mixin],
		data() {
			var vm = this
			return {
				msgColor: "red",
				textLeft: "left",
				msg: "",
				pipor: "",
				none: true,
				form: {
					name: "",
					code: "",
					status: "1",
					remark: ""
				},
				typeCode: "",
				rules: {
					code: [{
							required: true,
							message: "广告位编号不能为空"
						},
						this._ruleLength(50),
						{
							validator: function(rule, value, callback) {
								if(
									this.advertisementPositionModalType != "add" &&
									this.tableRow.jobno == value
								) {
									callback();
								} else {
									this._ajax({
										url: this.rootAPI,
										name: "advertisementPosition/list",
										param: {
											code: this.form.code
										},
										loading: "dataLoading"
									}).then(function(d) {
										if(d.state === 0 && d.dataCount > 0 && vm.tableRow.id !=d.aaData[0].id ) {
											callback(new Error("广告位编号已存在"));
										} else {
											callback();
										}
									});
								}
							}.bind(this),
							trigger: "blur"
						}
					],
					status: [{
						required: true,
						message: "状态不能为空",
						trigger: "blur"
					}],
					name: [{
							required: true,
							message: "姓名不能为空",
							trigger: "blur"
						},
						this._ruleLength(50)
					],

				}
			};
		},
		props: {
			modal: {
				default: false
			},
			tableRow: {
				default: function() {
					return {};
				}
			},
			advertisementPositionModalType: {
				default: "add"
			}
		},
		mounted() {
			if(this.sorterModalType != "add") {
				Object.assign(this.form, this.tableRow);
			}
		},
		methods: {
			cancel() {
				this.$emit("close");
			},
			submit() {
				var sf = this;
				let user = local.get("sessionUser");
				this.$refs["form"].validate(valid => {
					if(valid) {
						var o = {}
						o = {
							id: sf.tableRow.id || null,
							name: sf.form.name,
							code: sf.form.code,
							remark: sf.form.remark,
							status:sf.form.status,
							createdPersonId: parseInt(user.userId || 0),
							createdPersonName:user.nickName
						};
						sf.$emit("add", o);
						sf.cancel();
					} else {
						return false;
					}
				});
			},
			beforeClose(done) {
				this.cancel();
				done();
			}
		}
	};
</script>