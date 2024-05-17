<script lang="ts">
	import { onMount } from 'svelte';
	import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
	import '../node_modules/cesium/Build/Cesium/Widgets/widgets.css'

  Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkOWYxN2ViMy00ZmM2LTQzNjMtOGZhZC02NDg2ZmY5MDY4MGMiLCJpZCI6MjE1NzcxLCJpYXQiOjE3MTU4OTUxNTd9.29sj9Ay7XCd14X0Z9s-15mMTqcZX1l-PkVo5NHqCKh8';

	window.CESIUM_BASE_URL = './';

    let viewer: Viewer;
	onMount(async () => {
		viewer = new Viewer('cesiumContainer');
	});
	
</script>

<div id="cesiumContainer">
</div>

<style>
	#cesiumContainer {
		width: 100%;
		height: 100vh; /* Setzen Sie die Höhe auf 100% der Ansichtshöhe */
	}
</style>