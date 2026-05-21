(function ($, window, document) {
  "use strict";

  var App = window.ReactivationApp = window.ReactivationApp || {};

  // ---------------------------------------------------------------------------
  // Risk clients page
  // ---------------------------------------------------------------------------

  var closeFloatingMenus = App.closeFloatingMenus;
  var escapeHtml = App.escapeHtml;
  var formatTemplate = App.formatTemplate;
  var getRiskClientsData = App.getRiskClientsData;
  var getValue = App.getValue;
  var showToast = App.showToast;
  var riskTimeChartInstance = null;
  var riskLossChartInstance = null;
  var riskChartsResizeTimer = null;
  var riskChartsResizeObserver = null;
  var riskChartsResizeBound = false;
  var riskChartsSizeSignature = "";
  var riskClientsState = {
    page: 1,
    pageSize: 20,
    risk: "",
    manager: "",
    period: "",
    segment: "",
    timePeriod: "",
    query: ""
  };

  function getRiskClientsUi(data) {
    return data && data.ui ? data.ui : {};
  }

  function getRiskClientsText(data, path, fallback) {
    return getValue(getRiskClientsUi(data), path, fallback);
  }

  function getSelectedRiskTimeChart(charts) {
    var time = charts && charts.time ? charts.time : null;
    var options = time && time.periodOptions ? time.periodOptions : [];
    var selected;

    if (!time) {
      return null;
    }

    riskClientsState.timePeriod = riskClientsState.timePeriod || time.period;

    selected = options.filter(function (option) {
      return option.period === riskClientsState.timePeriod;
    })[0];

    return selected || time;
  }

  function bindRiskClientsUi() {
    $(document).on("input", ".js-risk-search", function () {
      riskClientsState.query = $(this).val().trim();
      riskClientsState.page = 1;
      renderRiskClientsTable(getRiskClientsData());
    });

    $(document).on("click", ".risk-level-filter .dropdown__item", function () {
      riskClientsState.risk = $(this).text();
      riskClientsState.page = 1;
      renderRiskClientsTable(getRiskClientsData());
    });

    $(document).on("click", ".risk-manager-filter .dropdown__item", function () {
      riskClientsState.manager = $(this).text();
      riskClientsState.page = 1;
      renderRiskClientsTable(getRiskClientsData());
    });

    $(document).on("click", ".risk-period-filter .dropdown__item", function () {
      riskClientsState.period = $(this).text();
      riskClientsState.page = 1;
      renderRiskClientsTable(getRiskClientsData());
    });

    $(document).on("click", ".risk-segment-filter .dropdown__item", function () {
      riskClientsState.segment = $(this).text();
      riskClientsState.page = 1;
      renderRiskClientsTable(getRiskClientsData());
    });

    $(document).on("click", ".dropdown--risk-page-size .dropdown__item", function () {
      riskClientsState.pageSize = Number($(this).text()) || 20;
      riskClientsState.page = 1;
      renderRiskClientsTable(getRiskClientsData());
    });

    $(document).on("click", ".risk-time-period-dropdown .dropdown__item", function () {
      var data = getRiskClientsData();

      riskClientsState.timePeriod = $(this).text().trim();
      renderRiskClientsSideChartsText(data);
      renderRiskTimeChart();
    });

    $(document).on("click", ".js-risk-pagination button[data-page]", function () {
      riskClientsState.page = Number($(this).attr("data-page")) || 1;
      renderRiskClientsTable(getRiskClientsData());
    });

    $(document).on("click", ".js-risk-pagination button[data-next]", function () {
      var data = getRiskClientsData();
      var pageCount = getRiskClientsPageCount(getFilteredRiskClientsRows(data).length);

      if (riskClientsState.page < pageCount) {
        riskClientsState.page += 1;
        renderRiskClientsTable(data);
      }
    });

    $(document).on("click", ".js-risk-filter", function (event) {
      var data = getRiskClientsData();
      var total = getFilteredRiskClientsRows(data).length;
      var $panel = $(".js-risk-filter-panel");
      var isOpen = !$panel.hasClass("is-open");

      event.preventDefault();
      event.stopPropagation();
      closeFloatingMenus();
      $(this).toggleClass("is-active", isOpen).attr("aria-expanded", isOpen ? "true" : "false");
      $panel.toggleClass("is-open", isOpen);
      updateRiskClientsFilterPanel(data, total);
    });

    $(document).on("click", ".js-risk-filter-apply", function () {
      var data = getRiskClientsData();
      var total = getFilteredRiskClientsRows(data).length;

      closeFloatingMenus();
      showToast(formatTemplate(getRiskClientsText(data, "shownToast", "Показано клиентов: {total}"), { total: total }));
    });

    $(document).on("click", ".js-risk-filter-reset", function () {
      resetRiskClientsFilters(getRiskClientsData());
      renderRiskClientsTable(getRiskClientsData());
      showToast(getRiskClientsText(getRiskClientsData(), "resetToast", "Фильтры сброшены"));
    });

    $(document).on("click", ".risk-main-row", function (event) {
      if ($(event.target).closest("button, .action-menu").length) {
        return;
      }

      $(".risk-main-row").removeClass("is-selected");
      $(this).addClass("is-selected");
    });

    $(document).on("click", "[data-risk-feedback]", function (event) {
      event.preventDefault();
      event.stopPropagation();
      showToast($(this).attr("data-risk-feedback") || getRiskClientsText(getRiskClientsData(), "actionCompleteToast", "Действие выполнено"));
    });

    $(document).on("click", ".js-risk-create-tasks", function () {
      showToast(formatTemplate(getRiskClientsText(getRiskClientsData(), "tasksCreatedToast", "Создано задач: {count}"), {
        count: getValue(getRiskClientsData(), "summary.actions.count", 8)
      }));
    });
  }

  function renderRiskOptions($menu, options) {
    if (!$menu.length || !options) {
      return;
    }

    $menu.html(options.map(function (option) {
      return '<button class="dropdown__item" type="button">' + escapeHtml(option) + "</button>";
    }).join(""));
  }

  function isAllRiskOption(value) {
    return !value || value.indexOf(": Все") !== -1;
  }

  function getRiskClientsPagination(data) {
    return data && data.pagination ? data.pagination : {};
  }

  function getRiskClientsRows(data) {
    var source = data && data.rows ? data.rows : [];
    var total = Number(getRiskClientsPagination(data).total) || source.length;
    var rows = [];
    var index;
    var clone;

    if (!source.length) {
      return rows;
    }

    for (index = 0; index < total; index += 1) {
      clone = $.extend(true, {}, source[index % source.length]);
      clone.key = clone.client + "-" + index;
      clone.mockIndex = index + 1;
      rows.push(clone);
    }

    return rows;
  }

  function getRiskPeriodDays() {
    var match = String(riskClientsState.period || "").match(/(\d+)/);

    return match ? Number(match[1]) : 0;
  }

  function getFilteredRiskClientsRows(data) {
    var rows = getRiskClientsRows(data);
    var query = String(riskClientsState.query || "").toLowerCase().trim();
    var periodDays = getRiskPeriodDays();

    return rows.filter(function (row) {
      var riskMatches = isAllRiskOption(riskClientsState.risk) || row.risk === riskClientsState.risk;
      var managerMatches = isAllRiskOption(riskClientsState.manager) || row.manager === riskClientsState.manager;
      var segmentMatches = isAllRiskOption(riskClientsState.segment) || row.segment === riskClientsState.segment;
      var periodMatches = !periodDays || Number(row.periodDays || 0) <= periodDays;
      var haystack = [
        row.client,
        row.company,
        row.risk,
        row.manager,
        row.segment,
        row.action,
        row.loss
      ].join(" ").toLowerCase();

      return riskMatches && managerMatches && segmentMatches && periodMatches && (!query || haystack.indexOf(query) !== -1);
    });
  }

  function getRiskClientsPageCount(filteredCount) {
    var pageSize = Number(riskClientsState.pageSize) || 20;

    return Math.max(1, Math.ceil(filteredCount / pageSize));
  }

  function getRiskClientsDisplayRows(data, filteredRows) {
    var pageSize = Number(riskClientsState.pageSize) || Number(getRiskClientsPagination(data).perPage) || 20;
    var visibleRows = Number(getRiskClientsPagination(data).visibleRows) || 7;
    var start = (riskClientsState.page - 1) * pageSize;
    var pageRows = filteredRows.slice(start, start + visibleRows);

    if (!pageRows.length && riskClientsState.page > 1) {
      riskClientsState.page = 1;
      pageRows = filteredRows.slice(0, visibleRows);
    }

    return pageRows;
  }

  function getRiskClientsRangeText(filteredCount) {
    var pageSize = Number(riskClientsState.pageSize) || 20;
    var start;
    var end;

    if (!filteredCount) {
      return "0 из 0";
    }

    start = (riskClientsState.page - 1) * pageSize + 1;
    end = Math.min(riskClientsState.page * pageSize, filteredCount);

    return start + "–" + end + " из " + filteredCount;
  }

  function updateRiskClientsFilterPanel(data, total) {
    var parts = [];
    var $panel = $(".js-risk-filter-panel");

    if (!$panel.length) {
      return;
    }

    if (!isAllRiskOption(riskClientsState.risk)) {
      parts.push(getRiskClientsText(data, "filterSummaryLabels.risk", "Риск") + ": " + riskClientsState.risk);
    }

    if (!isAllRiskOption(riskClientsState.manager)) {
      parts.push(riskClientsState.manager);
    }

    if (!isAllRiskOption(riskClientsState.segment)) {
      parts.push(riskClientsState.segment);
    }

    if (riskClientsState.query) {
      parts.push(getRiskClientsText(data, "filterSummaryLabels.search", "Поиск") + ": " + riskClientsState.query);
    }

    $panel.find(".js-risk-filter-total").text(total);
    $panel.find(".js-risk-filter-summary").text(parts.length ? parts.join(" · ") : getRiskClientsText(data, "noFiltersText", "Фильтры не выбраны"));
  }

  function resetRiskClientsFilters(data) {
    if (data && data.filters) {
      riskClientsState.risk = data.filters.risks[0];
      riskClientsState.manager = data.filters.managers[0];
      riskClientsState.period = data.filters.periods[0];
      riskClientsState.segment = data.filters.segments[0];
    }

    riskClientsState.query = "";
    riskClientsState.page = 1;
    closeFloatingMenus();
  }

  function renderRiskClientsKpis(data) {
    if (!data || !data.kpis) {
      return;
    }

    $(".risk-clients-kpis .risk-clients-kpi-card").each(function (index) {
      var kpi = data.kpis[index];

      if (!kpi) {
        return;
      }

      $(this).find(".risk-clients-kpi-card__label").text(kpi.label);
      $(this).find(".risk-clients-kpi-card__value").text(kpi.value);
      $(this).find(".risk-clients-kpi-card__delta").text(kpi.delta);
    });
  }

  function renderRiskClientsFilters(data) {
    var filters = data && data.filters ? data.filters : null;

    if (!filters) {
      return;
    }

    riskClientsState.risk = riskClientsState.risk || filters.risks[0];
    riskClientsState.manager = riskClientsState.manager || filters.managers[0];
    riskClientsState.period = riskClientsState.period || filters.periods[0];
    riskClientsState.segment = riskClientsState.segment || filters.segments[0];

    renderRiskOptions($(".risk-level-filter .dropdown__menu"), filters.risks);
    renderRiskOptions($(".risk-manager-filter .dropdown__menu"), filters.managers);
    renderRiskOptions($(".risk-period-filter .dropdown__menu"), filters.periods);
    renderRiskOptions($(".risk-segment-filter .dropdown__menu"), filters.segments);
    renderRiskOptions($(".dropdown--risk-page-size .dropdown__menu"), getRiskClientsPagination(data).pageSizes || []);

    $(".risk-level-filter .dropdown__label").text(riskClientsState.risk);
    $(".risk-manager-filter .dropdown__label").text(riskClientsState.manager);
    $(".risk-period-filter .dropdown__label").text(riskClientsState.period);
    $(".risk-segment-filter .dropdown__label").text(riskClientsState.segment);
    $(".dropdown--risk-page-size .dropdown__label").text(String(riskClientsState.pageSize || getRiskClientsPagination(data).perPage || 20));
    $(".js-risk-search").val(riskClientsState.query);
  }

  function getRiskDelayClass(row) {
    if (row.riskType === "medium") {
      return " risk-main-delay--medium";
    }

    if (row.riskType === "low") {
      return " risk-main-delay--low";
    }

    return "";
  }

  function renderRiskClientsRowActions(data, row, index) {
    var menuId = "risk-main-menu-" + index;
    var menuItems = (data.actions || []).map(function (action) {
      return '<button class="action-menu__item" type="button" role="menuitem" data-feedback="' +
        escapeHtml(formatTemplate(getRiskClientsText(data, "rowActionFeedback", "{action}: {client}"), {
          action: action,
          client: row.client
        })) + '">' + escapeHtml(action) + "</button>";
    }).join("");

    return '<div class="risk-main-actions" role="cell">' +
      '<button class="risk-main-icon risk-main-icon--coupon" type="button" aria-label="' + escapeHtml(getRiskClientsText(data, "actionLabels.coupon", "Купон")) + '" data-risk-feedback="' + escapeHtml(formatTemplate(getRiskClientsText(data, "actionFeedback.couponPrepared", "Купон подготовлен: {client}"), { client: row.client })) + '"></button>' +
      '<button class="risk-main-icon risk-main-icon--mail" type="button" aria-label="' + escapeHtml(getRiskClientsText(data, "actionLabels.mail", "Письмо")) + '" data-risk-feedback="' + escapeHtml(formatTemplate(getRiskClientsText(data, "actionFeedback.mailPrepared", "Письмо подготовлено: {client}"), { client: row.client })) + '"></button>' +
      '<button class="risk-main-icon risk-main-icon--phone" type="button" aria-label="' + escapeHtml(getRiskClientsText(data, "actionLabels.phone", "Звонок")) + '" data-risk-feedback="' + escapeHtml(formatTemplate(getRiskClientsText(data, "actionFeedback.callScheduled", "Звонок запланирован: {client}"), { client: row.client })) + '"></button>' +
      '<button class="risk-main-icon risk-main-icon--view" type="button" aria-label="' + escapeHtml(getRiskClientsText(data, "actionLabels.view", "Просмотр")) + '" data-risk-feedback="' + escapeHtml(formatTemplate(getRiskClientsText(data, "actionFeedback.cardOpened", "Карточка открыта: {client}"), { client: row.client })) + '"></button>' +
      '<div class="risk-main-menu-wrap">' +
        '<button class="risk-main-icon risk-main-icon--menu" type="button" aria-label="' + escapeHtml(getRiskClientsText(data, "actionLabels.menu", "Меню")) + '" aria-expanded="false" aria-controls="' + menuId + '" data-action-menu="' + menuId + '"></button>' +
        '<div id="' + menuId + '" class="action-menu" role="menu">' + menuItems + "</div>" +
      "</div>" +
    "</div>";
  }

  function renderRiskClientsRows(data, rows) {
    var $table = $(".risk-main-table");

    if (!$table.length) {
      return;
    }

    $table.find(".risk-main-row, .risk-main-empty-row").remove();

    if (!rows.length) {
      $table.append('<div class="risk-main-empty-row">' + escapeHtml(getRiskClientsText(data, "emptyText", "Ничего не найдено")) + "</div>");
      return;
    }

    $table.append(rows.map(function (row, index) {
      var actionType = row.actionType || "watch";

      return '<div class="risk-main-row" role="row" data-risk-key="' + escapeHtml(row.key) + '">' +
        '<div class="risk-main-client" role="cell"><strong>' + escapeHtml(row.client) + '</strong><span>' + escapeHtml(row.company) + "</span></div>" +
        '<div role="cell"><span class="risk-main-badge risk-main-badge--' + escapeHtml(row.riskType) + '">' + escapeHtml(row.risk) + "</span></div>" +
        '<div class="risk-main-delay' + getRiskDelayClass(row) + '" role="cell"><strong>' + escapeHtml(row.delay) + '</strong><span><i class="risk-main-delay__bar risk-main-delay__bar--' + escapeHtml(row.progress) + '"></i></span></div>' +
        '<div role="cell">' + escapeHtml(row.expectedCycle) + "</div>" +
        '<div role="cell">' + escapeHtml(row.factDays) + "</div>" +
        '<div class="risk-main-loss risk-main-loss--' + escapeHtml(row.riskType) + '" role="cell">' + escapeHtml(row.loss) + "</div>" +
        '<div role="cell"><span class="risk-main-action risk-main-action--' + escapeHtml(actionType) + '">' + escapeHtml(row.action) + "</span></div>" +
        renderRiskClientsRowActions(data, row, index) +
      "</div>";
    }).join(""));
  }

  function renderRiskClientsPagination(pageCount) {
    var $pagination = $(".js-risk-pagination");
    var buttons = [];
    var firstPage;
    var lastPage;
    var page;

    if (!$pagination.length) {
      return;
    }

    firstPage = Math.max(1, Math.min(riskClientsState.page, Math.max(1, pageCount - 2)));
    lastPage = Math.min(pageCount, firstPage + 2);

    for (page = firstPage; page <= lastPage; page += 1) {
      buttons.push('<button class="' + (page === riskClientsState.page ? "is-active" : "") +
        '" type="button" data-page="' + page + '">' + page + "</button>");
    }

    buttons.push('<button class="risk-main-pagination__next" type="button" data-next="true"' +
      (riskClientsState.page >= pageCount ? " disabled" : "") + ' aria-label="' + escapeHtml(getRiskClientsText(getRiskClientsData(), "nextPageLabel", "Следующая страница")) + '"></button>');
    $pagination.html(buttons.join(""));
  }

  function renderRiskClientsTable(data) {
    var filteredRows;
    var displayRows;
    var pageCount;

    if (!data || document.body.getAttribute("data-page") !== "risk") {
      return;
    }

    renderRiskClientsFilters(data);
    riskClientsState.pageSize = Number(riskClientsState.pageSize || getRiskClientsPagination(data).perPage || 20);

    filteredRows = getFilteredRiskClientsRows(data);
    pageCount = getRiskClientsPageCount(filteredRows.length);
    riskClientsState.page = Math.min(Math.max(1, riskClientsState.page), pageCount);
    displayRows = getRiskClientsDisplayRows(data, filteredRows);

    renderRiskClientsRows(data, displayRows);
    $(".js-risk-count").text(getRiskClientsRangeText(filteredRows.length));
    renderRiskClientsPagination(pageCount);
    updateRiskClientsFilterPanel(data, filteredRows.length);
  }

  function renderRiskClientsInfo(data) {
    var info = data && data.info ? data.info : null;
    var $card = $(".risk-clients-side-card--info");

    if (!info || !$card.length) {
      return;
    }

    $card.find(".risk-info-card__header h2").text(info.title);
    $card.find(".risk-info-card__header span").attr("title", info.tooltip || "");
    $card.find(".risk-info-card__lead").text(info.lead);
    $card.find(".risk-info-card__list").html((info.items || []).map(function (item) {
      return "<li>" + escapeHtml(item) + "</li>";
    }).join(""));
    $card.find(".risk-info-card__legend").html((info.legend || []).map(function (item) {
      return '<div class="risk-info-card__legend-row risk-info-card__legend-row--' + escapeHtml(item.type) + '">' +
        "<span></span>" +
        "<strong>" + escapeHtml(item.label) + "</strong>" +
        "<em>" + escapeHtml(item.value) + "</em>" +
      "</div>";
    }).join(""));
  }

  function renderRiskClientsSummary(data) {
    var summary = data && data.summary ? data.summary : null;

    if (!summary) {
      return;
    }

    $(".risk-summary-section--critical .risk-summary-text p").text(summary.critical.title);
    $(".risk-summary-section--critical .risk-summary-pair strong").text(summary.critical.count);
    $(".risk-summary-section--critical .risk-summary-pair span").text(summary.critical.countLabel);
    $(".risk-summary-section--critical .risk-summary-stack strong").text(summary.critical.loss);
    $(".risk-summary-section--critical .risk-summary-stack span").text(summary.critical.lossLabel);

    $(".risk-summary-section--actions .risk-summary-text p").text(summary.actions.title);
    $(".risk-summary-section--actions .risk-summary-action-row strong").text(summary.actions.count);
    $(".risk-summary-section--actions .risk-summary-action-row > span").html(summary.actions.text);
    $(".risk-summary-section--actions button").addClass("js-risk-create-tasks").find("span").text(summary.actions.button);

    $(".risk-summary-section--efficiency .risk-summary-text p").text(summary.efficiency.title);
    $(".risk-summary-section--efficiency .risk-summary-efficiency-row strong").text(summary.efficiency.value);
    $(".risk-summary-section--efficiency .risk-summary-efficiency-row span").html(summary.efficiency.text);
  }

  function renderRiskClientsSideChartsText(data) {
    var charts = data && data.charts ? data.charts : null;
    var time;
    var timePeriods;

    if (!charts) {
      return;
    }

    time = getSelectedRiskTimeChart(charts);
    timePeriods = charts.time && charts.time.periodOptions ? charts.time.periodOptions.map(function (option) {
      return option.period;
    }) : [charts.time.period];

    $(".risk-clients-side-card--time .risk-mini-card__header h2").text(charts.time.title);
    renderRiskOptions($(".risk-time-period-dropdown .dropdown__menu"), timePeriods);
    $(".risk-time-period-dropdown .dropdown__label").text(time.period);
    $(".risk-time-chart__badge").text(time.badge);
    $(".risk-time-chart__date--1").text(time.labels[0]);
    $(".risk-time-chart__date--11").text(time.labels[1]);
    $(".risk-time-chart__date--21").text(time.labels[2]);
    $(".risk-time-chart__date--31").text(time.labels[3]);

    $(".risk-loss-card__title").text(charts.loss.title);
    $(".risk-loss-card__total strong").text(charts.loss.total);
    $(".risk-loss-card__total span").text(charts.loss.delta);
    $(".risk-loss-chart__date--1").text(charts.loss.labels[0]);
    $(".risk-loss-chart__date--11").text(charts.loss.labels[1]);
    $(".risk-loss-chart__date--21").text(charts.loss.labels[2]);
    $(".risk-loss-chart__date--31").text(charts.loss.labels[3]);
  }

  function renderRiskClientsPageData() {
    var data = getRiskClientsData();

    if (!data || document.body.getAttribute("data-page") !== "risk") {
      return;
    }

    renderRiskClientsKpis(data);
    renderRiskClientsInfo(data);
    renderRiskClientsSummary(data);
    renderRiskClientsSideChartsText(data);
    renderRiskClientsTable(data);
  }

  function buildRiskZoneSeries(values, min, max) {
    return values.map(function (value) {
      return value >= min && value <= max ? value : null;
    });
  }

  function renderRiskTimeChart() {
    var el = document.querySelector("#risk-time-chart");
    var data = getRiskClientsData();
    var chart = data && data.charts ? getSelectedRiskTimeChart(data.charts) : null;
    var series = chart && chart.series ? chart.series : [];

    if (!el || !window.ApexCharts || !series.length) {
      return;
    }

    if (riskTimeChartInstance) {
      riskTimeChartInstance.destroy();
    }

    riskTimeChartInstance = new ApexCharts(el, {
      chart: {
        type: "line",
        width: Math.round(el.clientWidth || 164),
        height: Math.round(el.clientHeight || 96),
        parentHeightOffset: 0,
        animations: { enabled: false },
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
      },
      series: [
        { name: getRiskClientsText(data, "charts.timeSeriesName", "Риск"), data: series },
        { name: getRiskClientsText(data, "charts.lowSeriesName", "Низкий"), data: buildRiskZoneSeries(series, 0, 34.99) },
        { name: getRiskClientsText(data, "charts.mediumSeriesName", "Средний"), data: buildRiskZoneSeries(series, 35, 55) }
      ],
      colors: ["#ff4b42", "#30b971", "#f59f0b"],
      dataLabels: { enabled: false },
      stroke: {
        curve: "straight",
        width: [2, 2, 2],
        lineCap: "round"
      },
      markers: {
        size: 0,
        hover: {
          size: 2,
          sizeOffset: 0
        }
      },
      grid: {
        borderColor: "#e2e7f0",
        strokeDashArray: 0,
        padding: {
          top: -15,
          right: -8,
          bottom: -12,
          left: -10
        },
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false }
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: { show: false }
      },
      tooltip: {
        enabled: true,
        shared: false,
        x: { show: false },
        y: {
          formatter: function (value) {
            return Math.round(value) + getRiskClientsText(data, "charts.percentSuffix", "%");
          }
        }
      },
      legend: { show: false },
      states: {
        hover: { filter: { type: "none" } },
        active: { filter: { type: "none" } }
      }
    });

    riskTimeChartInstance.render();
  }

  function renderRiskLossChart() {
    var el = document.querySelector("#risk-loss-chart");
    var data = getRiskClientsData();
    var chart = data && data.charts ? data.charts.loss : null;
    var series = chart && chart.series ? chart.series : [];

    if (!el || !window.ApexCharts || !series.length) {
      return;
    }

    if (riskLossChartInstance) {
      riskLossChartInstance.destroy();
    }

    riskLossChartInstance = new ApexCharts(el, {
      chart: {
        type: "bar",
        width: Math.round(el.clientWidth || 158),
        height: Math.round(el.clientHeight || 70),
        parentHeightOffset: 0,
        animations: { enabled: false },
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
      },
      series: [{
        name: getRiskClientsText(data, "charts.lossSeriesName", "Потери"),
        data: series
      }],
      colors: ["#a67af5"],
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          columnWidth: "42%",
          borderRadius: 2,
          distributed: false
        }
      },
      grid: {
        borderColor: "#eef1f6",
        strokeDashArray: 0,
        padding: {
          top: -18,
          right: -8,
          bottom: -16,
          left: -10
        },
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false }
      },
      yaxis: {
        min: 0,
        max: 20,
        tickAmount: 2,
        labels: { show: false }
      },
      tooltip: {
        enabled: true,
        x: { show: false },
        y: {
          formatter: function (value) {
            return getRiskClientsText(data, "charts.euroPrefix", "€") + value + getRiskClientsText(data, "charts.thousandSuffix", "k");
          }
        }
      },
      legend: { show: false },
      states: {
        hover: { filter: { type: "none" } },
        active: { filter: { type: "none" } }
      }
    });

    riskLossChartInstance.render();
  }

  function renderRiskClientsCharts() {
    if (document.body.getAttribute("data-page") !== "risk") {
      return;
    }

    renderRiskTimeChart();
    renderRiskLossChart();
    riskChartsSizeSignature = getRiskChartsSizeSignature();
    bindRiskChartsResize();
  }

  function getRiskChartsSizeSignature() {
    var timeChart = document.querySelector("#risk-time-chart");
    var lossChart = document.querySelector("#risk-loss-chart");

    return [
      window.innerWidth || 0,
      timeChart ? Math.round(timeChart.clientWidth) : 0,
      timeChart ? Math.round(timeChart.clientHeight) : 0,
      lossChart ? Math.round(lossChart.clientWidth) : 0,
      lossChart ? Math.round(lossChart.clientHeight) : 0
    ].join(":");
  }

  function scheduleRiskChartsResize() {
    clearTimeout(riskChartsResizeTimer);

    riskChartsResizeTimer = setTimeout(function () {
      updateRiskChartsSize();
    }, 140);
  }

  function updateRiskChartSize(chartInstance, chartElement) {
    if (!chartInstance || !chartElement) {
      return;
    }

    chartInstance.updateOptions({
      chart: {
        width: Math.round(chartElement.clientWidth || 0),
        height: Math.round(chartElement.clientHeight || 0)
      }
    }, false, false, false);
  }

  function updateRiskChartsSize() {
    var nextSignature;
    var timeChart;
    var lossChart;

    if (document.body.getAttribute("data-page") !== "risk") {
      return;
    }

    nextSignature = getRiskChartsSizeSignature();

    if (!nextSignature || nextSignature === riskChartsSizeSignature) {
      return;
    }

    timeChart = document.querySelector("#risk-time-chart");
    lossChart = document.querySelector("#risk-loss-chart");

    if (!riskTimeChartInstance || !riskLossChartInstance) {
      renderRiskClientsCharts();
      return;
    }

    updateRiskChartSize(riskTimeChartInstance, timeChart);
    updateRiskChartSize(riskLossChartInstance, lossChart);
    riskChartsSizeSignature = nextSignature;
  }

  function bindRiskChartsResize() {
    var charts;

    if (riskChartsResizeBound) {
      return;
    }

    riskChartsResizeBound = true;
    $(window).on("resize.riskCharts orientationchange.riskCharts", scheduleRiskChartsResize);

    if (!window.ResizeObserver) {
      return;
    }

    charts = [
      document.querySelector("#risk-time-chart"),
      document.querySelector("#risk-loss-chart")
    ].filter(Boolean);

    if (!charts.length) {
      return;
    }

    riskChartsResizeObserver = new ResizeObserver(scheduleRiskChartsResize);
    charts.forEach(function (chart) {
      riskChartsResizeObserver.observe(chart);
    });
  }

  App.riskClients = {
    bind: bindRiskClientsUi,
    render: renderRiskClientsPageData,
    renderCharts: renderRiskClientsCharts
  };

})(window.jQuery, window, document);
