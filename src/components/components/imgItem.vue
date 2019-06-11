<template>
	<div>
		<viewer v-if="path">
			<img class="resp-img" :style="{ width: width, maxWidth: width }" :src="imgURL + path" >
		</viewer>
		<span v-else>暂无图片</span>
	</div>
</template>
<script>
	import configs from '../../configs.js'
	export default {
		name: 'imgItem',
		data() {
			return {
				imgURL: configs.imgURL,
			}
		},
		props: {
			path: {
				default: ''
			},
			width: {
				default: '60px'
			}
		},
	}
</script>
<style lang="sass">
	.viewer-container.viewer-backdrop.viewer-fixed.viewer-fade.viewer-transition.viewer-in {
		z-index: 10000!important;
	}
</style>