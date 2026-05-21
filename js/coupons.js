(function ($, window, document) {
  "use strict";

  var App = window.ReactivationApp = window.ReactivationApp || {};

  // ---------------------------------------------------------------------------
  // Coupons page
  // ---------------------------------------------------------------------------

  var closeFloatingMenus = App.closeFloatingMenus;
  var escapeHtml = App.escapeHtml;
  var formatTemplate = App.formatTemplate;
  var getCouponsData = App.getCouponsData;
  var getValue = App.getValue;
  var showToast = App.showToast;
  var couponsState = {
    page: 1,
    pageSize: 20,
    status: "",
    stage: "",
    manager: "",
    period: "",
    query: "",
    activeKey: ""
  };
  var couponsRenderedRows = [];

  function getCouponsUi(data) {
    return data && data.ui ? data.ui : {};
  }

  function getCouponsText(data, path, fallback) {
    return getValue(getCouponsUi(data), path, fallback);
  }

  function bindCouponsUi() {
    $(document).on("input", ".js-coupons-search", function () {
      couponsState.query = $(this).val().trim();
      couponsState.page = 1;
      renderCouponsTable(getCouponsData());
    });

    $(document).on("click", ".coupons-status-filter .dropdown__item", function () {
      couponsState.status = $(this).text();
      couponsState.page = 1;
      renderCouponsTable(getCouponsData());
    });

    $(document).on("click", ".coupons-stage-filter .dropdown__item", function () {
      couponsState.stage = $(this).text();
      couponsState.page = 1;
      renderCouponsTable(getCouponsData());
    });

    $(document).on("click", ".coupons-manager-filter .dropdown__item", function () {
      couponsState.manager = $(this).text();
      couponsState.page = 1;
      renderCouponsTable(getCouponsData());
    });

    $(document).on("click", ".coupons-period-filter .dropdown__item", function () {
      couponsState.period = $(this).text();
      couponsState.page = 1;
      renderCouponsTable(getCouponsData());
    });

    $(document).on("click", ".dropdown--coupons-page-size .dropdown__item", function () {
      couponsState.pageSize = Number($(this).text()) || 20;
      couponsState.page = 1;
      renderCouponsTable(getCouponsData());
    });

    $(document).on("click", ".js-coupons-pagination button[data-page]", function () {
      couponsState.page = Number($(this).attr("data-page")) || 1;
      renderCouponsTable(getCouponsData());
    });

    $(document).on("click", ".js-coupons-pagination button[data-next]", function () {
      var data = getCouponsData();
      var pageCount = getCouponsPageCount(getFilteredCouponRows(data).length);

      if (couponsState.page < pageCount) {
        couponsState.page += 1;
        renderCouponsTable(data);
      }
    });

    $(document).on("click", ".js-coupons-filter", function (event) {
      var data = getCouponsData();
      var total = getFilteredCouponRows(data).length;
      var $panel = $(".js-coupons-filter-panel");
      var isOpen = !$panel.hasClass("is-open");

      event.preventDefault();
      event.stopPropagation();
      closeFloatingMenus();
      $(this).toggleClass("is-active", isOpen).attr("aria-expanded", isOpen ? "true" : "false");
      $panel.toggleClass("is-open", isOpen);
      updateCouponsFilterPanel(data, total);
    });

    $(document).on("click", ".js-coupons-filter-apply", function () {
      var data = getCouponsData();
      var total = getFilteredCouponRows(data).length;

      closeFloatingMenus();
      showToast(formatTemplate(getCouponsText(data, "shownToast", "Показано купонов: {total}"), { total: total }));
    });

    $(document).on("click", ".js-coupons-filter-reset", function () {
      resetCouponsFilters(getCouponsData());
      renderCouponsTable(getCouponsData());
      showToast(getCouponsText(getCouponsData(), "resetToast", "Фильтры сброшены"));
    });

    $(document).on("click", ".js-coupons-rows tr[data-coupon-index]", function (event) {
      var index;
      var row;

      if ($(event.target).closest("button, a, .action-menu").length) {
        return;
      }

      index = Number($(this).attr("data-coupon-index"));
      row = couponsRenderedRows[index];

      if (!row) {
        return;
      }

      couponsState.activeKey = row.key;
      renderCouponDetail(row);
      $(".js-coupons-rows tr").removeClass("is-selected");
      $(this).addClass("is-selected");
    });

    $(document).on("click", ".coupon-action", function (event) {
      event.preventDefault();
      event.stopPropagation();
      showToast($(this).attr("data-feedback") || getCouponsText(getCouponsData(), "actionCompleteToast", "Действие выполнено"));
    });

    $(document).on("click", ".coupon-detail__close", function () {
      closeCouponDetail();
      showToast(getCouponsText(getCouponsData(), "detailClosedToast", "Детали купона закрыты"));
    });

    $(document).on("click", ".js-coupons-export", function () {
      showToast(getCouponsText(getCouponsData(), "exportReadyToast", "Отчёт подготовлен к экспорту"));
    });
  }

  function renderCouponsKpis(data) {
    if (!data || !data.kpis) {
      return;
    }

    $(".coupons-kpis .coupons-kpi-card").each(function (index) {
      var kpi = data.kpis[index];

      if (!kpi) {
        return;
      }

      $(this).find(".coupons-kpi-card__label").text(kpi.label);
      $(this).find(".coupons-kpi-card__value").text(kpi.value);
      $(this).find(".coupons-kpi-card__delta").text(kpi.delta);
    });
  }

  function renderCouponsEfficiency(data) {
    var efficiency = data && data.efficiency ? data.efficiency : null;
    var $card = $(".coupons-efficiency-card");

    if (!efficiency || !$card.length) {
      return;
    }

    $card.find(".coupons-efficiency__header h2").text(efficiency.title);
    $card.find(".coupons-efficiency__caption").text(efficiency.caption);

    if (efficiency.rows) {
      $card.find(".coupons-efficiency__rows").html(efficiency.rows.map(function (row) {
        return '<div class="coupons-efficiency__row">' +
          '<span class="coupons-efficiency__label">' + escapeHtml(row.label) + "</span>" +
          '<span class="coupons-efficiency__bar" aria-hidden="true">' +
            '<span class="coupons-efficiency__fill coupons-efficiency__fill--' + escapeHtml(row.type) + '"></span>' +
          "</span>" +
          "<strong>" + escapeHtml(row.value) + "</strong>" +
        "</div>";
      }).join(""));
    }
  }

  function renderCouponsSummary(data) {
    var summary = data && data.summary ? data.summary : null;

    if (!summary) {
      return;
    }

    $(".coupons-summary-item--conversion").find("p").text(summary.conversion.label);
    $(".coupons-summary-item--conversion").find("strong").text(summary.conversion.value);
    $(".coupons-summary-item--conversion").find("span:not(.coupons-summary-icon)").text(summary.conversion.meta);

    $(".coupons-summary-item--discount").find("p").text(summary.discount.label);
    $(".coupons-summary-item--discount").find("strong").text(summary.discount.value);
    $(".coupons-summary-item--discount").find("span:not(.coupons-summary-icon)").text(summary.discount.meta);

    $(".coupons-summary-item--revenue").find("p").text(summary.revenue.label);
    $(".coupons-summary-item--revenue").find("strong").text(summary.revenue.value);
    $(".coupons-summary-item--revenue").find("span:not(.coupons-summary-icon)").text(summary.revenue.meta);
  }

  function renderCouponOptions($menu, options) {
    if (!$menu.length || !options) {
      return;
    }

    $menu.html(options.map(function (option) {
      var label = typeof option === "object" ? option.label : String(option);

      return '<button class="dropdown__item" type="button">' + escapeHtml(label) + "</button>";
    }).join(""));
  }

  function isAllCouponOption(value) {
    return !value || value.indexOf(": Все") !== -1;
  }

  function getCouponPagination(data) {
    return data && data.pagination ? data.pagination : {};
  }

  function getCouponRows(data) {
    var source = data && data.rows ? data.rows : [];
    var total = Number(getCouponPagination(data).total) || source.length;
    var rows = [];
    var index;
    var clone;

    if (!source.length) {
      return rows;
    }

    for (index = 0; index < total; index += 1) {
      clone = $.extend(true, {}, source[index % source.length]);
      clone.key = clone.coupon + "-" + index;
      clone.mockIndex = index + 1;
      rows.push(clone);
    }

    return rows;
  }

  function getCouponPeriod(data) {
    var periods = data && data.filters && data.filters.periods ? data.filters.periods : [];

    return periods.filter(function (period) {
      return period.label === couponsState.period;
    })[0] || periods[0];
  }

  function hasCouponFilters(data) {
    var defaultPeriod = data && data.filters && data.filters.periods ? data.filters.periods[0].label : "";

    return !isAllCouponOption(couponsState.status) ||
      !isAllCouponOption(couponsState.stage) ||
      !isAllCouponOption(couponsState.manager) ||
      Boolean(couponsState.query) ||
      Boolean(couponsState.period && couponsState.period !== defaultPeriod);
  }

  function getFilteredCouponRows(data) {
    var rows = getCouponRows(data);
    var query = String(couponsState.query || "").toLowerCase().trim();
    var period = getCouponPeriod(data);
    var defaultPeriod = data && data.filters && data.filters.periods ? data.filters.periods[0] : null;

    return rows.filter(function (row) {
      var statusMatches = isAllCouponOption(couponsState.status) || row.status === couponsState.status;
      var stageMatches = isAllCouponOption(couponsState.stage) || row.stage === couponsState.stage;
      var managerMatches = isAllCouponOption(couponsState.manager) || row.manager === couponsState.manager;
      var periodMatches = !period || period === defaultPeriod || (row.dateISO >= period.from && row.dateISO <= period.to);
      var haystack = [
        row.client,
        row.company,
        row.stage,
        row.status,
        row.manager,
        row.coupon,
        row.date
      ].join(" ").toLowerCase();
      var queryMatches = !query || haystack.indexOf(query) !== -1;

      return statusMatches && stageMatches && managerMatches && periodMatches && queryMatches;
    });
  }

  function getCouponsDisplayRows(filteredRows) {
    var pageSize = Number(couponsState.pageSize) || 20;
    var start = (couponsState.page - 1) * pageSize;
    var pageRows = filteredRows.slice(start, start + pageSize);

    if (!pageRows.length && couponsState.page > 1) {
      couponsState.page = 1;
      pageRows = filteredRows.slice(0, pageSize);
    }

    return pageRows;
  }

  function getCouponsPageCount(filteredCount) {
    var pageSize = Number(couponsState.pageSize) || 20;

    return Math.max(1, Math.ceil(filteredCount / pageSize));
  }

  function getCouponsRangeText(filteredCount) {
    var pageSize = Number(couponsState.pageSize) || 20;
    var start;
    var end;

    if (!filteredCount) {
      return "0 из 0";
    }

    start = (couponsState.page - 1) * pageSize + 1;
    end = Math.min(couponsState.page * pageSize, filteredCount);

    return start + "–" + end + " из " + filteredCount;
  }

  function getManagerAvatarClass(row) {
    return row.managerAvatar === "female" ? " manager-avatar--female" : "";
  }

  function renderCouponRows(rows) {
    var $tbody = $(".js-coupons-rows");

    couponsRenderedRows = rows;

    if (!$tbody.length) {
      return;
    }

    if (!rows.length) {
      $tbody.html('<tr class="coupons-empty-row"><td colspan="8">' + escapeHtml(getCouponsText(getCouponsData(), "emptyText", "Ничего не найдено")) + "</td></tr>");
      return;
    }

    $tbody.html(rows.map(function (row, index) {
      var selected = row.key === couponsState.activeKey ? " is-selected" : "";

      return '<tr class="' + selected.trim() + '" data-coupon-index="' + index + '">' +
        '<td><div class="coupon-client"><strong>' + escapeHtml(row.client) + '</strong><span>' + escapeHtml(row.company) + "</span></div></td>" +
        '<td><span class="coupon-stage coupon-stage--' + escapeHtml(row.stageType) + '">' + escapeHtml(row.stage) + "</span></td>" +
        "<td>" + escapeHtml(row.discount) + "</td>" +
        '<td><div class="coupon-code">' + escapeHtml(row.coupon) + '<button type="button" data-copy="' + escapeHtml(row.coupon) + '" aria-label="' + escapeHtml(formatTemplate(getCouponsText(getCouponsData(), "copyCouponLabel", "Скопировать {coupon}"), { coupon: row.coupon })) + '"></button></div></td>' +
        '<td><span class="coupon-status coupon-status--' + escapeHtml(row.statusType) + '">' + escapeHtml(row.status) + "</span></td>" +
        '<td><div class="coupon-manager"><span class="manager-avatar' + getManagerAvatarClass(row) + '" aria-hidden="true"></span><span><strong>' + escapeHtml(row.manager) + "</strong><em>" + escapeHtml(getCouponsText(getCouponsData(), "managerRole", "менеджер")) + "</em></span></div></td>" +
        "<td><time>" + escapeHtml(row.date) + "</time></td>" +
        '<td><div class="coupon-actions">' +
          '<button class="coupon-action coupon-action--send" type="button" aria-label="Отправить" data-feedback="' + escapeHtml(formatTemplate(getCouponsText(getCouponsData(), "actionFeedback.send", "Купон отправлен: {client}"), { client: row.client })) + '"></button>' +
          '<button class="coupon-action coupon-action--calendar" type="button" aria-label="Задача" data-feedback="' + escapeHtml(formatTemplate(getCouponsText(getCouponsData(), "actionFeedback.task", "Задача создана: {client}"), { client: row.client })) + '"></button>' +
          '<button class="coupon-action coupon-action--chart" type="button" aria-label="Отчёт" data-feedback="' + escapeHtml(formatTemplate(getCouponsText(getCouponsData(), "actionFeedback.report", "Открыт отчёт: {client}"), { client: row.client })) + '"></button>' +
          '<button class="coupon-action coupon-action--close" type="button" aria-label="Исключить" data-feedback="' + escapeHtml(formatTemplate(getCouponsText(getCouponsData(), "actionFeedback.exclude", "Купон исключён: {client}"), { client: row.client })) + '"></button>' +
        "</div></td>" +
      "</tr>";
    }).join(""));
  }

  function getCouponHistory(row) {
    var data = getCouponsData();
    var defaults = getCouponsText(data, "historyDefaults", {});

    if (row.history && row.history.length) {
      return row.history;
    }

    return [
      { type: "created", label: defaults.created, time: formatTemplate(defaults.createdTime, { date: row.date }) },
      { type: "sent", label: defaults.sent, time: row.status === defaults.created ? defaults.emptyTime : formatTemplate(defaults.sentTime, { date: row.date }) },
      { type: "used", label: defaults.used, time: row.status === defaults.used ? formatTemplate(defaults.usedTime, { date: row.date }) : defaults.emptyTime }
    ];
  }

  function renderCouponDetail(row) {
    var $card = $(".js-coupon-detail");
    var history;

    if (!$card.length || !row) {
      closeCouponDetail();
      return;
    }

    $card.removeClass("is-collapsed");
    $card.find(".coupon-detail__client").text(row.client);
    $card.find(".coupon-detail__company").text(row.company);
    $card.find(".coupon-detail__facts").first().html(
      "<div><dt>" + escapeHtml(getCouponsText(getCouponsData(), "detailLabels.delayCycle", "Задержка цикла")) + "</dt><dd class=\"coupon-detail__danger\">" + escapeHtml(row.delay) + "</dd></div>" +
      "<div><dt>" + escapeHtml(getCouponsText(getCouponsData(), "detailLabels.expectedCycle", "Ожидаемый цикл")) + "</dt><dd>" + escapeHtml(row.expectedCycle) + "</dd></div>" +
      "<div><dt>" + escapeHtml(getCouponsText(getCouponsData(), "detailLabels.actualCycle", "Фактический цикл")) + "</dt><dd>" + escapeHtml(row.actualCycle) + "</dd></div>"
    );
    $card.find(".coupon-detail__code strong").text(row.coupon);
    $card.find(".coupon-detail__code button").attr({
      "data-copy": row.coupon,
      "aria-label": formatTemplate(getCouponsText(getCouponsData(), "copyCouponLabel", "Скопировать {coupon}"), { coupon: row.coupon })
    });
    $card.find(".coupon-detail__facts--single dd").text(row.discount);
    $card.find(".coupon-detail__manager-row .manager-avatar")
      .attr("class", "manager-avatar" + getManagerAvatarClass(row));
    $card.find(".coupon-detail__manager-row strong").text(row.manager);
    $card.find(".coupon-detail__manager-row em").text(getCouponsText(getCouponsData(), "managerRole", "менеджер"));

    history = getCouponHistory(row);
    $card.find(".coupon-detail__history").html(
      '<p class="coupon-detail__label">' + escapeHtml(getCouponsText(getCouponsData(), "historyTitle", "История:")) + "</p>" +
      history.map(function (item) {
        return '<div class="coupon-detail__history-row coupon-detail__history-row--' + escapeHtml(item.type) + '">' +
          '<span aria-hidden="true"></span>' +
          "<strong>" + escapeHtml(item.label) + "</strong>" +
          "<time>" + escapeHtml(item.time) + "</time>" +
        "</div>";
      }).join("")
    );
  }

  function closeCouponDetail() {
    $(".js-coupon-detail").addClass("is-collapsed");
    couponsState.activeKey = "";
    $(".js-coupons-rows tr").removeClass("is-selected");
  }

  function renderCouponsPagination(pageCount) {
    var $pagination = $(".js-coupons-pagination");
    var buttons = [];
    var page;
    var last = pageCount;

    if (!$pagination.length) {
      return;
    }

    if (pageCount <= 5) {
      for (page = 1; page <= pageCount; page += 1) {
        buttons.push(renderCouponPageButton(page));
      }
    } else {
      buttons.push(renderCouponPageButton(1));
      buttons.push(renderCouponPageButton(2));
      buttons.push(renderCouponPageButton(3));

      if (couponsState.page > 3 && couponsState.page < last) {
        buttons.push(renderCouponPageButton(couponsState.page));
      }

      buttons.push("<span>...</span>");
      buttons.push(renderCouponPageButton(last));
    }

    buttons.push('<button class="coupons-pagination__next" type="button" data-next="true"' +
      (couponsState.page >= pageCount ? " disabled" : "") + ' aria-label="' + escapeHtml(getCouponsText(getCouponsData(), "nextPageLabel", "Следующая страница")) + '"></button>');

    $pagination.html(buttons.join(""));
  }

  function renderCouponPageButton(page) {
    return '<button class="' + (page === couponsState.page ? "is-active" : "") +
      '" type="button" data-page="' + page + '">' + page + "</button>";
  }

  function updateCouponsFilterPanel(data, total) {
    var parts = [];
    var defaultPeriod = data && data.filters && data.filters.periods ? data.filters.periods[0].label : "";
    var $panel = $(".js-coupons-filter-panel");

    if (!$panel.length) {
      return;
    }

    if (!isAllCouponOption(couponsState.status)) {
      parts.push(getCouponsText(data, "filterSummaryLabels.status", "Статус") + ": " + couponsState.status);
    }

    if (!isAllCouponOption(couponsState.stage)) {
      parts.push(getCouponsText(data, "filterSummaryLabels.stage", "Этап") + ": " + couponsState.stage);
    }

    if (!isAllCouponOption(couponsState.manager)) {
      parts.push(getCouponsText(data, "filterSummaryLabels.manager", "Менеджер") + ": " + couponsState.manager);
    }

    if (couponsState.period && couponsState.period !== defaultPeriod) {
      parts.push(couponsState.period);
    }

    if (couponsState.query) {
      parts.push(getCouponsText(data, "filterSummaryLabels.search", "Поиск") + ": " + couponsState.query);
    }

    $panel.find(".js-coupons-filter-total").text(total);
    $panel.find(".js-coupons-filter-summary").text(parts.length ? parts.join(" · ") : getCouponsText(data, "noFiltersText", "Фильтры не выбраны"));
  }

  function resetCouponsFilters(data) {
    if (data && data.filters) {
      couponsState.status = data.filters.statuses[0];
      couponsState.stage = data.filters.stages[0];
      couponsState.manager = data.filters.managers[0];
      couponsState.period = data.filters.periods[0].label;
    }

    couponsState.query = "";
    couponsState.page = 1;
    closeFloatingMenus();
  }

  function renderCouponsFilters(data) {
    var filters = data && data.filters ? data.filters : null;

    if (!filters) {
      return;
    }

    couponsState.status = couponsState.status || filters.statuses[0];
    couponsState.stage = couponsState.stage || filters.stages[0];
    couponsState.manager = couponsState.manager || filters.managers[0];
    couponsState.period = couponsState.period || filters.periods[0].label;

    renderCouponOptions($(".coupons-status-filter .dropdown__menu"), filters.statuses);
    renderCouponOptions($(".coupons-stage-filter .dropdown__menu"), filters.stages);
    renderCouponOptions($(".coupons-manager-filter .dropdown__menu"), filters.managers);
    renderCouponOptions($(".coupons-period-filter .dropdown__menu"), filters.periods);

    $(".coupons-status-filter .dropdown__label").text(couponsState.status);
    $(".coupons-stage-filter .dropdown__label").text(couponsState.stage);
    $(".coupons-manager-filter .dropdown__label").text(couponsState.manager);
    $(".coupons-period-filter .dropdown__label").text(couponsState.period);
    $(".js-coupons-search").val(couponsState.query);
  }

  function renderCouponsTable(data) {
    var filteredRows;
    var displayRows;
    var pageCount;

    if (!data || document.body.getAttribute("data-page") !== "coupons") {
      return;
    }

    renderCouponsFilters(data);
    couponsState.pageSize = Number(couponsState.pageSize || getCouponPagination(data).perPage || 20);

    filteredRows = getFilteredCouponRows(data);
    pageCount = getCouponsPageCount(filteredRows.length);
    couponsState.page = Math.min(Math.max(1, couponsState.page), pageCount);
    displayRows = getCouponsDisplayRows(filteredRows);

    if (!displayRows.some(function (row) { return row.key === couponsState.activeKey; })) {
      couponsState.activeKey = displayRows.length ? displayRows[0].key : "";
    }

    renderCouponRows(displayRows);
    $(".dropdown--coupons-page-size .dropdown__label").text(String(couponsState.pageSize));
    $(".js-coupons-count").text(getCouponsRangeText(filteredRows.length));
    renderCouponsPagination(pageCount);
    updateCouponsFilterPanel(data, filteredRows.length);

    if (couponsState.activeKey) {
      renderCouponDetail(displayRows.filter(function (row) {
        return row.key === couponsState.activeKey;
      })[0]);
    } else {
      closeCouponDetail();
    }
  }

  function renderCouponsPageData() {
    var data = getCouponsData();

    if (!data || document.body.getAttribute("data-page") !== "coupons") {
      return;
    }

    renderCouponsKpis(data);
    renderCouponsEfficiency(data);
    renderCouponsSummary(data);
    renderCouponOptions($(".dropdown--coupons-page-size .dropdown__menu"), getCouponPagination(data).pageSizes || []);
    renderCouponsTable(data);
  }

  App.coupons = {
    bind: bindCouponsUi,
    render: renderCouponsPageData
  };

})(window.jQuery, window, document);
