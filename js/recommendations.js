(function ($, window, document) {
  "use strict";

  var App = window.ReactivationApp = window.ReactivationApp || {};

  // ---------------------------------------------------------------------------
  // Recommendations page
  // ---------------------------------------------------------------------------

  var closeFloatingMenus = App.closeFloatingMenus;
  var escapeHtml = App.escapeHtml;
  var formatTemplate = App.formatTemplate;
  var getRecommendationsData = App.getRecommendationsData;
  var getValue = App.getValue;
  var showToast = App.showToast;
  var recommendationsState = {
    page: 1,
    pageSize: 20,
    stage: "",
    manager: "",
    query: ""
  };

  function getRecommendationsUi(data) {
    return data && data.ui ? data.ui : {};
  }

  function getRecommendationsText(data, path, fallback) {
    return getValue(getRecommendationsUi(data), path, fallback);
  }

  function bindRecommendationsUi() {
    $(document).on("input", ".js-recommendations-search", filterRecommendations);

    $(document).on("click", ".recommendations-stage-filter .dropdown__item", function () {
      recommendationsState.stage = $(this).text();
      recommendationsState.page = 1;
      renderRecommendationsTable(getRecommendationsData());
    });

    $(document).on("click", ".recommendations-manager-filter .dropdown__item", function () {
      recommendationsState.manager = $(this).text();
      recommendationsState.page = 1;
      renderRecommendationsTable(getRecommendationsData());
    });

    $(document).on("click", ".dropdown--page-size .dropdown__item", function () {
      recommendationsState.pageSize = Number($(this).text()) || 20;
      recommendationsState.page = 1;
      renderRecommendationsTable(getRecommendationsData());
    });

    $(document).on("click", ".recommendations-footer .pagination__item[data-page]", function () {
      recommendationsState.page = Number($(this).attr("data-page")) || 1;
      renderRecommendationsTable(getRecommendationsData());
    });

    $(document).on("click", ".recommendations-footer .pagination__item[data-next]", function () {
      var data = getRecommendationsData();
      var pageCount = getRecommendationsPageCount(data, getFilteredRecommendationRows(data).length);

      if (recommendationsState.page < pageCount) {
        recommendationsState.page += 1;
        renderRecommendationsTable(data);
      }
    });

    $(".js-recommendations-filter").off("click.recommendationsFilter").on("click.recommendationsFilter", function (event) {
      var data = getRecommendationsData();
      var total = getFilteredRecommendationRows(data).length;
      var $panel = $(".js-recommendations-filter-panel");
      var isOpen = !$panel.hasClass("is-open");

      event.preventDefault();
      event.stopPropagation();
      closeFloatingMenus();
      $(this).toggleClass("is-active", isOpen).attr("aria-expanded", isOpen ? "true" : "false");
      $panel.toggleClass("is-open", isOpen);
      updateRecommendationsFilterPanel(data, total);
      showToast(formatTemplate(getRecommendationsText(data, "filterAppliedToast", "Фильтры применены: {total}"), {
        total: total
      }));
    });

    $(document).on("click", ".js-recommendations-filter-apply", function () {
      var data = getRecommendationsData();
      var total = getFilteredRecommendationRows(data).length;

      closeFloatingMenus();
      showToast(formatTemplate(getRecommendationsText(data, "shownToast", "Показано рекомендаций: {total}"), {
        total: total
      }));
    });

    $(document).on("click", ".js-recommendations-filter-reset", function () {
      var data = getRecommendationsData();

      if (data && data.filters) {
        recommendationsState.stage = data.filters.stages[0];
        recommendationsState.manager = data.filters.managers[0];
      }

      recommendationsState.query = "";
      recommendationsState.page = 1;
      renderRecommendationsTable(data);
      updateRecommendationsFilterPanel(data, getFilteredRecommendationRows(data).length);
      showToast(getRecommendationsText(data, "resetToast", "Фильтры сброшены"));
    });

    $(document).on("click", "[data-recommendation-feedback]", function () {
      showToast($(this).attr("data-recommendation-feedback"));
    });
  }

  function updateRecommendationsFilterPanel(data, total) {
    var parts = [];
    var $panel = $(".js-recommendations-filter-panel");

    if (!$panel.length) {
      return;
    }

    $panel.attr("aria-label", getRecommendationsText(data, "filterPanelLabel", "Панель фильтров"));
    $panel.children("strong").text(getRecommendationsText(data, "filterTitle", "Фильтры"));
    $panel.children("span").html(escapeHtml(getRecommendationsText(data, "foundLabel", "Найдено")) +
      ': <b class="js-recommendations-filter-total">' + escapeHtml(total) + "</b>");
    $panel.find(".js-recommendations-filter-apply").text(getRecommendationsText(data, "applyButton", "Применить"));
    $panel.find(".js-recommendations-filter-reset").text(getRecommendationsText(data, "resetButton", "Сбросить"));

    if (!isAllRecommendationOption(recommendationsState.stage)) {
      parts.push(getRecommendationsText(data, "filterSummaryLabels.stage", "Этап") + ": " + recommendationsState.stage);
    }

    if (!isAllRecommendationOption(recommendationsState.manager)) {
      parts.push(getRecommendationsText(data, "filterSummaryLabels.manager", "Менеджер") + ": " + recommendationsState.manager);
    }

    if (recommendationsState.query) {
      parts.push(getRecommendationsText(data, "filterSummaryLabels.search", "Поиск") + ": " + recommendationsState.query);
    }

    if (!parts.length && data && data.filters) {
      parts.push(getRecommendationsText(data, "noFiltersText", "Фильтры не выбраны"));
    }

    $panel.find(".js-recommendations-filter-summary").text(parts.join(" · "));
  }

  function renderRecommendationsKpis(data) {
    if (!data.kpis) {
      return;
    }

    $(".recommendations-kpis .recommendation-kpi").each(function (index) {
      var kpi = data.kpis[index];

      if (!kpi) {
        return;
      }

      $(this).find(".kpi-card__label").text(kpi.label);
      $(this).find(".kpi-card__value").text(kpi.value);
      $(this).find(".recommendation-kpi__meta").text(kpi.meta);
    });
  }

  function renderRecommendationOptions($menu, options) {
    if (!$menu.length || !options) {
      return;
    }

    $menu.html(options.map(function (option) {
      return '<button class="dropdown__item" type="button">' + escapeHtml(option) + "</button>";
    }).join(""));
  }

  function isAllRecommendationOption(value) {
    return !value || value.indexOf("Все ") === 0;
  }

  function getRecommendationPagination(data) {
    return data && data.pagination ? data.pagination : {};
  }

  function getRecommendationTotal(data, filteredCount) {
    var pagination = getRecommendationPagination(data);

    if (hasRecommendationFilters()) {
      return filteredCount;
    }

    return Number(pagination.total) || filteredCount;
  }

  function hasRecommendationFilters() {
    return !isAllRecommendationOption(recommendationsState.stage) ||
      !isAllRecommendationOption(recommendationsState.manager) ||
      Boolean(recommendationsState.query);
  }

  function getRecommendationRows(data) {
    var source = data && data.rows ? data.rows : [];
    var total = Number(getRecommendationPagination(data).total) || source.length;
    var rows = [];
    var index;
    var clone;

    if (!source.length || source.length >= total) {
      return source;
    }

    for (index = 0; index < total; index += 1) {
      clone = $.extend({}, source[index % source.length]);
      clone.mockIndex = index + 1;
      rows.push(clone);
    }

    return rows;
  }

  function getFilteredRecommendationRows(data) {
    var rows = getRecommendationRows(data);
    var query = String(recommendationsState.query || "").toLowerCase().trim();

    return rows.filter(function (row) {
      var stageMatches = isAllRecommendationOption(recommendationsState.stage) || row.stage === recommendationsState.stage;
      var managerMatches = isAllRecommendationOption(recommendationsState.manager) || row.manager === recommendationsState.manager;
      var haystack = [
        row.client,
        row.company,
        row.stage,
        row.manager,
        row.coupon
      ].join(" ").toLowerCase();
      var queryMatches = !query || haystack.indexOf(query) !== -1;

      return stageMatches && managerMatches && queryMatches;
    });
  }

  function getRecommendationsDisplayRows(data, filteredRows) {
    var pageSize = Number(recommendationsState.pageSize) || Number(getRecommendationPagination(data).perPage) || 20;
    var start = (recommendationsState.page - 1) * pageSize;
    var pageRows = filteredRows.slice(start, start + pageSize);

    if (!pageRows.length && recommendationsState.page > 1) {
      recommendationsState.page = 1;
      pageRows = filteredRows.slice(0, pageSize);
    }

    return pageRows;
  }

  function getRecommendationsPageCount(data, filteredCount) {
    var total = getRecommendationTotal(data, filteredCount);
    var pagination = getRecommendationPagination(data);
    var divisor = Number(recommendationsState.pageSize || pagination.perPage || 20);

    return Math.max(1, Math.ceil(total / divisor));
  }

  function getRecommendationsRangeText(data, filteredCount) {
    var total = getRecommendationTotal(data, filteredCount);
    var pageSize = Number(recommendationsState.pageSize) || Number(getRecommendationPagination(data).perPage) || 20;
    var start;
    var end;

    if (!total) {
      return "0 из 0";
    }

    start = (recommendationsState.page - 1) * pageSize + 1;
    end = Math.min(recommendationsState.page * pageSize, total);

    return start + "–" + end + " из " + total;
  }

  function renderRecommendationRowActions(data, row, index) {
    var menuId = "recommendation-row-menu-" + index;
    var items = (data.actions || []).map(function (action) {
      return '<button class="action-menu__item" type="button" role="menuitem" data-feedback="' +
        escapeHtml(formatTemplate(getRecommendationsText(data, "rowActionFeedback", "{action}: {client}"), {
          action: action,
          client: row.client
        })) + '">' + escapeHtml(action) + "</button>";
    }).join("");

    return '<div class="recommendation-row-actions">' +
      '<button class="recommendation-row-menu" type="button" aria-label="' + escapeHtml(getRecommendationsText(data, "rowActionsLabel", "Действия")) + '" aria-expanded="false" aria-controls="' + menuId + '" data-action-menu="' + menuId + '"></button>' +
      '<div id="' + menuId + '" class="action-menu" role="menu">' + items + "</div>" +
    "</div>";
  }

  function renderRecommendationRows(data, rows) {
    var $tbody = $(".js-recommendations-rows");

    if (!$tbody.length) {
      return;
    }

    if (!rows.length) {
      $tbody.html('<tr class="recommendations-empty-row"><td colspan="8">' + escapeHtml(getRecommendationsText(data, "emptyText", "Ничего не найдено")) + "</td></tr>");
      return;
    }

    $tbody.html(rows.map(function (row, index) {
      var taskFeedback = formatTemplate(getRecommendationsText(data, "taskCreatedToast", "Задача создана: {client}"), {
        client: row.client
      });
      var mailMenuId = "recommendation-mail-menu-" + index;

      return '<tr data-client="' + escapeHtml(row.client + " " + row.company) + '">' +
        '<td><input class="recommendations-check js-row-check" type="checkbox" aria-label="' + escapeHtml(formatTemplate(getRecommendationsText(data, "selectRowLabel", "Выбрать {client}"), { client: row.client })) + '"></td>' +
        '<td><div class="table__primary recommendations-client"><strong>' + escapeHtml(row.client) + '</strong><span>' + escapeHtml(row.company) + "</span></div></td>" +
        '<td><span class="badge badge--' + escapeHtml(row.stageType) + '">' + escapeHtml(row.stage) + "</span></td>" +
        '<td><div class="recommendations-delay"><strong>' + escapeHtml(row.delay) + '</strong><span>' + escapeHtml(row.delayText) + "</span></div></td>" +
        '<td><div class="recommendations-discount"><span class="discount-pill discount-pill--' + escapeHtml(row.discountType) + '">' + escapeHtml(row.discount) + '</span><div class="coupon-box"><span>' + escapeHtml(getRecommendationsText(data, "couponCodeLabel", "Код купона")) + '</span><strong>' + escapeHtml(row.coupon) + '</strong><button type="button" data-copy="' + escapeHtml(row.coupon) + '" aria-label="' + escapeHtml(getRecommendationsText(data, "couponCodeLabel", "Код купона")) + '"></button></div></div></td>' +
        '<td><div class="recommendations-actions"><button class="recommendation-action recommendation-action--task" type="button" data-recommendation-feedback="' + escapeHtml(taskFeedback) + '"><span>↯</span>' + escapeHtml(getRecommendationsText(data, "taskButton", "Создать задачу")) + '</button><div class="recommendation-mail-wrap"><button class="recommendation-action recommendation-action--mail" type="button" aria-expanded="false" aria-controls="' + mailMenuId + '" data-action-menu="' + mailMenuId + '"><span>✉</span>' + escapeHtml(getRecommendationsText(data, "mailButton", "Отправить письмо")) + '<i></i></button><div id="' + mailMenuId + '" class="action-menu" role="menu"><button class="action-menu__item" type="button" role="menuitem" data-feedback="' + escapeHtml(formatTemplate(getRecommendationsText(data, "mailSentToast", "Письмо отправлено: {client}"), { client: row.client })) + '">' + escapeHtml(getRecommendationsText(data, "mailSendNow", "Отправить сейчас")) + '</button><button class="action-menu__item" type="button" role="menuitem" data-feedback="' + escapeHtml(formatTemplate(getRecommendationsText(data, "mailScheduledToast", "Письмо запланировано: {client}"), { client: row.client })) + '">' + escapeHtml(getRecommendationsText(data, "mailSchedule", "Запланировать")) + "</button></div></div></div></td>" +
        '<td><div class="recommendations-manager"><span class="manager-avatar manager-avatar--' + escapeHtml(row.managerAvatar) + '"></span><span><strong>' + escapeHtml(row.manager) + '</strong><em>' + escapeHtml(row.managerRole) + "</em></span></div></td>" +
        "<td>" + renderRecommendationRowActions(data, row, index) + "</td>" +
      "</tr>";
    }).join(""));
  }

  function renderRecommendationsTable(data) {
    var $card = $(".recommendations-main__card");
    var filteredRows;
    var displayRows;
    var pageCount;

    if (!$card.length) {
      return;
    }

    if (data.filters) {
      recommendationsState.stage = recommendationsState.stage || data.filters.stages[0];
      recommendationsState.manager = recommendationsState.manager || data.filters.managers[0];
    }

    recommendationsState.pageSize = Number(recommendationsState.pageSize || getRecommendationPagination(data).perPage || 20);
    filteredRows = getFilteredRecommendationRows(data);
    pageCount = getRecommendationsPageCount(data, filteredRows.length);
    recommendationsState.page = Math.min(Math.max(1, recommendationsState.page), pageCount);
    displayRows = getRecommendationsDisplayRows(data, filteredRows);

    if (data.filters) {
      renderRecommendationOptions($card.find(".dropdown").eq(0).find(".dropdown__menu"), data.filters.stages);
      renderRecommendationOptions($card.find(".dropdown").eq(1).find(".dropdown__menu"), data.filters.managers);
      $card.find(".recommendations-stage-filter .dropdown__label").text(recommendationsState.stage);
      $card.find(".recommendations-manager-filter .dropdown__label").text(recommendationsState.manager);
    }

    renderRecommendationRows(data, displayRows);
    $card.find(".js-check-all").prop("checked", false);
    $card.find(".js-recommendations-search").val(recommendationsState.query);

    if (data.pagination) {
      $card.find(".dropdown--page-size .dropdown__label").text(String(recommendationsState.pageSize));
      $card.find(".recommendations-count").text(getRecommendationsRangeText(data, filteredRows.length));
      renderRecommendationsPagination($card, pageCount);
      updateRecommendationsFilterPanel(data, filteredRows.length);
    }
  }

  function renderRecommendationsPagination($card, pageCount) {
    var buttons = [];
    var page;

    for (page = 1; page <= pageCount; page += 1) {
      buttons.push('<button class="pagination__item' + (page === recommendationsState.page ? " is-active" : "") +
        '" type="button" data-page="' + page + '">' + page + "</button>");
    }

    buttons.push('<button class="pagination__item pagination__item--next" type="button" data-next="true"' +
      (recommendationsState.page >= pageCount ? " disabled" : "") + ' aria-label="' + escapeHtml(getRecommendationsText(getRecommendationsData(), "nextPageLabel", "Следующая страница")) + '">→</button>');

    $card.find(".pagination").html(buttons.join(""));
  }

  function filterRecommendations() {
    recommendationsState.query = $(".js-recommendations-search").val().trim();
    recommendationsState.page = 1;
    renderRecommendationsTable(getRecommendationsData());
  }

  function renderRecommendationsData() {
    var data = getRecommendationsData();

    if (!data || document.body.getAttribute("data-page") !== "recommendations") {
      return;
    }

    renderRecommendationsKpis(data);
    renderRecommendationsTable(data);
  }

  // ---------------------------------------------------------------------------
  // Chart renderers
  // ---------------------------------------------------------------------------

  App.recommendations = {
    bind: bindRecommendationsUi,
    render: renderRecommendationsData
  };

})(window.jQuery, window, document);
