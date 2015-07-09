/// <reference path="../../shell.ts" />

module gogeo {
  export class DateHistogramChartController {
    static $inject = [
      "$scope",
      "$timeout",
      "$window",
      DashboardService.$named
    ];

    SIMPLE_DATE_PATTERN: string = "YYYY-MM-dd";
    // buckets: Array<IDateHistogram> = [];
    buckets: any = [];
    options: any = {
      chart: {
        type: 'multiChart',
        height: 320,
        // width: 300,
        color: [
          "#1f77b4",
          "#2ca02c"
        ],
        margin : {
          top: 20,
          right: 20,
          bottom: 40,
          left: 100
        },
        showValues: true,
        transitionDuration: 500,
        tooltipContent: function (key, x, y, e, graph) {
          if (key.indexOf("R$") != -1) {
            y = "R$" + y;
          } else {
            key = "Quantidade";
            // y = numeral(y).format('0.00a');
          }
          return '<div> ' + x + ' (' + key + ')' + '</div>' +
                 '<p style="width: 140px"><center>' +  y + '</center></p>'
        },
        xAxis: {
          axisLabel: "Tempo",
          tickFormat: function(d) {
            return moment(new Date(d)).format("DD/MM");
          },
          showMaxMin: true,
          rotateLabels: 50,
          axisLabelDistance: 10
        },
        yAxis1: {
          axisLabel: "Valor",
          tickFormat: function(d) {
            return numeral(d).format('0.00a').toUpperCase();
          },
          axisLabelDistance: 25,
          width: 90,
          margin: {
            right: 70
          }
        },
        yAxis2: {
          axisLabel: "Quantidade",
          tickFormat: function(d) {
            return numeral(d).format('0.00a').toUpperCase();
          },
          axisLabelDistance: 30
        }
      },
      title: {
        enable: true,
        text: "TRANSAÇÕES/PERÍODO",
        class: "dashboard-details-title",
        css: {
          // width: "500px",
          // padding: "500px",
          textAlign: "left",
          position: "relative",
          top: "20px",
          margin: "0px 0px 30px -25px"
        }
      }
    };

    widthHash: any = {
      1280: 325,
      1366: 345,
      1920: 525
    };

    constructor(
      private $scope:   ng.IScope,
      private $timeout: ng.ITimeoutService,
      private $window:  ng.IWindowService,
      private service:  DashboardService) {

      this.service.queryObservable
        .where(q => q != null)
        .throttle(400)
        .subscribeAndApply(this.$scope, (query) => this.getDataChart());

      this.buckets = [
        {
          key: "R$",
          type: "line",
          yAxis: 1,
          values: []
        },
        {
          key: "Quantidade",
          type: "line",
          yAxis: 2,
          values: []
        }
      ];

      this.$scope.$watch(() => {
        var width = this.$window.innerWidth;
        var chartWidth = this.widthHash[width];

        if (!chartWidth) {
          chartWidth = parseInt((width / 3).toFixed(0)) - 105;
        }

        this.options.chart.width = chartWidth;
        var svgWidth = chartWidth + 80;
        $("date-histogram-chart nvd3 svg").css("width", svgWidth + "px")
      });
    }

    getDataChart() {
      this.service.getDateHistogramAggregation().success((result: Array<IDateHistogram>) => {
        var quantityValues = [];
        var amountValues = [];
        this.buckets[0]["values"] = [];
        this.buckets[1]["values"] = [];
        result.forEach((item) => {
          quantityValues.push({
            x: item['timestamp'] + (3 * 3600 * 1000), // Add time offset +3 hours
            y: item['count']
          });
          amountValues.push({
            x: item['timestamp'] + (3 * 3600 * 1000), // Add time offset +3 hours
            y: item['sum']
          });
        });

        this.buckets[0]["values"] = amountValues;
        this.buckets[1]["values"] = quantityValues;
      });
    }
  }

  registerDirective("dateHistogramChart", () => {
    return {
      restrict: "E",
      templateUrl: "dashboard/controls/date-histogram-chart-template.html",
      controller: DateHistogramChartController,
      controllerAs: "datehisto",
      bindToController: true,

      scope: {
        buckets: "="
      },

      link(scope, element, attrs, controller: DateHistogramChartController) {

      }
    };
  });
}