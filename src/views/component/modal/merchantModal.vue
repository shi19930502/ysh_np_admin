<template>
	<el-dialog custom-class="jz-modal" :title="title" :visible="modal" ref="dialog" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <searchInputItems>
        <searchInputItem name="供应商名称">
            <inputItem :value.sync="form.name"  ref="nameInput" ></inputItem>
        </searchInputItem>
        <searchInputItem name="身份证号或营业执照号">
            <inputItem :value.sync="form.regId"  ref="nameInput" ></inputItem>
        </searchInputItem>
        <searchInputItem name="电话号码">
            <inputItem :value.sync="form.tel"  ref="nameInput" ></inputItem>
        </searchInputItem>
        </searchInputItems>
        <optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
        <elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="modalDataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :maxHeight="modalMaxTableHeight" :highlightCurrentRow="true" @selectChange="selectChange">
            <el-table-column prop="name" label="供应商名称">
                <template slot-scope="scope">
                    <div>{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="regId" label="身份证号或营业执照号">
                <template slot-scope="scope">
                    <div>{{scope.row.regId}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="tel" label="联系电话">
                <template slot-scope="scope">
                    <div>{{scope.row.tel}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址">
                <template slot-scope="scope">
                    <div>{{scope.row.address}}</div>
                </template>
            </el-table-column>
        </elemTable>
        <div slot="footer" class="dialog-footer flex-x-end">
			<iconBtn @click="cancel" content="取消">取消</iconBtn>
			<iconBtn @click="submit" type="primary" content="提交">提交</iconBtn>
		</div>
    </el-dialog>
</template>
<script>
import local from '../../../local.js'	
import mixin from '../../../mixin/mixin.js'
import configs from '../../../configs.js'
	export default {
        mixins: [mixin],
		data() {
			return {
                dataList: [],
                form: {
                    name: '',
                    regId:'',
                    tel:'',
                    channelCode:''
                },
                currentRow: null,
                modalWidth: '70%'
			}
		},
		props: {
			modal: {
				default: false
			},
            title: {
                default: '请选择城市平台账号'
            },
            params: {
                default: function() {
                    return {}
                }
            },
            tableRow:{
            	 default: function() {
                    return {}
                }
            }
		},
		mounted() {
            this.searchTable()
		},
		methods: {
			reset() {
				this.form.name = ''
                this.form.regId = ''
                this.form.tel = ''
                this.searchTable()
			},
            searchTable() {
            	let user = local.get('sessionUser');
                Object.assign(this.form, {
                    pageNum: this.pageNum, 
                    pageSize: this.pageSize,
                    channelCode:user.typeCode || ''
                })
                this._ajax({name: 'merchant/queryListByRelationIdIsNull', param: this.form, loading: 'modalDataLoading'})
                    .then(this.renderTable)
                    .then((function() {
                        this.$refs.nameInput.$children[0].focus()
                    }).bind(this))
            },
			cancel() {
				this.$emit('close')
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            selectChange(val) {
                this.currentRow = val
            },
            submit() {
            	this.tableRow.relationId =  this.currentRow.id
                this.$emit('submit', this.tableRow)
            }           
		}
	}
</script>