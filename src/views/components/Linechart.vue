<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import zoomPlugin from 'chartjs-plugin-zoom'

// Chart.js core and elements
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  ScatterController
} from 'chart.js'
import { Scatter } from 'vue-chartjs'

// Register required Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  ScatterController,
  zoomPlugin
)

// Types
type GnssPoint = {
  refDateTime: number
  blU: number
  blE: number
  blN: number
}

type ScatterPoint = { x: string; y: number }

type ScatterData = {
  blU: ScatterPoint[]
  blE: ScatterPoint[]
  blN: ScatterPoint[]
}

// Reactive data
const blUChartData = ref()
const blEChartData = ref()
const blNChartData = ref()

// Common chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
    zoom: {
      zoom: {
        wheel: {
          enabled: true // ✅ zoom with mouse wheel
        },
        pinch: {
          enabled: true // ✅ zoom on touchpad
        },
        mode: 'xy' // ✅ zoom both axes
      },
      pan: {
        enabled: true,
        mode: 'xy'
      },
      limits: {
        x: { minRange: 1 },
        y: { minRange: 1 }
      }
    }
  },
  scales: {
    x: {
      type: 'category',
      title: { display: true, text: 'Date' }
    },
    y: {
      title: { display: true, text: 'Δ Value' }
    }
  }
}


// Data transformation
function mapGnssDisplacementToScatter(raw: GnssPoint[]): ScatterData {
	if (!raw.length) return { blU: [], blE: [], blN: [] }

	const baseline = raw[0]

	const formatDate = (unixSec: number) =>
		new Date(unixSec * 1000).toISOString().split('T')[0]

	return raw.map((point) => ({
		x: formatDate(point.refDateTime),
		deltaU: point.blU - baseline.blU,
		deltaE: point.blE - baseline.blE,
		deltaN: point.blN - baseline.blN
	})).reduce(
		(acc, cur) => {
			acc.blU.push({ x: cur.x, y: cur.deltaU })
			acc.blE.push({ x: cur.x, y: cur.deltaE })
			acc.blN.push({ x: cur.x, y: cur.deltaN })
			return acc
		},
		{ blU: [], blE: [], blN: [] } as ScatterData
	)
}

// Fetch and process data
async function fetchGnssDisplacement() {
	const url = '/api/api/GnssDisplacement/'

	const params = {
		netname: 'BASILICA',
		blname: 'INGR00ITA.GN0100ITA',
		sesslen: 1440,
		stdate: '2025-02-28T00:00:00',
		enddate: '2025-06-28T00:00:00'
	}

	const auth = {
		username: 'solgeo',
		password: 'solgeoBasilica25%'
	}

	const headers = {
		displayceKey: 'RELEASE100_MAG2017_DISPLAYCE_REST_API'
	}

	try {
		const response = await axios.get(url, {
			params,
			auth,
			headers
		})

		const scatterData = mapGnssDisplacementToScatter(response.data)

		blUChartData.value = {
			datasets: [
				{
					label: 'Δ blU',
					data: scatterData.blU,
					borderColor: 'red',
					backgroundColor: 'red',
					showLine: true
				}
			]
		}

		blEChartData.value = {
			datasets: [
				{
					label: 'Δ blE',
					data: scatterData.blE,
					borderColor: 'green',
					backgroundColor: 'green',
					showLine: true
				}
			]
		}

		blNChartData.value = {
			datasets: [
				{
					label: 'Δ blN',
					data: scatterData.blN,
					borderColor: 'blue',
					backgroundColor: 'blue',
					showLine: true
				}
			]
		}
  	} catch (error) {
		console.error('API Request Error:', error)
		throw error
  	}
}

onMounted(() => {
  	fetchGnssDisplacement()
})

</script>

<template>
  <div class=" flex-col gap-6">
    <Scatter class="w-full" v-if="blUChartData" :data="blUChartData" :options="chartOptions" />
    <Scatter v-if="blEChartData" :data="blEChartData" :options="chartOptions" />
    <Scatter v-if="blNChartData" :data="blNChartData" :options="chartOptions" />
  </div>
</template>
