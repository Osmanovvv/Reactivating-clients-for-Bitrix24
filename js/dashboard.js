(function ($, window, document) {
  "use strict";

  var App = window.ReactivationApp = window.ReactivationApp || {};

  // ---------------------------------------------------------------------------
  // Dashboard page
  // ---------------------------------------------------------------------------

  var escapeHtml = App.escapeHtml;
  var getDashboardData = App.getDashboardData;
  var getValue = App.getValue;
  var renderTitle = App.renderTitle;
  var showToast = App.showToast;
  var revenueChartInstance = null;
  var clientsDonutChartInstance = null;
  var chartsBreakpoint = null;
  var chartsLayoutWidth = null;
  var resizeTimer = null;
  var isResizeBound = false;
  var dashboardState = {
    revenuePeriod: ""
  };

  function getChartsBreakpoint() {
    if (window.matchMedia("(min-width: 425px) and (max-width: 600px)").matches) {
      return "large-mobile";
    }

    return window.matchMedia("(max-width: 425px)").matches ? "mobile" : "desktop";
  }

  function getChartsLayoutWidth() {
    return document.documentElement.clientWidth || window.innerWidth;
  }

  function getSelectedRevenuePeriod(revenue) {
    if (!dashboardState.revenuePeriod && revenue && revenue.periodOptions && revenue.periodOptions.length) {
      dashboardState.revenuePeriod = revenue.periodOptions[0];
    }

    return dashboardState.revenuePeriod;
  }

  function getRevenueChartSeries(revenue) {
    var period = getSelectedRevenuePeriod(revenue);
    var periodSeries = getValue(revenue, "seriesByPeriod." + period, null);

    return periodSeries || revenue.series || [];
  }

  function renderDashboardKpis(data) {
    if (!data.kpis) {
      return;
    }

    $(".dashboard-kpis .kpi-card").each(function (index) {
      var kpi = data.kpis[index];

      if (!kpi) {
        return;
      }

      $(this).find(".metric-icon--image").attr("src", kpi.icon);
      $(this).find(".kpi-card__label").text(kpi.label);
      $(this).find(".kpi-card__value").text(kpi.value);
      $(this).find(".kpi-card__delta").text(kpi.delta);
    });
  }

  function renderRevenueData(data) {
    var revenue = data.revenue;
    var $card = $(".dashboard-card--revenue");

    if (!revenue || !$card.length) {
      return;
    }

    renderTitle($card.find(".card__title"), revenue.title, revenue.tooltip);
    $card.find(".dashboard-total span").text(revenue.total);
    $card.find(".dashboard-total strong").text(revenue.delta);
    $card.find(".dashboard-total em").text(revenue.deltaText);

    if (revenue.periodOptions && revenue.periodOptions.length) {
      var options = revenue.periodOptions.map(function (option) {
        return '<button class="dropdown__item" type="button">' + escapeHtml(option) + "</button>";
      }).join("");

      $card.find(".dropdown__label").text(getSelectedRevenuePeriod(revenue));
      $card.find(".dropdown__toggle").attr({
        "aria-expanded": "false",
        "aria-haspopup": "true"
      });
      $card.find(".dropdown__menu").html(options);
    }
  }

  function renderClientsData(data) {
    var clients = data.clients;
    var $card = $(".dashboard-card--donut");

    if (!clients || !$card.length) {
      return;
    }

    $card.find(".card__title").text(clients.title);
    $card.find(".donut-center strong").text(clients.total);
    $card.find(".donut-center span").text(clients.unit);

    if (clients.segments) {
      var legend = clients.segments.map(function (segment) {
        return '<div class="legend-item legend-item--' + escapeHtml(segment.type) + '">' +
          '<span aria-hidden="true"></span>' +
          '<p><span class="legend-item__label">' + escapeHtml(segment.label) + '</span> <strong>' + escapeHtml(segment.value) + "</strong></p>" +
        "</div>";
      }).join("");

      $card.find(".legend-list").html(legend);
    }
  }

  function renderFunnelData(data) {
    var funnel = data.funnel;
    var $card = $(".dashboard-card--funnel");

    if (!funnel || !$card.length) {
      return;
    }

    $card.find(".card__title").text(funnel.title);

    if (funnel.stats) {
      $card.find(".funnel-stats").html(funnel.stats.map(function (item) {
        return "<p>" + escapeHtml(item.label) + " <strong>" + escapeHtml(item.value) + "</strong></p>";
      }).join(""));
    }
  }

  function renderDiscountsData(data) {
    var discounts = data.discounts;
    var $card = $(".dashboard-card--discounts");

    if (!discounts || !$card.length) {
      return;
    }

    renderTitle($card.find(".card__title"), discounts.title, discounts.tooltip);

    if (discounts.rows) {
      var rows = discounts.rows.map(function (row) {
        var barClass = row.bar && row.bar !== "primary" ? " progress__bar--" + row.bar : "";

        return '<div class="discount-row">' +
          "<strong>" + escapeHtml(row.discount) + "</strong>" +
          '<div class="discount-row__conversion">' +
            '<span class="progress progress--' + escapeHtml(row.progress) + '"><span class="progress__bar' + barClass + '"></span></span>' +
            "<span>" + escapeHtml(row.conversion) + "</span>" +
          "</div>" +
          "<span>" + escapeHtml(row.uses) + "</span>" +
          "<span>" + escapeHtml(row.revenue) + "</span>" +
        "</div>";
      }).join("");

      $card.find(".discount-row").remove();
      $card.find(".discount-table").append(rows);
    }

    if (discounts.insight) {
      $card.find(".insight-box strong").text(discounts.insight.title);
      $card.find(".insight-box p").text(discounts.insight.text);
    }
  }

  function renderRiskActions(actions, row, rowIndex) {
    var menuId = "risk-row-menu-" + rowIndex;
    var items = (actions || []).map(function (action) {
      return '<button class="action-menu__item" type="button" role="menuitem" data-feedback="' +
        escapeHtml(action + ": " + row.client) + '">' + escapeHtml(action) + "</button>";
    }).join("");

    return '<div class="risk-row__actions">' +
      '<button class="risk-row__menu" type="button" aria-label="Действия" aria-expanded="false" aria-controls="' + menuId + '" data-action-menu="' + menuId + '"></button>' +
      '<div id="' + menuId + '" class="action-menu" role="menu">' + items + "</div>" +
    "</div>";
  }

  function renderRiskData(data) {
    var risk = data.risk;
    var $card = $(".dashboard-card--risk");
    var $table = $card.find(".risk-table");

    if (!risk || !$card.length || !$table.length) {
      return;
    }

    renderTitle($card.find(".card__title"), risk.title, risk.tooltip);
    $card.find(".card__header .button").text(risk.openButton);

    if (risk.headers) {
      $table.find(".risk-table__head").html(
        risk.headers.map(function (header) {
          return "<span>" + escapeHtml(header) + "</span>";
        }).join("") + "<span></span>"
      );
    }

    if (risk.rows) {
      var rows = risk.rows.map(function (row, index) {
        return '<div class="risk-row">' +
          '<div class="table__primary">' +
            "<strong>" + escapeHtml(row.client) + "</strong>" +
            "<span>" + escapeHtml(row.company) + "</span>" +
          "</div>" +
          '<span class="badge badge--' + escapeHtml(row.badge) + '">' + escapeHtml(row.stage) + "</span>" +
          '<div class="risk-row__delay">' +
            "<strong>" + escapeHtml(row.delay) + "</strong>" +
            '<span class="progress progress--' + escapeHtml(row.progress) + '"><span class="progress__bar progress__bar--' + escapeHtml(row.progressBar) + '"></span></span>' +
          "</div>" +
          "<span>" + escapeHtml(row.lastOrder) + "</span>" +
          renderRiskActions(risk.actions, row, index) +
        "</div>";
      }).join("");

      $table.find(".risk-row").remove();
      $table.find(".risk-table__footer").before(rows);
    }

    $table.find(".risk-table__footer .button").text(risk.footerButton);
  }

  function renderDashboardData() {
    var data = getDashboardData();

    if (!data || document.body.getAttribute("data-page") !== "dashboard") {
      return;
    }

    renderDashboardKpis(data);
    renderRevenueData(data);
    renderClientsData(data);
    renderFunnelData(data);
    renderDiscountsData(data);
    renderRiskData(data);
  }

  function renderRevenueChart() {
    var el = document.querySelector("#revenue-chart");
    var dashboard = getDashboardData();
    var data = dashboard ? dashboard.revenue : null;
    var series = data ? getRevenueChartSeries(data) : [];
    var seriesName = data && data.seriesName ? data.seriesName : "";
    var daySuffix = data && data.xAxisDaySuffix ? data.xAxisDaySuffix : "";

    if (!el || !window.ApexCharts || series.length < 25) {
      return;
    }

    var shownDays = {
      1: true,
      6: true,
      11: true,
      16: true,
      21: true,
      26: true,
      31: true
    };
    var isNarrowMobile = window.matchMedia("(max-width: 425px)").matches;
    var chartHeight = isNarrowMobile ? 150 : 182;
    var axisFontSize = isNarrowMobile ? "9px" : "10px";
    var markerSize = isNarrowMobile ? 2.1 : 2.45;

    if (revenueChartInstance) {
      revenueChartInstance.destroy();
      revenueChartInstance = null;
    }

    el.innerHTML = "";
    el.removeAttribute("style");

    revenueChartInstance = new ApexCharts(el, {
      chart: {
        type: "area",
        height: chartHeight,
        parentHeightOffset: 0,
        redrawOnWindowResize: false,
        redrawOnParentResize: false,
        animations: { enabled: false },
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
      },
      series: [{
        name: seriesName,
        data: series.map(function (value, index) {
          return {
            x: index + 1,
            y: value
          };
        })
      }],
      colors: ["#9a5fec"],
      dataLabels: { enabled: false },
      stroke: {
        curve: "straight",
        width: 2,
        lineCap: "round"
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.2,
          opacityTo: 0.02,
          stops: [0, 100]
        }
      },
      markers: {
        size: markerSize,
        strokeWidth: 1.5,
        strokeColors: "#9a5fec",
        colors: ["#b887f9"],
        hover: {
          size: markerSize,
          sizeOffset: 0
        }
      },
      grid: {
        borderColor: "#e4e8f0",
        strokeDashArray: 0,
        padding: {
          top: -12,
          right: 0,
          bottom: isNarrowMobile ? 0 : -8,
          left: 2
        },
        xaxis: {
          lines: { show: false }
        },
        yaxis: {
          lines: { show: true }
        }
      },
      xaxis: {
        type: "numeric",
        min: 1,
        max: 31,
        tickAmount: 6,
        decimalsInFloat: 0,
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
        labels: {
          rotate: 0,
          hideOverlappingLabels: false,
          trim: false,
          offsetY: -1,
          style: {
            colors: "#111827",
            fontSize: axisFontSize,
            fontWeight: 500
          },
          formatter: function (value) {
            var day = Number(value);

            return shownDays[day] ? day + daySuffix : "";
          }
        }
      },
      yaxis: {
        min: 0,
        max: 14000,
        tickAmount: 7,
        labels: {
          offsetX: -5,
          style: {
            colors: "#667085",
            fontSize: axisFontSize,
            fontWeight: 500
          },
          formatter: function (value) {
            return value === 0 ? "0" : Math.round(value / 1000) + "k";
          }
        }
      },
      tooltip: { enabled: false },
      states: {
        hover: { filter: { type: "none" } },
        active: { filter: { type: "none" } }
      },
      legend: { show: false }
    });

    revenueChartInstance.render();
  }

  function renderClientsDonutChart() {
    var el = document.querySelector("#clients-donut-chart");
    var dashboard = getDashboardData();
    var clients = dashboard ? dashboard.clients : null;
    var segments = clients && clients.segments ? clients.segments : [];
    var colors = segments.map(function (segment) {
      return segment.color;
    }).filter(Boolean);

    if (!el || !window.ApexCharts || !segments.length) {
      return;
    }

    var isLargeMobile = window.matchMedia("(min-width: 425px) and (max-width: 600px)").matches;
    var isNarrowMobile = window.matchMedia("(max-width: 425px)").matches;
    var donutSize = isLargeMobile ? 150 : (isNarrowMobile ? 112 : 132);

    if (clientsDonutChartInstance) {
      clientsDonutChartInstance.destroy();
      clientsDonutChartInstance = null;
    }

    el.innerHTML = "";
    el.removeAttribute("style");

    clientsDonutChartInstance = new ApexCharts(el, {
      chart: {
        type: "donut",
        width: donutSize,
        height: donutSize,
        sparkline: { enabled: true },
        redrawOnWindowResize: false,
        redrawOnParentResize: false,
        animations: { enabled: false },
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
      },
      series: segments.map(function (segment) {
        return Number(segment.count);
      }),
      labels: segments.map(function (segment) {
        return segment.label;
      }),
      colors: colors.length === segments.length ? colors : ["#3ebf7c", "#ffc11b", "#ff4b42"],
      dataLabels: { enabled: false },
      legend: { show: false },
      tooltip: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ["#ffffff"]
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: false,
          donut: {
            size: "58%",
            labels: { show: false }
          }
        }
      },
      states: {
        hover: { filter: { type: "none" } },
        active: { filter: { type: "none" } }
      }
    });

    clientsDonutChartInstance.render();
  }

  function renderDashboardCharts() {
    if (document.body.getAttribute("data-page") !== "dashboard") {
      return;
    }

    renderRevenueChart();
    renderClientsDonutChart();
    chartsBreakpoint = getChartsBreakpoint();
    chartsLayoutWidth = getChartsLayoutWidth();
    bindChartResize();
  }

  function bindChartResize() {
    if (isResizeBound) {
      return;
    }

    isResizeBound = true;

    $(window).on("resize.dashboardCharts", function () {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(function () {
        var nextBreakpoint = getChartsBreakpoint();
        var nextLayoutWidth = getChartsLayoutWidth();

        if (nextBreakpoint !== chartsBreakpoint || nextLayoutWidth !== chartsLayoutWidth) {
          renderDashboardCharts();
        }
      }, 120);
    });
  }

  function bindDashboardUi() {
    $(document).on("click", ".dashboard-card--revenue .dropdown__item", function () {
      dashboardState.revenuePeriod = $(this).text().trim();
      renderRevenueChart();
    });

    $(document).on("click", ".dashboard-card--risk .card__header .button", function () {
      var data = getDashboardData();
      var message = getValue(data, "risk.openFeedback", "");

      showToast(message || getValue(data, "risk.openButton", ""));
    });

    $(document).on("click", ".dashboard-card--risk .risk-table__footer .button", function () {
      var data = getDashboardData();
      var message = getValue(data, "risk.footerFeedback", "");

      showToast(message || getValue(data, "risk.footerButton", ""));
    });
  }

  // ---------------------------------------------------------------------------
  // Settings persistence and interactions
  // ---------------------------------------------------------------------------

  App.dashboard = {
    bind: bindDashboardUi,
    render: renderDashboardData,
    renderCharts: renderDashboardCharts
  };

})(window.jQuery, window, document);
