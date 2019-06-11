<template>
	<el-dialog custom-class="jz-modal" :close-on-click-modal="modal" width="1280px" title="商品明细" :visible.sync="modal" :before-close='beforeClose'>
		<div class="page-khNolice">
			<el-table :data="dataList" style="width: 100%">
				<el-table-column prop="productName" label="商品名">
				</el-table-column>
				<el-table-column prop="skuName" label="单位" >
				</el-table-column>
				<el-table-column prop="price" label="单价(元)" >
				</el-table-column>
				<el-table-column prop="skuCount" label="数量" >
				</el-table-column>
			</el-table>
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

			}
		},
		props: {
			modal: {
				default: false
			},
			ids: {
				default: function() {
					return {}
				},
			},
			tableRow: {
				default: {},
			}

		},
		mounted() {
			this.dataList = this.tableRow.items

		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			beforeClose(done) {
				this.cancel()
				done()
			}
		}
	}
</script>