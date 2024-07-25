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
	  LabelStyle,
	  VerticalOrigin,
	  Cesium3DTileset,
	  CustomDataSource,
	  ScreenSpaceEventHandler,
	  ScreenSpaceEventType
	} from 'cesium';
	import * as Cesium from 'cesium';
	import "cesium/Build/Cesium/Widgets/widgets.css";
	import AddMapmarker from './AddMapmarker.svelte';
	import { coordinates } from './store.js';
	import ShareButton from './Sharebutton.svelte';

	// Declare global variables and states
	let showModal = false;
	let showModalButton = false;
	let modalRecord = null;
	let viewer: Viewer;
	let db: IDBDatabase;
	let customDataSource = new CustomDataSource('locationpins');
  
	// Function to open connection to IndexedDB
	const openDB = (): Promise<IDBDatabase> => {
	  return new Promise((resolve, reject) => {
		const request = indexedDB.open('indexeddbstore', 1);
  
		request.onupgradeneeded = function(event: IDBVersionChangeEvent) {
		  db = request.result;
		  // Create object stores if they do not exist
		  if (!db.objectStoreNames.contains('locationpins')) {
			db.createObjectStore('locationpins', { keyPath: 'mapid' });
		  }
		  if (!db.objectStoreNames.contains('client')) {
			db.createObjectStore('client', { keyPath: 'appid' });
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
	  // Clear existing entities from the customDataSource before fetching new records
	  customDataSource.entities.removeAll();
  
	  const transaction = db.transaction('locationpins', 'readonly');
	  const objectStore = transaction.objectStore('locationpins');
  
	  const cursorRequest = objectStore.openCursor();
  
	  cursorRequest.onsuccess = function(event: Event) {
		const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
		if (cursor) {
		  // Process each record
		  addLabelForRecord(cursor.value);
		  cursor.continue();
		}
	  };
  
	  cursorRequest.onerror = function(event: Event) {
		console.error('Error in cursor request:', cursorRequest.error);
	  };
  
	  transaction.oncomplete = function(event: Event) {
		// Transaction completed
	  };
  
	  transaction.onerror = function(event: Event) {
		console.error('Error in transaction:', transaction.error);
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
		  disableDepthTestDistance: Number.POSITIVE_INFINITY,
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
		const height = 0;
  
		const userPosition = Cartesian3.fromDegrees(longitude, latitude, height);
		const pointColor = Color.GREEN;
  
		const userLocationEntity = createPulsatingPoint(viewer, 'Your Location!', userPosition, pointColor);
  
		viewer.entities.add(userLocationEntity);
  
		// Optional: Fly to the user's location
		viewer.camera.flyTo({
		  destination: Cartesian3.fromDegrees(longitude, latitude, 10000000.0),
		});
	  }
	};
  
	// Function to add label and simple point for a record
	const addLabelForRecord = (record: { mapid: string, latitude: string, longitude: string, title: string }) => {
	  const latitude = parseFloat(record.latitude);
	  const longitude = parseFloat(record.longitude);
  
	  if (!isNaN(latitude) && !isNaN(longitude)) {
		const position = Cartesian3.fromDegrees(longitude, latitude, 0);
  
		// Create a simple point entity for the record
		const pointEntity = new Entity({
		  id: record.mapid + "_point",
		  position: position,
		  point: {
			pixelSize: 10,
			color: Color.RED,
			disableDepthTestDistance: Number.POSITIVE_INFINITY,
		  }
		});
		
		function insertLineBreaks(text, maxChars) {
  let lines = [];
  let words = text.split(' ');
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine.length + word.length) <= maxChars) {
      currentLine += word + ' ';
    } else {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    }
  });

  // Push the last line
  if (currentLine !== '') {
    lines.push(currentLine.trim());
  }

  return lines.join('\n');
}


		// Create a label for the record
		const labelEntity = new Entity({
		  id: record.mapid + "_label",
		  position: position,
		  label: {
			text: insertLineBreaks(record.title, 25),
			font: '24px sans-serif',
			fillColor: Color.BLACK,
			outlineColor: Color.WHITE,
			outlineWidth: 2,
			style: LabelStyle.FILL_AND_OUTLINE,
			verticalOrigin: VerticalOrigin.BOTTOM,
			pixelOffset: new Cartesian2(0, -9),
			disableDepthTestDistance: Number.POSITIVE_INFINITY,
		  }
		});
  
		customDataSource.entities.add(pointEntity);
		customDataSource.entities.add(labelEntity);
	  } else {
		console.error('Invalid latitude or longitude for record:', record);
	  }
	};
  
	// Initialization on mount
	onMount(async () => {
	  // Set Cesium's base URL and access token
	  window.CESIUM_BASE_URL = './';

	  const ionaccesstoken = import.meta.env.VITE_ION_ACCESS_TOKEN;
	  Ion.defaultAccessToken = ionaccesstoken;
	  
	  // Initialize Cesium viewer with specified configuration options
	  viewer = new Viewer('cesiumContainer', {
		animation: false,
		baseLayerPicker: false,
		fullscreenButton: false,
		vrButton: true,
		geocoder: false,
		homeButton: false,
		infoBox: true,
		sceneModePicker: false,
		selectionIndicator: false,
		timeline: false,
		navigationHelpButton: false,
		shouldAnimate: true
	  });
  
	  // Load Cesium 3D Tileset from Cesium Ion using the specified asset ID (2275207=Google Photorealistic Earth)
	  try {
		const tileset = await Cesium3DTileset.fromIonAssetId(2275207);
		viewer.scene.primitives.add(tileset);
	  } catch (error) {
		console.log(error);
	  }
  
	  // Open IndexedDB and fetch initial records
	  try {
		db = await openDB();
		fetchRecordsFromIndexedDB();
	  } catch (error) {
		console.error('Failed to open IndexedDB:', error);
	  }
  
	  // Call functions to add user location and label for records
	  addUserLocation();
  
	  // Periodically fetch records from IndexedDB every 5000 milliseconds
	  setInterval(fetchRecordsFromIndexedDB, 5000);
  
	  // Add the custom data source with clustering enabled
	  customDataSource.clustering.enabled = true;
	  customDataSource.clustering.pixelRange = 30;
	  customDataSource.clustering.minimumClusterSize = 2;
	  customDataSource.clustering.clusterLabels = true;
	  customDataSource.clustering.clusterPoints = false;
  
	  viewer.dataSources.add(customDataSource);



	  // Pick entitities
	  viewer.screenSpaceEventHandler.setInputAction(async function onLeftClick(movement) {
  const pickedFeature = viewer.scene.pick(movement.position);
  if (!pickedFeature || !pickedFeature.id) {
    return;
  }

  const entityId = pickedFeature.id.id;
  const mapid = entityId.replace(/(_point|_label)$/, '');

  const transaction = db.transaction('locationpins', 'readonly');
  const objectStore = transaction.objectStore('locationpins');
  const request = objectStore.get(mapid);

  request.onsuccess = function(event: Event) {
    const record = request.result;
    if (record) {
      // Show the modal and display the record
      showModal = true;
      // Assuming you have a reactive variable for the record to be displayed in the modal
      modalRecord = record;
    }
  };

  request.onerror = function(event: Event) {
    console.error('Error fetching record:', request.error);
  };
}, ScreenSpaceEventType.LEFT_CLICK);


// Pick coordinates

let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
let pointEntity; // Reference to the point entity

handler.setInputAction(function(result) {

										// If a point entity already exists, remove it
										if (pointEntity) {
											viewer.entities.remove(pointEntity);
										}

										// pick position
										const cartesian = viewer.scene.pickPosition(result.position);
										// save Cartesian coordinates (x,y,z)
										const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
										
										// convert from Cartesian to Degrees and shorten the numbers to 7 digits after comma
										const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
										const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
										
										coordinates.set({ latitude: latitudeString, longitude: longitudeString });

										// Add a green point entity at the picked position and save the reference
										pointEntity = viewer.entities.add({
											position: cartesian,
											point: {
												pixelSize: 20,
												color: Cesium.Color.GREEN,
												disableDepthTestDistance: Number.POSITIVE_INFINITY,
											}
										});

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);





	});
  
	// Function to open modal
	function openModalButton() {
	  showModalButton = true;
	}
  
	// Function to close modal
	function closeModalButton() {
	  showModalButton = false;
	}

	// Function to open modal
	function openModal() {
	  showModal = true;
	}
  
	// Function to close modal
	function closeModal() {
	  showModal = false;
	}
	
	// Function to format the timestamp on the posts
	function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    // extract parts of the timestamp
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Monate sind 0-basiert
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    // formating the timestamp output
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds} UTC`;
  }

  </script>
  
  <main id="cesiumContainer"></main>
<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="addbutton" on:click={openModalButton}>+</div>

  {#if showModalButton}
	<div class="modal">
	  <div class="modal-content">
		<table>
		  <tr>
			<td><AddMapmarker /></td>
		  </tr>
		  <tr>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<td><span class="close" on:click={closeModalButton}>Close</span></td>
		  </tr>
		</table>
	  </div>
	</div>
  {/if}
  
  

  {#if showModal && modalRecord}
<div class="modal">
  <div class="modal-content">
    <h2>{modalRecord.title}</h2>
    <p>{modalRecord.text}</p>
    <p><a class="enterbutton" target="_blank" href={modalRecord.link}>Join Brainstorm Session</a></p>
	<div class="sharebutton"><ShareButton 
        title={modalRecord.title} 
        text={modalRecord.text} 
        link={modalRecord.link} 
      /></div>
    <p>CREATED {formatTimestamp(modalRecord.timestamp)}</p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span class="close" on:click={closeModal}>Close</span>
  </div>
</div>
{/if}




<style>
	#cesiumContainer {
	  width: 100%;
	  height: 100vh;
	  display: block;
	}
  
	main {
	  height: 100vh;
	  width: 100vw;
	  margin: 0;
	  padding: 0;
	}

	.addbutton {
	width: 50px;
	height: 50px;
    cursor: pointer;
    position: fixed;
    bottom: 0.1em;
    left: 0.1em;
    z-index: 1000;
	color: #edffff;
	background-color: transparent;
	font-size: xx-large;
	font-weight: 900;
	}

	.addbutton:hover {
		color: #abd6ff;
	}

	.enterbutton {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
    }
  
    .enterbutton:hover {
      background-color: #0056b3;
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
	  padding: 10px;
	  border-radius: 5px;
	  width: 90%;
	  max-width: 800px;
	}
  
	.close {
	  cursor: pointer;
	  font-size: 18px;
	  padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      background-color: red;
      color: white;
      border: none;
      border-radius: 5px;
	  padding-bottom: 5px;
	  position: absolute; /* Position it absolutely to overlay */
      bottom: 10px; /* Align to the top of the cesium container */
      left: 50%; /* Center horizontally */
      transform: translateX(-50%); /* Adjust for exact centering */
	}
</style>
  