(function ($, window, document) {
  "use strict";

  var App = window.ReactivationApp = window.ReactivationApp || {};

  // ---------------------------------------------------------------------------
  // Settings page
  // ---------------------------------------------------------------------------

  var closeFloatingMenus = App.closeFloatingMenus;
  var escapeHtml = App.escapeHtml;
  var getData = App.getData;
  var getSettingsData = App.getSettingsData;
  var showToast = App.showToast;
  var SETTINGS_STORAGE_KEY = "reactivationSettings";
  var SETTINGS_HISTORY_STATE_KEY = "reactivationSettings";
  var SETTINGS_WINDOW_NAME_PREFIX = "reactivationSettings:";
  var settingsState = {};

  function getSettingsDefaults() {
    var data = getSettingsData();

    return data && data.defaults ? data.defaults : {};
  }

  function getSettingsMessages() {
    var data = getSettingsData();

    return data && data.messages ? data.messages : {};
  }

  function getSettingsMessage(key, fallback) {
    var messages = getSettingsMessages();

    return messages[key] || fallback || "";
  }

  function getSettingsDefaultValue(key, fallback) {
    var defaults = getSettingsDefaults();

    return defaults[key] !== undefined && defaults[key] !== null ? defaults[key] : fallback;
  }

  function loadSavedSettingsValues() {
    var stored = null;

    try {
      if (window.localStorage) {
        stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      }
    } catch (error) {
      stored = null;
    }

    try {
      if (!stored && window.sessionStorage) {
        stored = window.sessionStorage.getItem(SETTINGS_STORAGE_KEY);
      }
    } catch (error) {
      stored = null;
    }

    try {
      if (!stored && window.history.state && window.history.state[SETTINGS_HISTORY_STATE_KEY]) {
        return $.extend({}, window.history.state[SETTINGS_HISTORY_STATE_KEY]);
      }
    } catch (error) {}

    try {
      if (!stored && typeof window.name === "string" && window.name.indexOf(SETTINGS_WINDOW_NAME_PREFIX) === 0) {
        stored = window.name.slice(SETTINGS_WINDOW_NAME_PREFIX.length);
      }
    } catch (error) {
      stored = null;
    }

    try {
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  function saveSettingsValues(values) {
    var stored = JSON.stringify(values);

    try {
      if (window.localStorage) {
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, stored);
      }
    } catch (error) {}

    try {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(SETTINGS_STORAGE_KEY, stored);
      }
    } catch (error) {}

    try {
      var currentState = window.history.state && typeof window.history.state === "object" ? window.history.state : {};
      var nextState = $.extend({}, currentState);

      nextState[SETTINGS_HISTORY_STATE_KEY] = $.extend({}, values);
      window.history.replaceState(nextState, "", window.location.href);
    } catch (error) {}

    try {
      window.name = SETTINGS_WINDOW_NAME_PREFIX + stored;
    } catch (error) {}
  }

  function clearSettingsValues() {
    try {
      if (window.localStorage) {
        window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
      }
    } catch (error) {}

    try {
      if (window.sessionStorage) {
        window.sessionStorage.removeItem(SETTINGS_STORAGE_KEY);
      }
    } catch (error) {}

    try {
      var currentState = window.history.state && typeof window.history.state === "object" ? window.history.state : {};
      var nextState = $.extend({}, currentState);

      delete nextState[SETTINGS_HISTORY_STATE_KEY];
      window.history.replaceState(nextState, "", window.location.href);
    } catch (error) {}

    try {
      window.name = "";
    } catch (error) {}
  }

  function getInitialSettingsValues() {
    return $.extend({}, getSettingsDefaults(), loadSavedSettingsValues() || {});
  }

  function getSettingsNumber(value, fallback) {
    var parsed = Number(value);

    return Number.isNaN(parsed) ? fallback : parsed;
  }

  function renderSettingsManagerOptions(managers) {
    var options = (managers || []).map(function (manager) {
      return '<button class="dropdown__item" type="button">' + escapeHtml(manager) + "</button>";
    }).join("");

    $(".js-settings-manager-menu").html(options);
  }

  function syncSettingsRadioCards() {
    $(".settings-radio-grid").each(function () {
      $(this).find(".settings-radio-card").each(function () {
        var $card = $(this);
        var isChecked = $card.find("input[type='radio']").prop("checked");

        $card.toggleClass("is-selected", isChecked);
        $card.attr("aria-checked", isChecked ? "true" : "false");
      });
    });
  }

  function applySettingsValues(values) {
    values = values || {};

    $('[data-setting="minOrders"]').val(getSettingsNumber(values.minOrders, 0));
    $('[data-setting="minClientAmount"]').val(getSettingsNumber(values.minClientAmount, 0));
    $('[data-setting="maxDiscount"]').val(getSettingsNumber(values.maxDiscount, 0));
    $('[data-setting="cooldownDays"]').val(getSettingsNumber(values.cooldownDays, 0));
    $('[data-setting="couponsEnabled"]').prop("checked", Boolean(values.couponsEnabled));
    $('[data-setting="excludeRecentOrder"]').prop("checked", Boolean(values.excludeRecentOrder));
    $('[data-setting="excludeVip"]').prop("checked", Boolean(values.excludeVip));
    $('[name="aggression"][value="' + escapeHtml(values.aggression || getSettingsDefaultValue("aggression", "")) + '"]').prop("checked", true);
    $('[name="discount-type"][value="' + escapeHtml(values.discountType || getSettingsDefaultValue("discountType", "")) + '"]').prop("checked", true);
    $(".js-settings-manager-label").text(values.fallbackManager || getSettingsDefaultValue("fallbackManager", ""));

    settingsState = getSettingsValues();
    syncSettingsRadioCards();
  }

  function getSettingsValues() {
    return {
      minOrders: getSettingsNumber($('[data-setting="minOrders"]').val(), 0),
      minClientAmount: getSettingsNumber($('[data-setting="minClientAmount"]').val(), 0),
      aggression: $('[name="aggression"]:checked').val() || getSettingsDefaultValue("aggression", ""),
      couponsEnabled: $('[data-setting="couponsEnabled"]').prop("checked"),
      maxDiscount: getSettingsNumber($('[data-setting="maxDiscount"]').val(), 0),
      discountType: $('[name="discount-type"]:checked').val() || getSettingsDefaultValue("discountType", ""),
      fallbackManager: $(".js-settings-manager-label").text().trim() || getSettingsDefaultValue("fallbackManager", ""),
      cooldownDays: getSettingsNumber($('[data-setting="cooldownDays"]').val(), 0),
      excludeRecentOrder: $('[data-setting="excludeRecentOrder"]').prop("checked"),
      excludeVip: $('[data-setting="excludeVip"]').prop("checked")
    };
  }

  function updateSettingsConnection(data) {
    if (!data || !data.connection) {
      return;
    }

    $(".settings-connection strong").text(data.connection.status || "");
    $(".settings-connection > span").last().text("(" + (data.connection.domain || "") + ")");
  }

  function renderSettingsPageData() {
    var data = getSettingsData();

    if (!data || document.body.getAttribute("data-page") !== "settings") {
      return;
    }

    updateSettingsConnection(data);
    renderSettingsManagerOptions(data.managers || getData("managers", []));
    applySettingsValues(getInitialSettingsValues());
  }

  function flashButton($button, text) {
    var original = $button.text();

    $button.text(text);
    window.setTimeout(function () {
      $button.text(original);
    }, 1200);
  }

  function bindSettingsActions() {
    $(document).on("input change", "[data-setting], [name='aggression'], [name='discount-type']", function () {
      settingsState = getSettingsValues();
      saveSettingsValues(settingsState);
    });

    $(document).on("click", ".settings-manager-dropdown .dropdown__item", function () {
      var manager = $(this).text().trim();

      $(".js-settings-manager-label").text(manager);
      settingsState = getSettingsValues();
      saveSettingsValues(settingsState);
      showToast((getSettingsMessage("managerSelected", "Fallback-менеджер выбран")) + ": " + manager);
    });

    $(document).on("click", ".js-settings-check-connection", function () {
      var data = getSettingsData();
      var message = data && data.connection && data.connection.checkMessage ?
        data.connection.checkMessage : "";

      showToast(message);
    });

    $(document).on("click", ".js-settings-save", function () {
      settingsState = getSettingsValues();
      saveSettingsValues(settingsState);
      showToast(getSettingsMessage("saved", "Настройки сохранены"));
      flashButton($(this), getSettingsMessage("savedButton", "Сохранено"));
    });

    $(document).on("click", ".js-settings-reset", function () {
      applySettingsValues(getSettingsDefaults());
      saveSettingsValues(settingsState);
      closeFloatingMenus();
      showToast(getSettingsMessage("reset", "Настройки сброшены"));
    });

    $(document).on("click", ".settings-help-button", function () {
      showToast(getSettingsMessage("helpOpened", "Справка по настройкам открыта"));
    });

    $(document).on("click", ".settings-topbar .icon-button--menu", function () {
      showToast(getSettingsMessage("extraActions", "Дополнительные действия настроек"));
    });
  }

  function bindSettingsSteppers() {
    $(".settings-stepper").each(function () {
      var $stepper = $(this);
      var $input = $stepper.find("input[type='number']").first();
      var step = Number($input.attr("step")) || 1;
      var min = $input.attr("min") === undefined ? -Infinity : Number($input.attr("min"));
      var max = $input.attr("max") === undefined ? Infinity : Number($input.attr("max"));

      function changeValue(direction) {
        var current = Number($input.val());
        if (Number.isNaN(current)) {
          current = 0;
        }

        var next = current + direction * step;
        next = Math.min(max, Math.max(min, next));
        $input.val(next).trigger("input").trigger("change");
      }

      $stepper.find(".settings-stepper__button--up").on("click", function () {
        changeValue(1);
      });

      $stepper.find(".settings-stepper__button--down").on("click", function () {
        changeValue(-1);
      });
    });
  }

  function bindSettingsRadioCards() {
    $(".settings-radio-grid").each(function () {
      var $group = $(this);

      function syncCards() {
        $group.find(".settings-radio-card").each(function () {
          var $card = $(this);
          var isChecked = $card.find("input[type='radio']").prop("checked");
          $card.toggleClass("is-selected", isChecked);
          $card.attr("aria-checked", isChecked ? "true" : "false");
        });
      }

      syncCards();

      $group.on("click", ".settings-radio-card", function () {
        var $input = $(this).find("input[type='radio']").first();
        $input.prop("checked", true).trigger("change");
      });

      $group.on("change", "input[type='radio']", syncCards);
    });
  }

  // ---------------------------------------------------------------------------
  // Public module wiring
  // ---------------------------------------------------------------------------

  function bindSettingsUi() {
    bindSettingsSteppers();
    bindSettingsRadioCards();
    bindSettingsActions();
  }

  App.settings = {
    bind: bindSettingsUi,
    render: renderSettingsPageData
  };

})(window.jQuery, window, document);
