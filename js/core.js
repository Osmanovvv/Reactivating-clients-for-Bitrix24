(function ($, window, document) {
  "use strict";

  var App = window.ReactivationApp = window.ReactivationApp || {};

  // ---------------------------------------------------------------------------
  // Shared shell, data access and UI helpers
  // ---------------------------------------------------------------------------

  var TOAST_HIDE_DELAY = 2200;
  var COPIED_STATE_DELAY = 1200;
  var BUTTON_BUSY_DELAY = 650;
  var toastTimer = null;

  function activateCurrentNavigation() {
    var page = document.body.getAttribute("data-page");

    $(".sidebar__link").removeClass("is-active");
    $('.sidebar__link[data-page="' + page + '"]').addClass("is-active");
  }

  function hydrateStaticShell() {
    if (!getData("", null)) {
      return;
    }

    $(".brand__text strong").text(getData("appName", ""));
    $(".brand__text span").text(getData("appSubtitle", ""));
    $(".topbar__date").text(getData("period", ""));
    $(".js-updated-at").text(getData("updatedAt", ""));
    hydrateTopbarPeriodDropdowns();
  }

  function normalizePeriodOption(option) {
    if (typeof option === "string") {
      return {
        label: option,
        feedback: ""
      };
    }

    return option || {};
  }

  function getTopbarPeriodOptions() {
    var options = getData("periodOptions", []);

    if (options.length) {
      return options.map(normalizePeriodOption);
    }

    return [{
      label: getData("period", ""),
      feedback: ""
    }];
  }

  function hydrateTopbarPeriodDropdowns() {
    var options = getTopbarPeriodOptions();
    var items = options.map(function (option) {
      return '<button class="topbar-period__item" type="button">' + escapeHtml(option.label) + "</button>";
    }).join("");

    $(".topbar__date").each(function () {
      var $button = $(this);
      var $wrapper;

      if (!$button.parent().hasClass("topbar-period")) {
        $button.wrap('<div class="topbar-period"></div>');
      }

      $wrapper = $button.closest(".topbar-period");
      $button.attr({
        "aria-expanded": "false",
        "aria-haspopup": "true"
      });

      $wrapper.find(".topbar-period__menu").remove();
      $wrapper.append('<div class="topbar-period__menu" role="menu">' + items + "</div>");
    });
  }

  function closeFloatingMenus() {
    $(".dropdown").removeClass("is-open");
    $(".action-menu").removeClass("is-open");
    $(".tooltip").removeClass("is-open");
    $(".topbar-period").removeClass("is-open");
    $(".js-recommendations-filter-panel").removeClass("is-open");
    $(".js-coupons-filter-panel").removeClass("is-open");
    $(".js-risk-filter-panel").removeClass("is-open");
    $(".js-recommendations-filter").removeClass("is-active").attr("aria-expanded", "false");
    $(".js-coupons-filter").removeClass("is-active").attr("aria-expanded", "false");
    $(".js-risk-filter").removeClass("is-active").attr("aria-expanded", "false");
    $(".dropdown__toggle, [data-action-menu], .topbar__date").attr("aria-expanded", "false");
    $(".tooltip__icon").attr("aria-expanded", "false");
  }

  function showToast(message) {
    var $toast = $(".js-toast");

    if (!message) {
      return;
    }

    if (!$toast.length) {
      $toast = $('<div class="toast js-toast" role="status" aria-live="polite"></div>');
      $("body").append($toast);
    }

    window.clearTimeout(toastTimer);
    $toast.text(message).addClass("is-visible");

    toastTimer = window.setTimeout(function () {
      $toast.removeClass("is-visible");
    }, TOAST_HIDE_DELAY);
  }

  function setSidebarOpen(isOpen) {
    $("body").toggleClass("is-sidebar-open is-menu-open", isOpen);
    $(".topbar__burger").attr("aria-expanded", isOpen ? "true" : "false");
  }

  function markCopied($button) {
    $button.addClass("is-copied");

    window.setTimeout(function () {
      $button.removeClass("is-copied");
    }, COPIED_STATE_DELAY);
  }

  function showButtonLoading($button) {
    if (!$button.length) {
      return;
    }

    $button.addClass("is-loading").attr("aria-busy", "true");

    window.setTimeout(function () {
      $button.removeClass("is-loading").removeAttr("aria-busy");
    }, BUTTON_BUSY_DELAY);
  }

  function getValue(source, path, fallback) {
    var parts = String(path || "").split(".");
    var cursor = source;
    var index;

    for (index = 0; index < parts.length; index += 1) {
      if (!cursor || cursor[parts[index]] === undefined || cursor[parts[index]] === null) {
        return fallback;
      }

      cursor = cursor[parts[index]];
    }

    return cursor;
  }

  function formatTemplate(template, values) {
    return String(template || "").replace(/\{([a-zA-Z0-9_]+)\}/g, function (match, key) {
      return values && values[key] !== undefined && values[key] !== null ? values[key] : "";
    });
  }

  function getData(path, fallback) {
    if (App.data && typeof App.data.get === "function") {
      return App.data.get(path, fallback);
    }

    return getValue(window.AppData || {}, path, fallback);
  }

  function setData(path, value) {
    var parts;
    var cursor;
    var index;

    if (App.data && typeof App.data.set === "function") {
      return App.data.set(path, value);
    }

    if (!window.AppData) {
      window.AppData = {};
    }

    parts = String(path || "").split(".").filter(Boolean);

    if (!parts.length) {
      window.AppData = value || {};
      return window.AppData;
    }

    cursor = window.AppData;

    for (index = 0; index < parts.length - 1; index += 1) {
      if (!cursor[parts[index]] || typeof cursor[parts[index]] !== "object") {
        cursor[parts[index]] = {};
      }

      cursor = cursor[parts[index]];
    }

    cursor[parts[parts.length - 1]] = value;
    return value;
  }

  function getPageData(page) {
    if (App.data && typeof App.data.getPageData === "function") {
      return App.data.getPageData(page);
    }

    return getData(page, null);
  }

  function getGlobalUiData() {
    return getData("ui", {});
  }

  function getGlobalMessage(key, fallback) {
    return getValue(getGlobalUiData(), "messages." + key, fallback);
  }

  function updateCheckAllState($table) {
    var $checks = $table.find(".js-row-check");
    var $checkAll = $table.find(".js-check-all");
    var checkedCount = $checks.filter(":checked").length;

    if (!$checkAll.length) {
      return;
    }

    $checkAll.prop("checked", $checks.length > 0 && checkedCount === $checks.length);
    $checkAll.prop("indeterminate", checkedCount > 0 && checkedCount < $checks.length);
  }

  function enhanceInteractiveSemantics(context) {
    var $root = context ? $(context) : $(document);

    $(".sidebar").attr("id", "app-sidebar");
    $(".topbar__burger").attr("aria-controls", "app-sidebar");
    $root.find(".dropdown__menu, .action-menu, .topbar-period__menu").attr("role", "menu");
    $root.find(".dropdown__item, .action-menu__item, .topbar-period__item").attr("role", "menuitem");
    $root.find(".tooltip__icon").attr({
      role: "button",
      "aria-expanded": "false"
    });
  }

  function getMenuItems($item) {
    return $item.closest(".dropdown__menu, .action-menu, .topbar-period__menu").find("button");
  }

  function focusMenuItem($items, index) {
    if (!$items.length) {
      return;
    }

    $items.eq((index + $items.length) % $items.length).trigger("focus");
  }

  function focusFirstMenuItem($menu) {
    window.setTimeout(function () {
      focusMenuItem($menu.find("button"), 0);
    }, 0);
  }

  function focusMenuTrigger($item) {
    var $menu = $item.closest(".dropdown__menu, .action-menu, .topbar-period__menu");
    var id = $menu.attr("id");

    if ($menu.hasClass("dropdown__menu")) {
      $menu.closest(".dropdown").find(".dropdown__toggle").first().trigger("focus");
      return;
    }

    if ($menu.hasClass("topbar-period__menu")) {
      $menu.closest(".topbar-period").find(".topbar__date").first().trigger("focus");
      return;
    }

    if (id) {
      $('[data-action-menu="' + id + '"]').first().trigger("focus");
    }
  }

  function handleMenuItemKeydown(event) {
    var $item = $(event.currentTarget);
    var $items = getMenuItems($item);
    var index = $items.index($item);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusMenuItem($items, index + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusMenuItem($items, index - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusMenuItem($items, 0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusMenuItem($items, $items.length - 1);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeFloatingMenus();
      focusMenuTrigger($item);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      $item.trigger("click");
    }
  }

  function bindDropdowns() {
    $(document).on("click", ".dropdown__toggle", function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      var $dropdown = $(this).closest(".dropdown");
      var isOpen = !$dropdown.hasClass("is-open");

      $(".dropdown").not($dropdown).removeClass("is-open");
      $(".action-menu").removeClass("is-open");
      $(".topbar-period").removeClass("is-open");
      $(".dropdown__toggle, [data-action-menu], .topbar__date").attr("aria-expanded", "false");
      $dropdown.toggleClass("is-open", isOpen);
      $(this).attr("aria-expanded", isOpen ? "true" : "false");
      enhanceInteractiveSemantics($dropdown);
    });

    $(document).on("keydown", ".dropdown__toggle", function (event) {
      var $dropdown;

      if (event.key !== "ArrowDown") {
        return;
      }

      event.preventDefault();
      $dropdown = $(this).closest(".dropdown");

      if (!$dropdown.hasClass("is-open")) {
        $(this).trigger("click");
      }

      focusFirstMenuItem($dropdown.find(".dropdown__menu"));
    });

    $(document).on("click", ".dropdown__item", function () {
      var $item = $(this);
      var $dropdown = $item.closest(".dropdown");
      var $label = $dropdown.find(".dropdown__label").first();

      if ($label.length) {
        $label.text($item.text());
      }

      $dropdown.removeClass("is-open");
      $dropdown.find(".dropdown__toggle").attr("aria-expanded", "false");
    });

    $(document).on("keydown", ".dropdown__item", handleMenuItemKeydown);
  }

  function bindActionMenus() {
    $(document).on("click", "[data-action-menu]", function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      var target = $(this).attr("data-action-menu");
      var $menu = $("#" + target);
      var isOpen = !$menu.hasClass("is-open");

      $(".dropdown").removeClass("is-open");
      $(".action-menu").not($menu).removeClass("is-open");
      $(".topbar-period").removeClass("is-open");
      $(".dropdown__toggle, [data-action-menu], .topbar__date").attr("aria-expanded", "false");
      $menu.toggleClass("is-open", isOpen);
      $(this).attr("aria-expanded", isOpen ? "true" : "false");
      enhanceInteractiveSemantics($menu);
    });

    $(document).on("keydown", "[data-action-menu]", function (event) {
      var target;
      var $menu;

      if (event.key !== "ArrowDown") {
        return;
      }

      event.preventDefault();
      target = $(this).attr("data-action-menu");
      $menu = $("#" + target);

      if (!$menu.hasClass("is-open")) {
        $(this).trigger("click");
      }

      focusFirstMenuItem($menu);
    });

    $(document).on("click", ".action-menu__item", function () {
      var message = $(this).attr("data-feedback");

      if (message) {
        showToast(message);
      }

      closeFloatingMenus();
    });

    $(document).on("keydown", ".action-menu__item", handleMenuItemKeydown);
  }

  function bindSelectableRows() {
    $(document).on("change", ".js-row-check", function () {
      var $table = $(this).closest("table");

      $(this).closest("tr").toggleClass("is-selected", this.checked);
      updateCheckAllState($table);
    });

    $(document).on("change", ".js-check-all", function () {
      var checked = this.checked;
      var $table = $(this).closest("table");

      $table.find(".js-row-check").prop("checked", checked);
      $table.find(".js-row-check").closest("tr").toggleClass("is-selected", checked);
      updateCheckAllState($table);
    });

    $(document).on("click", ".js-recommendations-rows tr[data-client]", function (event) {
      var $checkbox;

      if ($(event.target).closest("button, a, input, .dropdown, .action-menu, [data-action-menu]").length) {
        return;
      }

      $checkbox = $(this).find(".js-row-check").first();
      $checkbox.prop("checked", !$checkbox.prop("checked")).trigger("change");
    });
  }

  function bindCopyFeedback() {
    $(document).on("click", "[data-copy]", function (event) {
      var value = $(this).attr("data-copy");

      event.preventDefault();
      event.stopPropagation();

      if (navigator.clipboard && value) {
        navigator.clipboard.writeText(value).catch(function () {});
      }

      markCopied($(this));
      showToast(formatTemplate(getGlobalMessage("copied", "Скопировано: {value}"), { value: value }));
    });
  }

  function bindGlobalShellActions() {
    $(document).on("click", ".topbar__burger", function (event) {
      var isOpen = !$("body").hasClass("is-sidebar-open");

      event.preventDefault();
      event.stopPropagation();
      setSidebarOpen(isOpen);
    });

    $(document).on("click", function (event) {
      if (!$("body").hasClass("is-sidebar-open")) {
        return;
      }

      if ($(event.target).closest(".sidebar, .topbar__burger").length) {
        return;
      }

      setSidebarOpen(false);
    });

    $(document).on("click", ".sidebar__link", function () {
      setSidebarOpen(false);
    });

    $(document).on("click", ".sidebar__help", function (event) {
      event.preventDefault();
      showToast(getGlobalMessage("helpOpened", "Инструкция открыта"));
    });

    $(document).on("click", ".topbar__date", function (event) {
      var $wrapper = $(this).closest(".topbar-period");
      var isOpen = !$wrapper.hasClass("is-open");

      event.preventDefault();
      event.stopPropagation();
      closeFloatingMenus();
      $wrapper.toggleClass("is-open", isOpen);
      $(this).attr("aria-expanded", isOpen ? "true" : "false");
      enhanceInteractiveSemantics($wrapper);
    });

    $(document).on("keydown", ".topbar__date", function (event) {
      var $wrapper;

      if (event.key !== "ArrowDown") {
        return;
      }

      event.preventDefault();
      $wrapper = $(this).closest(".topbar-period");

      if (!$wrapper.hasClass("is-open")) {
        $(this).trigger("click");
      }

      focusFirstMenuItem($wrapper.find(".topbar-period__menu"));
    });

    $(document).on("click", ".topbar-period__item", function (event) {
      var value = $(this).text().trim();
      var feedback = "";

      event.preventDefault();
      event.stopPropagation();

      getTopbarPeriodOptions().some(function (option) {
        if (option.label === value) {
          feedback = option.feedback || "";
          return true;
        }

        return false;
      });

      setData("period", value);

      $(".topbar__date").text(value);
      closeFloatingMenus();
      showToast(feedback || formatTemplate(getGlobalMessage("periodSelected", "Период: {value}"), {
        value: value
      }));
    });

    $(document).on("keydown", ".topbar-period__item", handleMenuItemKeydown);

    $(document).on("click", ".topbar .icon-button:not(.icon-button--menu)", function () {
      $(".js-updated-at").text(getGlobalMessage("updatedNow", "Обновлено: только что"));
      showButtonLoading($(this));
      showToast(getGlobalMessage("dataUpdated", "Данные обновлены"));
    });

    $(document).on("click", ".topbar .icon-button--menu", function () {
      if ($(this).closest(".settings-topbar").length) {
        return;
      }

      showToast(getGlobalMessage("extraActionsOpened", "Дополнительные действия открыты"));
    });

    $(document).on("click", ".tooltip__icon", function (event) {
      var $tooltip = $(this).closest(".tooltip");
      var isOpen = !$tooltip.hasClass("is-open");

      event.preventDefault();
      event.stopPropagation();
      $(".tooltip").not($tooltip).removeClass("is-open");
      $tooltip.toggleClass("is-open", isOpen);
      $(this).attr("aria-expanded", isOpen ? "true" : "false");
    });

    $(document).on("keydown", ".tooltip__icon", function (event) {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      $(this).trigger("click");
    });
  }

  function bindGlobalDismiss() {
    $(document).on("click", function (event) {
      if ($(event.target).closest(".dropdown, .action-menu, [data-action-menu], .tooltip, .topbar-period, .js-recommendations-filter, .js-recommendations-filter-panel, .js-coupons-filter, .js-coupons-filter-panel, .js-risk-filter, .js-risk-filter-panel").length) {
        return;
      }

      closeFloatingMenus();
    });

    $(document).on("keydown", function (event) {
      if (event.key === "Escape") {
        closeFloatingMenus();
        setSidebarOpen(false);
      }
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getDashboardData() {
    return getPageData("dashboard");
  }

  function getRecommendationsData() {
    return getPageData("recommendations");
  }

  function getCouponsData() {
    return getPageData("coupons");
  }

  function getRiskClientsData() {
    return getPageData("riskClients");
  }

  function getSettingsData() {
    return getPageData("settings");
  }

  // ---------------------------------------------------------------------------
  // Page render helpers
  // ---------------------------------------------------------------------------

  function renderTitle($title, title, tooltip) {
    if (!$title.length || !title) {
      return;
    }

    if (!tooltip) {
      $title.text(title);
      return;
    }

    $title.html(escapeHtml(title) +
      ' <span class="tooltip">' +
        '<span class="tooltip__icon" tabindex="0" role="button" aria-expanded="false">i</span>' +
        '<span class="tooltip__content">' + escapeHtml(tooltip) + "</span>" +
      "</span>");
  }

  function bindSharedUi() {
    enhanceInteractiveSemantics();
    bindGlobalShellActions();
    bindDropdowns();
    bindActionMenus();
    bindSelectableRows();
    bindCopyFeedback();
    bindGlobalDismiss();
  }

  App.activateCurrentNavigation = activateCurrentNavigation;
  App.hydrateStaticShell = hydrateStaticShell;
  App.closeFloatingMenus = closeFloatingMenus;
  App.showToast = showToast;
  App.showButtonLoading = showButtonLoading;
  App.updateCheckAllState = updateCheckAllState;
  App.escapeHtml = escapeHtml;
  App.getValue = getValue;
  App.formatTemplate = formatTemplate;
  App.getData = getData;
  App.setData = setData;
  App.getGlobalMessage = getGlobalMessage;
  App.renderTitle = renderTitle;
  App.getDashboardData = getDashboardData;
  App.getRecommendationsData = getRecommendationsData;
  App.getCouponsData = getCouponsData;
  App.getRiskClientsData = getRiskClientsData;
  App.getSettingsData = getSettingsData;
  App.bindSharedUi = bindSharedUi;

})(window.jQuery, window, document);
