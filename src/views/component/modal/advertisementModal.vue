<template>
	<el-dialog custom-class="jz-modal" :title="advertisementModalType === 'add' ? '新增广告' : '编辑广告'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="投放者名称" prop="customerId">
						<selectInput :value.sync="form.customerId" :filterable="filterable" :disabled="none">
							<el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</selectInput>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="广告位名称" prop="posId">
						<selectInput :value.sync="form.posId" :filterable="filterable" :disabled="none">
							<el-option v-for="item in advertPosList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</selectInput>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="标题" prop="title" >
						<inputItem :value.sync="form.title" :disabled="none"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="起始时间" prop="time" >
					<dateEditorDaterange :dateValue.sync='form.time' :disabled="none" >
					</dateeditordaterange>
				</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<el-form-item label="内容" prop="content" class="row-block word-break">
						<inputItem :value.sync="form.content" type="textarea" :disabled="none"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="form.status != ''">
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="状态" prop="status">
						<el-select v-model="form.status" disabled placeholder="请选择">
							<el-option label="草稿" value="0"></el-option>
							<el-option label="确认" value="1"></el-option>
							<el-option label="开始" value="2"></el-option>
							<el-option label="截止" value="3"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel" text="取消"></elBtn>
			<elBtn @click="submit(0)" text="保存为草稿" type="primary" v-if="!none"></elBtn>
			<elBtn @click="submit(1)" text="提交" type="success" v-if="!none"></elBtn>
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
				none: false,
				form: {
					customerId: "",
					posId: "",
					title: "",
					content: "",
					status: "",
					time: []
				},
				customerList: [],
				advertPosList: [],
				flag: false,
				rules: {
					customerId: [{
						required: true,
						message: "投放者名称不能为空",
						trigger: "blur"
					}],
					posId: [{
						required: true,
						message: "广告位名称不能为空",
						trigger: "blur"
					}],
					title: [{
							required: true,
							message: "标题不能为空",
							trigger: "blur"
						},
						this._ruleLength(50)
					],
					content: [{
						required: true,
						message: "内容不能为空",
						trigger: "blur"
					}],
					status: [{
						required: true,
						message: "状态不能为空",
						trigger: "blur"
					}],
					time: [{
						required: true,
						message: "起始时间不能为空",
						trigger: "blur",
						},this.regTimes()
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
			advertisementModalType: {
				default: "add"
			}
		},
		mounted() {
			if(this.advertisementModalType != "add") {
				Object.assign(this.form, this.tableRow);			
				this.form.time[0] = this.tableRow.startTime;
				this.form.time[1] = this.tableRow.endTime;
			} else if(this.advertisementModalType == "add") {
				this.form.status = ''
			}
			if(this.form.status == '' || this.form.status == 0 ) {
				this.none = false;
			} else {
				this.none = true;
			}
			var vm = this;
			this._ajax({
				url: this.rootAPI + 'customer/queryListByEnabledIsOne',
				param: {

				},
				arr: true
			}).then((function(d) {
				let data = d.aaData;
				vm.customerList = data
			}).bind(this))

			this._ajax({
				url: this.rootAPI + 'advertisementPosition/queryListByStatusIsOne',
				param: {},
				arr: true
			}).then((function(d) {
				let data = d.aaData;
				vm.advertPosList = data
			}).bind(this))
		},
		methods: {
			regTimes() {
				var vm = this;
				return {validator: function(rule, value, callback) {
					var val = $.trim(value);
					if(vm.form.time[0] === vm.form.time[1]) {
						 callback(new Error('起始时间不能相同'))
					}else {
						callback()
					}
				}, trigger: 'blur'}	
			},
			cancel() {
				this.$emit("close");
			},
			submit(status) {
				this.form.status = status;
				this.firstSubmit().then(this.secondSubmit)
			},
			firstSubmit() {
				var sf = this;
				return this._ajax({
					url: this.rootAPI,
					name: "advertisement/checkPosIdAndTime",
					param: {
						id: sf.form.id,
						posId: sf.form.posId,
						startTime: sf.form.time[0],
						endTime: sf.form.time[1]
					},
					loading: "dataLoading"
				}).then(function(d) {
					if(d.state == 2) {
						sf.flag = true;
					} else if(d.state == 0) {
						sf.flag = false;
					}
				})
			},
			secondSubmit(status) {
				var sf = this;
				if(sf.flag == true) {
					this.form.status = ""
					return;
				}
				let user = local.get("sessionUser");
				this.$refs["form"].validate(valid => {
					if(valid) {
						var o = {}
						o = {
							id: sf.tableRow.id || null,
							customerId: sf.form.customerId,
							posId: sf.form.posId,
							title: sf.form.title,
							content: sf.form.content,
							status: sf.form.status,
							startTime: sf.form.time[0],
							endTime: sf.form.time[1],
							createdPersonId: parseInt(user.userId || 0),
							createdPersonName: user.nickName
						};
						sf.$emit("add", o);
						sf.cancel();
					} else {
						this.form.status = ""
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

<style lang="sass">
    .jz-modal{
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
