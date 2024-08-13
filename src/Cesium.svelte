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
	  ScreenSpaceEventType,
	} from 'cesium';
	import * as Cesium from 'cesium';
	import "cesium/Build/Cesium/Widgets/widgets.css";
	import CategoryChoice from "./DAPPS/HomeScreen/CategoryChoice.svelte";   
	import { coordinates } from './store.js';
	import ShareButton from './Sharebutton.svelte';
	import { fade } from 'svelte/transition';

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
		  color: Cesium.Color.fromCssColorString('#4285F4'), // Blue color
        outlineColor: Cesium.Color.WHITE, // White edge
        outlineWidth: 1, // Width of the white edge
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
		const height = 100;
  
		const userPosition = Cartesian3.fromDegrees(longitude, latitude, height);
		
		
  
		const userLocationEntity = createPulsatingPoint(viewer, 'Your Location!', userPosition);
		
		viewer.entities.add(userLocationEntity);
		
		setTimeout(() => {
      // Fly to the user's location
		viewer.camera.flyTo({
		  destination: Cartesian3.fromDegrees(longitude, latitude, 20000000.0),
		});
    	}, 3000);


	  }
	};
  
	// Function to add label and simple point for a record
	const addLabelForRecord = (record: { mapid: string, latitude: string, longitude: string, title: string }) => {
	  const latitude = parseFloat(record.latitude);
	  const longitude = parseFloat(record.longitude);
  
	  if (!isNaN(latitude) && !isNaN(longitude)) {
		const position = Cartesian3.fromDegrees(longitude, latitude, 100);
		
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
			fillColor: Color.WHITE,
			outlineColor: Color.BLACK,
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
	  // FOR LIVE EDIT: Ion.defaultAccessToken = 'yourtoken';
	  // TO USE THE GLOBE IN LIVE EDIT GET A FREE API KEY AT https://ion.cesium.com/

	  // Initialize Cesium viewer with specified configuration options
	  viewer = new Viewer('cesiumContainer', {
		animation: false,
		fullscreenButton: false,
		vrButton: true,
		geocoder: false,
		homeButton: false,
		infoBox: true,
		selectionIndicator: false,
		timeline: false,
		navigationHelpButton: false,
		shouldAnimate: true,
		skyBox: false,
		contextOptions: {
		webgl: {
		alpha: true
		},
		},
		// 2D and Columbus View are not currently supported
		// for global 3D Tiles tilesets
		sceneModePicker: false,
		// Imagery layers are not currently supported for
		// global 3D Tiles tilesets
		baseLayerPicker: false,
	  });
	
	viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
	
	// Load Cesium 3D Tileset from Cesium Ion using the specified asset ID (2275207=Google Photorealistic Earth)
	try {const tileset = await Cesium3DTileset.fromIonAssetId(2275207);viewer.scene.primitives.add(tileset);

	// Initially hide the 3D tileset
    tileset.show = true;
		
    // Set up a camera move end event listener
    viewer.camera.moveEnd.addEventListener(function () {
      const height = viewer.camera.positionCartographic.height; console.log(`Distance to ground ${Math.floor(height / 1000)} km`);

      if (height > 6000000) {
        // Show the base layer and hide the 3D tileset
        globe.show = true;
        tileset.show = false;
      } else {
        // Hide the base layer and show the 3D tileset
        globe.show = false;
        tileset.show = true;
      }
    });
	
	} catch (error) {console.log(error);}
6
	// Get the current camera position in Cartographic coordinates (longitude, latitude, height)
    var cameraPosition = viewer.scene.camera.positionCartographic;

    // Update the camera's position with the new height
	viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromRadians(
            cameraPosition.longitude,
            cameraPosition.latitude,
            20000000
        ),
        orientation: {
            heading: viewer.scene.camera.heading,
            pitch: viewer.scene.camera.pitch,
            roll: viewer.scene.camera.roll
        }
    });

	  // Atmosphere
	  const scene = viewer.scene;
		const globe = scene.globe;
		const skyAtmosphere = scene.skyAtmosphere;

		scene.highDynamicRange = true;
		globe.enableLighting = true;
		globe.atmosphereLightIntensity = 20.0;

		// Function to get the current time in ISO 8601 format
	function getCurrentTimeIso8601() {
		const now = new Date();
		return now.toISOString();
		}

    // Get the current time in ISO 8601 format and update the viewer's clock
    const currentTime = getCurrentTimeIso8601();
    viewer.clock.currentTime = JulianDate.fromIso8601(currentTime);

	const canvas = viewer.canvas;
	canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
	canvas.onclick = function () {
	canvas.focus();
	};

	const defaultGroundAtmosphereLightIntensity =
	globe.atmosphereLightIntensity;
	const defaultGroundAtmosphereRayleighCoefficient =
	globe.atmosphereRayleighCoefficient;
	const defaultGroundAtmosphereMieCoefficient =
	globe.atmosphereMieCoefficient;
	const defaultGroundAtmosphereMieAnisotropy =
	globe.atmosphereMieAnisotropy;
	const defaultGroundAtmosphereRayleighScaleHeight =
	globe.atmosphereRayleighScaleHeight;
	const defaultGroundAtmosphereMieScaleHeight =
	globe.atmosphereMieScaleHeight;
	const defaultGroundAtmosphereHueShift = globe.atmosphereHueShift;
	const defaultGroundAtmosphereSaturationShift =
	globe.atmosphereSaturationShift;
	const defaultGroundAtmosphereBrightnessShift =
	globe.atmosphereBrightnessShift;
	const defaultLightFadeOut = globe.lightingFadeOutDistance;
	const defaultLightFadeIn = globe.lightingFadeInDistance;
	const defaultNightFadeOut = globe.nightFadeOutDistance;
	const defaultNightFadeIn = globe.nightFadeInDistance;

	const defaultSkyAtmosphereLightIntensity =
	skyAtmosphere.atmosphereLightIntensity;
	const defaultSkyAtmosphereRayleighCoefficient =
	skyAtmosphere.atmosphereRayleighCoefficient;
	const defaultSkyAtmosphereMieCoefficient =
	skyAtmosphere.atmosphereMieCoefficient;
	const defaultSkyAtmosphereMieAnisotropy =
	skyAtmosphere.atmosphereMieAnisotropy;
	const defaultSkyAtmosphereRayleighScaleHeight =
	skyAtmosphere.atmosphereRayleighScaleHeight;
	const defaultSkyAtmosphereMieScaleHeight =
	skyAtmosphere.atmosphereMieScaleHeight;
	const defaultSkyAtmosphereHueShift = skyAtmosphere.hueShift;
	const defaultSkyAtmosphereSaturationShift =
	skyAtmosphere.saturationShift;
	const defaultSkyAtmosphereBrightnessShift =
	skyAtmosphere.brightnessShift;

	const viewModel = {
	// Globe settings

	enableTerrain: false,
	enableLighting: true,
	groundTranslucency: false,

	// Ground atmosphere settings

	showGroundAtmosphere: true,
	groundAtmosphereLightIntensity: defaultGroundAtmosphereLightIntensity,
	groundAtmosphereRayleighCoefficientR:
		defaultGroundAtmosphereRayleighCoefficient.x / 1e-6,
	groundAtmosphereRayleighCoefficientG:
		defaultGroundAtmosphereRayleighCoefficient.y / 1e-6,
	groundAtmosphereRayleighCoefficientB:
		defaultGroundAtmosphereRayleighCoefficient.z / 1e-6,
	groundAtmosphereMieCoefficient:
		defaultGroundAtmosphereMieCoefficient.x / 1e-6,
	groundAtmosphereRayleighScaleHeight: defaultGroundAtmosphereRayleighScaleHeight,
	groundAtmosphereMieScaleHeight: defaultGroundAtmosphereMieScaleHeight,
	groundAtmosphereMieAnisotropy: defaultGroundAtmosphereMieAnisotropy,
	groundHueShift: defaultGroundAtmosphereHueShift,
	groundSaturationShift: defaultGroundAtmosphereSaturationShift,
	groundBrightnessShift: defaultGroundAtmosphereBrightnessShift,
	lightingFadeOutDistance: defaultLightFadeOut,
	lightingFadeInDistance: defaultLightFadeIn,
	nightFadeOutDistance: defaultNightFadeOut,
	nightFadeInDistance: defaultNightFadeIn,

	// Sky atmosphere settings

	showSkyAtmosphere: true,
	skyAtmosphereLightIntensity: defaultSkyAtmosphereLightIntensity,
	skyAtmosphereRayleighCoefficientR:
		defaultSkyAtmosphereRayleighCoefficient.x / 1e-6,
	skyAtmosphereRayleighCoefficientG:
		defaultSkyAtmosphereRayleighCoefficient.y / 1e-6,
	skyAtmosphereRayleighCoefficientB:
		defaultSkyAtmosphereRayleighCoefficient.z / 1e-6,
	skyAtmosphereMieCoefficient:
		defaultSkyAtmosphereMieCoefficient.x / 1e-6,
	skyAtmosphereRayleighScaleHeight: defaultSkyAtmosphereRayleighScaleHeight,
	skyAtmosphereMieScaleHeight: defaultSkyAtmosphereMieScaleHeight,
	skyAtmosphereMieAnisotropy: defaultSkyAtmosphereMieAnisotropy,
	skyHueShift: defaultSkyAtmosphereHueShift,
	skySaturationShift: defaultSkyAtmosphereSaturationShift,
	skyBrightnessShift: defaultSkyAtmosphereBrightnessShift,
	perFragmentAtmosphere: false,
	dynamicLighting: true,
	dynamicLightingFromSun: false,

	// Fog settings

	showFog: true,
	density: 1.0,
	minimumBrightness: 0.03,

	// Scene settings

	hdr: true,
	};

	
  
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
      // Pick position
      const cartesian = viewer.scene.pickPosition(result.position);
      if (!cartesian) return;

      // Save Cartesian coordinates (x, y, z)
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);

      // Convert from Cartesian to Degrees and shorten the numbers to 7 digits after comma
      const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
      const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);

      coordinates.set({ latitude: latitudeString, longitude: longitudeString });

      // If a point entity already exists, remove it
      if (pointEntity) {
        viewer.entities.remove(pointEntity);
      }

      // Add a green point entity at the picked position and save the reference
      pointEntity = viewer.entities.add({
        id: "pickedPoint", // Unique ID for the entity
        position: cartesian,
        point: {
          pixelSize: 20,
          color: Cesium.Color.GREEN,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }
      });
	  

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Add a click event listener to the viewer
    viewer.screenSpaceEventHandler.setInputAction(function(click) {
      const pickedObject = viewer.scene.pick(click.position);
      if (!Cesium.defined(pickedObject) || !pickedObject.id) return;

      if (pickedObject.id.id === "pickedPoint") {
        openModalButton();
      } else {
        const entityId = pickedObject.id.id;
        const mapid = entityId.replace(/(_point|_label)$/, '');

        const transaction = db.transaction('locationpins', 'readonly');
        const objectStore = transaction.objectStore('locationpins');
        const request = objectStore.get(mapid);

        request.onsuccess = function(event) {
          const record = request.result;
          if (record) {
            showModal = true;
            modalRecord = record;
          }
        };

        request.onerror = function(event) {
          console.error('Error fetching record:', request.error);
        };
      }
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
<div style="width: 100%; display: flex; justify-content: center; align-items: center;">
  <main id="cesiumContainer"></main>
</div>  




  {#if showModalButton}
	<div class="modal" transition:fade={{ duration: 500 }}>
	  <div class="modal-category">
	




		<div class="close float-right" on:click={closeModalButton}>
			<svg viewBox="0 0 36 36" class="circle">
			  <path
				stroke-dasharray="100, 100"
				d="M18 2.0845
				  a 15.9155 15.9155 0 0 1 0 31.831
				  a 15.9155 15.9155 0 0 1 0 -31.831"
			  />
			</svg>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		  </div>
	
	
	
	
	
		
		<div><CategoryChoice /></div>
		
	  </div>
	</div>
	{/if}
  
  

  {#if showModal && modalRecord}
<div class="modal" transition:fade={{ duration: 500 }}>
  <div class="modal-record">





	<div class="close float-right" on:click={closeModal}>
		<svg viewBox="0 0 36 36" class="circle">
		  <path
			stroke-dasharray="100, 100"
			d="M18 2.0845
			  a 15.9155 15.9155 0 0 1 0 31.831
			  a 15.9155 15.9155 0 0 1 0 -31.831"
		  />
		</svg>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
	  </div>





	  <div>
    <h2>{modalRecord.title}</h2>
    <p>{modalRecord.text}</p>
	</div>
	<div>
    <p><button class="glassmorphism"><a target="_blank" href={modalRecord.link}>Join Brainstorm Session</a></button></p>
	</div>
	<div><ShareButton 
        title={modalRecord.title} 
        text={modalRecord.text} 
        link={modalRecord.link} 
      /></div>
	  <br>
    <p>CREATED {formatTimestamp(modalRecord.timestamp)}</p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
  </div>
</div>
{/if}




<style>
	main {
	  width: 100%;
	  height: 100vh;
	  margin: 0;
	  padding: 0;
	opacity: 0; /* Initial state */
	animation: fade-in-scale-up 3s ease-in-out forwards; /* Apply the fade-in animation */
	animation-delay: 1s;
	}

	:global(.cesium-button.cesium-vrButton) {
	display: block;
	width: 100%;
	height: 100%;
	margin: 0;
	border-radius: 0;
	opacity: 0;
	animation: fade-in 3s ease-in-out forwards; /* Apply the fade-in animation */
	animation-delay: 4s;
	z-index: 60;
	}

	:global(.cesium-widget-credits){
	opacity: 0;
	animation: fade-in 3s ease-in-out forwards; /* Apply the fade-in animation */
	animation-delay: 4s;
	}

	a {
    color: inherit;
    text-decoration: none;
	}

	a:hover,
	a:visited,
	a:active {
		color: inherit;
		text-decoration: none;
	}

	button {
      padding: 10px 20px;
      
      cursor: pointer;
      color: white;
      border: none;
      border-radius: 5px;
      width: 100%;
    }
  
    button:hover {
      background-color: #abd6ff;
    }

	.modal { 
	display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
	}

	.modal-category {
	width: 95%;
	max-width: 800px; 
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	background-color: rgba(0, 0, 0, 0.5);
	}

	.modal-record {
	  width: 90%;
	  max-width: 800px;
	  border-radius: 15px;
   	  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	  background-color: rgba(0, 0, 0, 0.5);
	  padding: 20px;
	}

	.float-right {
        float: right;
    }

	.glassmorphism{
	/* Apply glassmorphism style for the modal content */
	background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

	

	.close {
  --size: 22px;
  --borderSize: 2px;
  --borderColor: rgba(255, 255, 255, 1);
  --speed: 0.5s;

  width: var(--size);
  height: var(--size);
  position: relative;
  background: #455A64;
  border-radius: 50%;
  box-shadow: 0 0 20px -5px rgba(255, 255, 255, 0.5);
  transition: 0.25s ease-in-out;
  cursor: pointer;
  animation: fade-in-scale-down var(--speed) ease-out 0.25s both;
}

/* Keyframes for fade-in-scale down effect */
@keyframes fade-in-scale-down {
    from {
        opacity: 0;
        transform: scale(1.1); /* Optional: add a slight zoom-in effect */
    }
    to {
        opacity: 1;
        transform: scale(1); /* Reset to normal scale */
    }
}

/* Keyframes for fade-in-scale-up effect */
@keyframes fade-in-scale-up {
    from {
        opacity: 0;
        transform: scale(0.01); /* Optional: add a slight zoom-in effect */
    }
    to {
        opacity: 1;
        transform: scale(1); /* Reset to normal scale */
    }
}

/* Keyframes for fade-in effect */
@keyframes fade-in {
    from {
        opacity: 0;
        }
    to {
        opacity: 1;
        }
}

.close .circle path {
  stroke: var(--borderColor);
  fill: none;
  stroke-width: calc(var(--borderSize) / 2);
  stroke-linecap: round;
  animation: progress var(--speed) ease-out 0.25s both;
}

@keyframes progress {
  from {
    stroke-dasharray: 0 100;
  }
}

.close span {
  display: block;
  width: calc(var(--size) / 4 - 2px);
  height: var(--borderSize);
  background: var(--borderColor);
  box-shadow: 0 0 20px -5px rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  position: absolute;
  --padding: calc(var(--size) / 3);
  transition: 0.25s ease-in-out;
  animation: slide-in var(--speed) ease-in-out 0.25s both;
}

@keyframes slide-in {
  from {
    width: 0;
  }
}

.close span:nth-child(2) {
  top: calc(var(--padding) - var(--borderSize) / 2);
  left: var(--padding);
  transform: rotate(45deg);
  transform-origin: top left;
}

.close span:nth-child(3) {
  top: calc(var(--padding) - var(--borderSize) / 2);
  right: var(--padding);
  transform: rotate(-45deg);
  transform-origin: top right;
}

.close span:nth-child(4) {
  bottom: calc(var(--padding) - var(--borderSize) / 2);
  left: var(--padding);
  transform: rotate(-45deg);
  transform-origin: bottom left;
}

.close span:nth-child(5) {
  bottom: calc(var(--padding) - var(--borderSize) / 2);
  right: var(--padding);
  transform: rotate(45deg);
  transform-origin: bottom right;
}

.close:hover {
  background: #37474F;
}

.close:hover span {
  width: calc(var(--size) / 4);
}
</style>
  