<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { formatAmount, formatPercent } from '@/methods/AccountMethods'

const props = defineProps({
  donutData: Array
})

let expenses = 0.0
let income = 0
let sumOfTransitions = 0

console.log('donut data')
console.log(props.donutData)

props.donutData.map((item) => {
  if (item.type === 'CREDIT') {
    income += item.amount
    sumOfTransitions += item.amount
  } else {
    expenses += item.amount
    sumOfTransitions += item.amount
  }
})

console.log(`expenses: ${expenses}`)
console.log(`income: ${income}`)
console.log(`sum: ${sumOfTransitions}`)

let percentOfIncome = (income / sumOfTransitions) * 100
let percentOfExpense = (expenses / sumOfTransitions) * 100

console.log(percentOfIncome)
console.log(percentOfExpense)

ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
  datasets: [
    {
      backgroundColor: ['#f83434', '#90ee90'],
      data: [percentOfExpense, percentOfIncome]
    }
  ]
}

const overlappingSegments = {
  id: 'overlappingSegments',
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart
    const x = chart.getDatasetMeta(0).data[0].x
    const y = chart.getDatasetMeta(0).data[0].y
    const angle = Math.PI / 180

    chart.getDatasetMeta(0).data.forEach((value, index) => {
      const innerRadius = chart.getDatasetMeta(0).data[index].innerRadius
      const outerRadius = chart.getDatasetMeta(0).data[index].outerRadius
      const endAngle = chart.getDatasetMeta(0).data[index].endAngle
      const radius = (outerRadius - innerRadius) / 2
      const coor = []

      for (let i = -0.08; i <= 0.1; i += 0.01) {
        const xCoor = (innerRadius + radius) * Math.cos(endAngle + Math.PI + i)
        const yCoor = (innerRadius + radius) * Math.sin(endAngle + i)
        coor.push({ x: xCoor, y: yCoor })
      }

      ctx.save()
      ctx.fillStyle = data.datasets[0].backgroundColor[index]
      ctx.translate(x, y)
      ctx.beginPath()
      coor.forEach(({ x, y }) => {
        ctx.arc(-x, y, radius, 0, angle * 360, false)
      })
      ctx.fill()
      ctx.restore()
    })
  }
}

const overlapPlugin = [overlappingSegments]

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0
  },
  hover: {
    mode: null
  },
  elements: {
    arc: {
      borderWidth: 0,
      borderRadius: 20,
      borderJoinStyle: 'bevel'
    }
  },
  plugins: {
    tooltip: {
      enabled: false
    }
  },
  datasets: {
    doughnut: {
      cutout: '80%'
    }
  }
}
</script>

<template>
  <section class="breakdown-donut">
    <section :class="['deposits', 'details']">
      <h2>Deposits</h2>
      <h3>{{ formatAmount(income) }}</h3>
      <h4>+{{ formatPercent(percentOfIncome) }}</h4>
    </section>
    <section class="chart-container">
      <Doughnut :data="data" :options="options" :plugins="overlapPlugin" />
    </section>
    <section :class="['withdrawals', 'details']">
      <h2>Withdrawals</h2>
      <h3>{{ formatAmount(expenses) }}</h3>
      <h4>-{{ formatPercent(percentOfExpense) }}</h4>
    </section>
  </section>
</template>

<style lang="scss" scoped>
h2 {
  font-weight: 400;
  font-size: 1.3rem;
}
.breakdown-donut {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .details {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-weight: 300;
  }

  .deposits {
    h4 {
      color: lightgreen;
    }
  }

  .withdrawals {
    h4 {
      color: #f83434;
    }
  }
}

.chart-container {
  width: 40%;
  height: 200px;
}
</style>
