<template>
  <div class="chart"></div>
</template>

<script>
import Anychart from 'anychart';

export default {
  props: ['chartData', 'Anychart'],
  name: 'DashboardChartSpending',

  data() {
    return {
      chart: null,
    };
  },

  mounted() {
    if (!this.chart && this.options.chart) {
      this.init();
    }
  },

  computed: {
    options() {
      return {
        chart: {
          type: 'pie',
          data: this.chartData,
        },
      };
    },
    total() {
      const amountsArr = Object.values(_.fromPairs(this.chartData));
      return amountsArr.reduce((a, b) => a + b, 0);
    },
  },

  methods: {
    init() {
      if (!this.chart && this.options) {
        const label = anychart.standalones.label();
        this.chartData.length ? label.text(`Total:\n ${this.total}`) : label.text('Add some spending to see them on the chart');
        label.width('100%');
        label.height('100%');
        label.fontColor('#60727b');
        label.hAlign('center');
        label.vAlign('middle');
        const _Anychart = this.Anychart || Anychart;
        this.chart = new _Anychart.fromJson(this.options);
        this.chart.center().content(label);
        this.chart.container(this.$el)
          .innerRadius('40%')
          .draw();
      }
    },
  },

  watch: {
    options(val) {
      if (!this.chart && val) {
        this.init();
      } else {
        this.chart.dispose();
        this.chart = null;
        this.init();
      }
    },
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
};
</script>
