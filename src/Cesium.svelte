<script lang="ts">
	import { onMount } from 'svelte';
	import { Ion, Viewer, Cartesian3, Color, Entity, JulianDate, SampledProperty, ClockRange, HermitePolynomialApproximation, ConstantProperty } from 'cesium';
	import "cesium/Build/Cesium/Widgets/widgets.css";
	import type Record from './AddMapmarker.svelte';
  	import AddMapmarker from './AddMapmarker.svelte';

	let showModal = false;
	let viewer: Viewer;
	let records: Record[] = [];

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	window.CESIUM_BASE_URL = './';
	

	
	onMount(async () => {
	
		Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOThiNzJiOC1iNDFhLTQ4ZGMtODc0Zi0wYjJmZWIyMjZkNzAiLCJpZCI6NDcwNzcsImlhdCI6MTcwMDY3Mzk1Mn0.5AKEDm3pPCzy9lr4NKYFtK2sLLQKJyEDo2VxQib0A4w';
		
		viewer = new Viewer('cesiumContainer', {
			animation: false,
			baseLayerPicker: true,
			fullscreenButton: false,
			vrButton: false,
			geocoder: true,
			homeButton: true,
			infoBox: true,
			sceneModePicker: true,
			selectionIndicator: false,
			timeline: false,
			navigationHelpButton: false,
			shouldAnimate: true
		});

		
		
	});

	const updateGlobePins = () => {
		viewer.entities.removeAll();
		for (const record of records) {
			viewer.entities.add(createRecordPin(record));
		}
	};

	const createRecordPin = (record: Record): Entity => {
		const position = Cartesian3.fromDegrees(parseFloat(record.longitude), parseFloat(record.latitude));
		const pulseEntity = createPulsatingPoint(viewer, record.id, position, Color.RED);

		pulseEntity.description = new ConstantProperty(`
			<h1>${record.title}</h1>
			<p>${record.text}</p>
			<a href="${record.link}" target="_blank">${record.link}</a><br>
			<em>${new Date(record.timestamp).toLocaleString()}</em>
		`);

		return pulseEntity;
	};

	const createPulsatingPoint = (viewer: Viewer, pointId: string, userDestination: Cartesian3, color: Color): Entity => {
		const start = JulianDate.now();
		const mid = JulianDate.addSeconds(start, 0.5, new JulianDate());
		const stop = JulianDate.addSeconds(start, 2, new JulianDate());

		viewer.clock.startTime = start;
		viewer.clock.currentTime = start;
		viewer.clock.stopTime = stop;
		viewer.clock.clockRange = ClockRange.LOOP_STOP;

		const pulseProperty = new SampledProperty(Number);
		pulseProperty.setInterpolationOptions({
			interpolationDegree: 3,
			interpolationAlgorithm: HermitePolynomialApproximation,
		});

		pulseProperty.addSample(start, 7.0);
		pulseProperty.addSample(mid, 15.0);
		pulseProperty.addSample(stop, 7.0);

		return new Entity({
			id: pointId,
			position: userDestination,
			point: {
				pixelSize: pulseProperty,
				color,
			},
		});
	};

	const getLocationFromNavigator = (): Promise<GeolocationPosition> => {
		return new Promise((resolve, reject) => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => resolve(position),
					(error) => reject(error)
				);
			} else {
				reject(new Error('Geolocation is not supported by this browser.'));
			}
		});
	};

	let userLocationCartesian: Cartesian3 | null = null;
	const userLocationPointId = 'user-location';

	onMount(async () => {
		let userLocation: GeolocationPosition | null = null;
		try {
			userLocation = await getLocationFromNavigator();
		} catch (error) {
			console.error(error);
		}

		let rotationPaused = true;
		let lastRotationTime: number | null = null;
		let eventHandler: (() => void) | null = null;

		const doRotate = (viewer: Viewer, rotationSpeed: number) => {
			if (rotationPaused) return;

			const now = Date.now();
			const delta = (now - (lastRotationTime ?? now)) / 1000;
			lastRotationTime = now;
			viewer.scene.camera.rotate(Cartesian3.UNIT_Z, rotationSpeed * delta);
		};

		const startRotation = (viewer: Viewer, rotationSpeed = 0.5) => {
			if (eventHandler !== null) {
				if (rotationPaused) {
					lastRotationTime = Date.now();
					rotationPaused = false;
				}
				return;
			}

			lastRotationTime = Date.now();
			eventHandler = () => doRotate(viewer, rotationSpeed);
			viewer.scene.postRender.addEventListener(eventHandler);
		};

		const stopRotation = () => {
			rotationPaused = true;
		};

		startRotation(viewer, -0.05);

		if (userLocation !== null) {
			viewer.camera.flyTo({
				destination: Cartesian3.fromDegrees(userLocation.coords.longitude, userLocation.coords.latitude, 10000000.0),
			});

			userLocationCartesian = Cartesian3.fromDegrees(userLocation.coords.longitude, userLocation.coords.latitude);

			addUserLocation(viewer, userLocation, userLocationCartesian, userLocationPointId);
		}
	});

	const addUserLocation = (viewer: Viewer, userLocation: GeolocationPosition, userLocationCartesian: Cartesian3, userLocationPointId: string) => {
		viewer.entities.add(
			createPulsatingPoint(viewer, userLocationPointId, Cartesian3.fromDegrees(userLocation.coords.longitude, userLocation.coords.latitude, 0), Color.GREEN)
		);
	};
</script>

<main id="cesiumContainer"></main>
<button class="buttononglobe" on:click={openModal}>Add mapmarker</button>

{#if showModal}
	<div class="modal">
		<div class="modal-content">
			<table>
				<tr>
				<td><AddMapmarker /></td>
				<td><span class="close" on:click={closeModal}>Close</span></td>
			  </tr>
			</table>
		</div>
	</div>
{/if}

<style>
	main {
		height: 100vh;
		width: 100vw;
		margin: 0;
		padding: 0;
	}
	.buttononglobe {
		position: fixed;
		top: 10px;
		left: 10px;
		z-index: 1000;
	}
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1001;
	}
	.modal-content {
		background-color: white;
		color: black;
		padding: 20px;
		border-radius: 5px;
	}
	.close {
		cursor: pointer;
		font-size: 18px;
	}
</style>
