<script lang="ts">
	// Import necessary modules from Cesium and Svelte
	import { onMount } from 'svelte';
	import {
	  Ion,
	  Viewer,
	  Cartesian2,
	  Cartesian3,
	  Color,
	  Entity,
	  JulianDate,
	  SampledProperty,
	  ClockRange,
	  HermitePolynomialApproximation,
	  Cesium3DTileset,
	  LabelStyle,
	  VerticalOrigin
	} from 'cesium';
	import "cesium/Build/Cesium/Widgets/widgets.css";
	import AddMapmarker from './AddMapmarker.svelte';
  
	// Declare global variables and states
	let showModal = false;
	let viewer: Viewer;
	let db: IDBDatabase;
  
	// Function to open connection to IndexedDB
	const openDB = () => {
	  return new Promise((resolve, reject) => {
		const request = indexedDB.open('indexeddbstore', 1);
  
		request.onupgradeneeded = function(event: IDBVersionChangeEvent) {
		  db = request.result;
		  if (!db.objectStoreNames.contains('locationpins')) {
			db.createObjectStore('locationpins', { keyPath: 'mapid' });
		  }
		};
  
		request.onsuccess = function(event: Event) {
		  db = request.result;
		  resolve(db);
		};
  
		request.onerror = function(event: Event) {
		  console.error('Error opening IndexedDB:', request.error);
		  reject(request.error);
		};
	  });
	};
  
	// Function to fetch and process records from IndexedDB
	const fetchRecordsFromIndexedDB = () => {
	  const transaction = db.transaction('locationpins', 'readonly');
	  const objectStore = transaction.objectStore('locationpins');
  
	  transaction.oncomplete = function(event: Event) {
		// Transaction completed
	  };
  
	  transaction.onerror = function(event: Event) {
		console.error('Error in transaction:', transaction.error);
	  };
  
	  objectStore.openCursor().onsuccess = function(event: Event) {
		const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
		if (cursor) {
		  // Process each record
		  addLabelForRecord(cursor.value);
		  cursor.continue();
		}
	  };
	};
  
	// Function to create a pulsating point entity
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
  
	// Function to fetch user's geolocation
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
  
	// Function to add user's location as a pulsating point on the map
	const addUserLocation = async () => {
	  let userLocation: GeolocationPosition | null = null;
	  try {
		userLocation = await getLocationFromNavigator();
	  } catch (error) {
		console.error(error);
		return;
	  }
  
	  if (userLocation !== null) {
		const longitude = userLocation.coords.longitude;
		const latitude = userLocation.coords.latitude;
		const height = 0; // Ground level
  
		const userPosition = Cartesian3.fromDegrees(longitude, latitude, height);
		const pointColor = Color.GREEN;
  
		const userLocationEntity = createPulsatingPoint(viewer, 'user-location', userPosition, pointColor);
  
		viewer.entities.add(userLocationEntity);
  
		// Optional: Fly to the user's location
		viewer.camera.flyTo({
		  destination: Cartesian3.fromDegrees(longitude, latitude, 10000000.0),
		});
	  }
	};
  
	// Function to add label and simple point for a record
	const addLabelForRecord = (record: { latitude: string, longitude: string, title: string }) => {
	  const latitude = parseFloat(record.latitude);
	  const longitude = parseFloat(record.longitude);
  
	  if (!isNaN(latitude) && !isNaN(longitude)) {
		const position = Cartesian3.fromDegrees(longitude, latitude);
  
		// Create a simple point entity for the record
		const pointEntity = new Entity({
		  position: position,
		  point: {
			pixelSize: 10,
			color: Color.RED,
		  }
		});
		viewer.entities.add(pointEntity);
  
		// Create a label for the record
		viewer.entities.add({
		  position: position,
		  label: {
			text: record.title,
			font: '24px sans-serif',
			fillColor: Color.BLACK,
			outlineColor: Color.WHITE,
			outlineWidth: 2,
			style: LabelStyle.FILL_AND_OUTLINE,
			verticalOrigin: VerticalOrigin.BOTTOM,
			pixelOffset: new Cartesian2(0, -9),
		  }
		});
	  } else {
		console.error('Invalid latitude or longitude for record:', record);
	  }
	};
  
	// Function to add a new record to IndexedDB
	const addRecordToIndexedDB = (record: { mapid: string, latitude: string, longitude: string, title: string }) => {
	  const transaction = db.transaction('locationpins', 'readwrite');
	  const objectStore = transaction.objectStore('locationpins');
  
	  const request = objectStore.add(record);
  
	  request.onsuccess = function(event: Event) {
		console.log('Record added successfully:', event);
	  };
  
	  request.onerror = function(event: Event) {
		console.error('Error adding record:', request.error);
	  };
	};
  
	// Initialization on mount
	onMount(async () => {
	  // Set Cesium's base URL and access token
	  window.CESIUM_BASE_URL = './';
	  Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOThiNzJiOC1iNDFhLTQ4ZGMtODc0Zi0wYjJmZWIyMjZkNzAiLCJpZCI6NDcwNzcsImlhdCI6MTcwMDY3Mzk1Mn0.5AKEDm3pPCzy9lr4NKYFtK2sLLQKJyEDo2VxQib0A4w';
  
	  // Initialize Cesium viewer with specified configuration options
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
  
	  // Load Cesium 3D Tileset from Cesium Ion using the specified asset ID (2275207=Google Earth)
	  //try {
		//const tileset = await Cesium3DTileset.fromIonAssetId(2275207);
		//viewer.scene.primitives.add(tileset);
	  //} catch (error) {
		//console.log(error);
	  //}
  
	  // Open IndexedDB and set interval for fetching records
	  try {
		await openDB();
		fetchRecordsFromIndexedDB();
		setInterval(fetchRecordsFromIndexedDB, 5000); // Check IndexedDB every 5000ms
	  } catch (error) {
		console.error('Failed to open IndexedDB:', error);
	  }
  
	  // Call functions to add user location and label for records
	  addUserLocation();
	});
  
	// Function to open modal
	function openModal() {
	  showModal = true;
	}
  
	// Function to close modal
	function closeModal() {
	  showModal = false;
	}
  </script>
  
  <main id="cesiumContainer"></main>
  <button class="buttononglobe" on:click={openModal}>Add mapmarker (BV001)</button>
  
  {#if showModal}
  <div class="modal">
	<div class="modal-content">
	  <table>
		<tr>
		  <td><AddMapmarker /></td>
		  <!-- svelte-ignore a11y-click-events-have-key-events -->
		  <!-- svelte-ignore a11y-no-static-element-interactions -->
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
  