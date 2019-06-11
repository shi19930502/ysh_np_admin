<template>
	<el-button :type="type" @click="click" :size="size">{{text}}</el-button>
</template>
<script>
	export default {
		name: 'elBtn',
		props: {
			text: {
				default: ''
			},
			size: {
				default: 'mini',
			},
			type: {
				default: '',
			}
		},
		methods: {
			click() {
				this.$emit('click')
			},
		}
	}
</script>