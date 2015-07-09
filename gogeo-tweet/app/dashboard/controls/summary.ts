/// <reference path="../../shell.ts" />

module gogeo {
  export class SummaryController {
    static $inject = [
      "$scope",
      "$timeout",
      DashboardService.$named
    ];

    morning: number = 0;
    afternoon: number = 0;
    night: number = 0;
    totalTransactions: IHashtagResult = null;

    constructor(
      private $scope:   ng.IScope,
      private $timeout: ng.ITimeoutService,
      private service:  DashboardService) {

      this.service.queryObservable
        .where(q => q != null)
        .throttle(400)
        .subscribeAndApply(this.$scope, (query) => this.getSummary());

      this.service.hashtagResultObservable
                  .subscribeAndApply(this.$scope, result => this.handleResult(result));
    }

    handleResult(result : IHashtagResult) {
      this.totalTransactions = result;
    }

    getSummary() {
      this.service.getStatsAggregationSummary().success((result:Array<IStatsSumAgg>) => {
        // var colors = [ "#053061", "#2166AC", "#4393C3", "#92C5DE", "#D1E5F0", "#FFFFBF", "#FDDBC7", "#F4A582", "#D6604D", "#B2182B", "#67001F" ];
        result.forEach((item) => {
          if(item["key"] == "tarde") {
            this.afternoon = item["sum"];
          } if(item["key"] == "noite") {
            this.night = item["sum"];
          } else {
            this.morning = item["sum"];
          }
        })
      });
    }
  }


  registerDirective("summary", () => {
    return {
      restrict: "E",
      templateUrl: "dashboard/controls/summary-template.html",
      controller: SummaryController,
      controllerAs: "summary",
      bindToController: true,

      scope: {
        buckets: "="
      },

      link(scope, element, attrs, controller: SummaryController) {

      }
    };
  });
}