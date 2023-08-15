<template>
  <canvas :id="cid" style="width: 100%; height: 300px"></canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { Chart } from 'chart.js/auto';
@Component({ name: 'myChartsComponent' })
export default class myChartsComponent extends Vue {
  @Prop() readonly cid!: string;
  private myCharts: any = null;
  public initChart(data: any) {
    if (this.myCharts) {
      this.myCharts.destroy();
    }
    this._initChart(data);
  }
  private _initChart(data: any) {
    const { dataX, dataY1, dataY2, label1, label2 } = data;
    var ctx1 = (document.getElementById(this.cid) as HTMLCanvasElement).getContext('2d')!;
    var gradientStroke1 = ctx1!.createLinearGradient(0, 230, 0, 50);

    gradientStroke1.addColorStop(1, 'rgba(221,36,42,0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)');
    //purple colors

    var gradientStroke2 = ctx1!.createLinearGradient(0, 230, 0, 50);

    gradientStroke2.addColorStop(1, 'rgba(75,116,251,0.2)');
    gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)');

    const datasets = [
      {
        label: label1,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: '#4b74fb',
        borderColor: '#4b74fb',
        borderWidth: 3,
        fill: true,
        backgroundColor: gradientStroke2,
        data: dataY1,
      },
    ];
    if (label2 && dataY2.length) {
      datasets.push({
        label: label2,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: '#DD242A',
        borderColor: '#DD242A',
        borderWidth: 3,
        fill: true,
        backgroundColor: gradientStroke1,
        data: dataY2,
      });
    }
    this.myCharts = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: dataX,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false,
              dash: [5, 5],
            },
            grid: {
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
            },
            ticks: {
              display: true,
              padding: 10,
              color: '#b2b9bf',
              stepSize: 1,
              precision: 0,
              font: {
                size: 11,
                family: 'Poppins',
                style: 'normal',
                lineHeight: 2,
              },
            },
          },
          x: {
            border: {
              display: false,
              dash: [5, 5],
            },
            grid: {
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
            },
            ticks: {
              display: true,
              color: '#b2b9bf',
              padding: 20,
              font: {
                size: 11,
                family: 'Poppins',
                style: 'normal',
                lineHeight: 2,
              },
            },
          },
        },
      },
    });
  }
}
</script>

<style lang="less" scoped></style>
