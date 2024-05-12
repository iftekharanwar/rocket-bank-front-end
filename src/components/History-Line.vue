<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

const props = defineProps({
  chartData: Array
})

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

const formatDate = (date) => {
  const options = { month: 'numeric', day: 'numeric' }
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const data = {
  labels: props.chartData.map((item) => formatDate(item.date)),
  datasets: [
    {
      data: props.chartData.map((item) => item.balance),
      borderColor: 'white',
      backgroundColor: 'blue'
    }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: 'bottom'
    }
  },
  elements: {
    point: {
      radius: 5
    },
    line: {
      tension: 0.5
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'white'
      },
      grid: {
        display: false,
        color: 'grey'
      }
    },

    y: {
      beginAtZero: true,
      ticks: {
        color: 'white',
        padding: 10,
        callback: function (value) {
          return formatAmount(value)
        }
      },
      grid: {
        color: 'grey'
      },
      border: {
        display: false
      }
    }
  }
}
</script>

<template>
  <section class="history-line">
    <Line :data="data" :options="options" />
  </section>
</template>

<style lang="scss" scoped>
.history-line {
  flex: auto;
  margin-top: 1rem;
  width: 100%;
  height: 290px;
  background-color: var(--dark3);
  padding: 1rem;
  border-radius: 10px;
}
</style>
