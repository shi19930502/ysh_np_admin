<template>
	<el-dialog custom-class="jz-modal" :title="gradeModalType === 'add' ? '评级新增页面' : '评级新增页面'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="110px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="渠道" prop="channelCode">
						<!--<selectInput :value.sync="form.channelCode" :disabled="isChannel">
							<el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</selectInput>-->
						<selectInput :value.sync="form.channelCode" :disabled="isChannel" v-if="isChannel">
							<el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code">
							</el-option>
						</selectInput>
						<cascaderItem :options="channelList" @change="channelChange" :value.sync="channelName" v-if="!isChannel"></cascaderItem>
			
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="生效日期" prop="effectiveDate">
						<div class="block">
							<el-date-picker v-model="form.effectiveDate" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期">
							</el-date-picker>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item :label="dataDic.reputationList[0].value + '级分下限:'" prop="AMinScore">
						<inputItem :value.sync="form.AMinScore"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item :label="dataDic.reputationList[0].value + '级分上限:'" prop="AMaxScore">
						<inputItem :value.sync="form.AMaxScore" :disabled="true"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item :label="dataDic.reputationList[1].value + '级分下限:'" prop="BMinScore">
						<inputItem :value.sync="form.BMinScore"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item :label="dataDic.reputationList[1].value + '级分上限:'" prop="BMaxScore">
						<inputItem :value.sync="form.AMinScore"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item :label="dataDic.reputationList[2].value + '级分下限:'" prop="CMinScore">
						<inputItem :value.sync="form.CMinScore"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item :label="dataDic.reputationList[2].value + '级分上限:'" prop="CMaxScore">
						<inputItem :value.sync="form.BMinScore"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item :label="dataDic.reputationList[3].value + '级分下限:'" prop="DMinScore">
						<inputItem :value.sync="form.DMinScore"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item :label="dataDic.reputationList[3].value + '级分上限:'" prop="DMaxScore">
						<inputItem :value.sync="form.CMinScore"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item :label="dataDic.reputationList[4].value + '级分下限:'" prop="EMinScore">
						<inputItem :value.sync="form.EMinScore" :disabled="true"></inputItem>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item :label="dataDic.reputationList[4].value + '级分上限:'" prop="EMaxScore">
						<inputItem :value.sync="form.DMinScore"></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="备注" prop="remark">
						<inputItem :value.sync='form.remark' type="textarea"></inputItem>
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
	import local from '../../../local.js'
	import mixin from '../../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			var vm = this
			return {
				form: {
					channelCode: '',
					AMaxScore: '100',
					AMinScore: '',
					BMinScore: '',
					CMinScore: '',
					DMinScore: '',
					EMinScore: '0',
					state: 0,
					effectiveDate: '',
					remark: ''
				},
				rules: {
					channelCode: [{
						required: true,
						message: '渠道不能为空'
					}],
					AMinScore: [{
						required: true,
						message: '分数不能为空'
					}, this._ruleTwoFloat()],
					BMinScore: [{
						required: true,
						message: '分数不能为空'
					}, this._ruleTwoFloat()],
					CMinScore: [{
						required: true,
						message: '分数不能为空'
					}, this._ruleTwoFloat()],
					DMinScore: [{
						required: true,
						message: '分数不能为空'
					}, this._ruleTwoFloat()],
					EMinScore: [{
						required: true,
						message: '分数不能为空'
					}, this._ruleTwoFloat()],
					effectiveDate: [{
						required: true,
						message: '生效时间不能为空'
					}],
					remark: [this._ruleLength(200)]
				},
				reputationMap: [],
				channelCode:'',
				isChannel:'',
				channelName:[],
				channeSearchlList:[]
			}
		},
		mounted() {
			this._ajax({
						url: this.rootAPI,
						name: 'channel/listByParent',
						param: {
							parentChannelCode: ''
						}
					})
					.then((function(d) {
						this.channeSearchlList = d.aaData
					}).bind(this))
					
			let user = local.get('sessionUser');
				this.loginName = user.loginName
				this.channelCode = user.typeCode
				let typeId =  user.typeId;
				if(this.loginName == 'admin'|| typeId == '0' || this.channelCode == '' || this.channelCode == '0' || this.channelCode.length == 0) {
					//超级管理员
					this.isChannel = false;
				} else {
					//各渠道管理员
					this.form.channelCode = this.channelCode;
					this.isChannel = true;
				}
		},
		props: {
			modal: {
				default: false
			},
			gradeModalType: {
				default: 'add'
			},
			dataDic: {
				default: {}
			},
			channelList: {
				default: {}
			}
		},
		computed: {
			userID() {
				console.log(this.userId)
				return this.userId
			}
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			submit() {

				this.$refs['form'].validate((valid) => {
					if(valid) {
						//判断评分数据是否合法
						if(!((parseInt(this.form.AMinScore) > parseInt(this.form.BMinScore)) &&
								(parseInt(this.form.BMinScore) > parseInt(this.form.CMinScore)) &&
								(parseInt(this.form.CMinScore) > parseInt(this.form.DMinScore)) &&
								(parseInt(this.form.DMinScore) > parseInt(this.form.EMinScore)))) {
							//console.log("您输入的评分等级区间有误，请重新输入！")
							alert("您输入的评分等级区间有误，请重新输入！");
							return;
						};

						//过滤选择的生效时间已经过期的可能
						if(parseInt(this.dateTime) <= new Date()) {
							alert("生效时间不能小于当前时间！");
							return;
						};

						//将评分区间的数据，封装进数组对象
						this.reputationMap.push(this.form.AMinScore);
						this.reputationMap.push(this.form.BMinScore);
						this.reputationMap.push(this.form.CMinScore);
						this.reputationMap.push(this.form.DMinScore);
						this.reputationMap.push(this.form.EMinScore);

						var o = {
							channelCode: this.form.channelCode,
							state: this.form.state,
							effectiveDate: this.form.effectiveDate,
							remark: this.form.remark
						}
						o.reputationList = JSON.stringify(this.reputationMap);
						//获取当前用户的登录信息，设置创建人
						let user = local.get('sessionUser');
						o.createdPersonId = user.userId; //创建人id
						o.createdPersonName = user.nickName; //创建人别名
						this._ajax({
							url: this.rootAPI + "reputationconfigmain/create",
							param: o,
							arr: true
						}).then((function(d) {
							if(d.state == 0) {
								this.$message({
									type: 'success',
									message: '操作成功'
								});
							} else {
								this.$message({
									type: 'failure',
									message: '操作失败'
								});
							}
							this.$emit('submit')
						}).bind(this))
					}
				})
			},
			channelChange(val) {
				if(val.length > 0) {
					Object.assign(this.form, {
						channelCode: val[val.length - 1]
					})
				} else {
					Object.assign(this.form, {
						channelCode: ''
					})
				}
				// this.searchTable()
			},
			beforeClose(done) {
				this.cancel()
				done()
			},
		}
	}
</script>