<script setup>
import { GoogleMap, AdvancedMarker } from 'vue3-google-map'

const center = { lat: 40.689247, lng: -74.044502 }
const markerOptions = { position: center, title: 'LADY LIBERTY' }
const pinOptions = { background: '#FBBC04' }
</script>

<template>
  <GoogleMap
    api-key="AIzaSyD_-38IN5Bq5fxcy-F37ugTNwFeFvw5xSY"
    mapId="DEMO_MAP_ID"
    style="width: 100%; height: 80vh"
    :center="center"
    :zoom="15"
  >
    <AdvancedMarker :options="markerOptions" :pin-options="pinOptions"/>
    <AdvancedMarker :options="markerOptions">
       <div style="background: white; color: black; padding: 5px; border-radius: 5px">
        Custom Content
      </div>
    </AdvancedMarker>
  </GoogleMap>
</template>