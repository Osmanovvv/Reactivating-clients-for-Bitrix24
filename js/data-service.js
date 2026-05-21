(function (window) {
  "use strict";

  var App = window.ReactivationApp = window.ReactivationApp || {};

  function getSource() {
    return window.AppData || {};
  }

  function getPathParts(path) {
    return String(path || "").split(".").filter(Boolean);
  }

  function getValue(path, fallback) {
    var parts = getPathParts(path);
    var cursor = getSource();
    var index;

    if (!parts.length) {
      return cursor;
    }

    for (index = 0; index < parts.length; index += 1) {
      if (!cursor || cursor[parts[index]] === undefined || cursor[parts[index]] === null) {
        return fallback;
      }

      cursor = cursor[parts[index]];
    }

    return cursor;
  }

  function setValue(path, value) {
    var parts = getPathParts(path);
    var source = getSource();
    var cursor = source;
    var index;

    if (!parts.length) {
      window.AppData = value || {};
      return window.AppData;
    }

    if (!window.AppData) {
      window.AppData = source;
    }

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
    var aliases = {
      dashboard: "dashboard",
      recommendations: "recommendations",
      coupons: "coupons",
      risk: "riskClients",
      riskClients: "riskClients",
      settings: "settings"
    };

    return getValue(aliases[page] || page, null);
  }

  App.data = {
    getAll: getSource,
    get: getValue,
    set: setValue,
    getPageData: getPageData,
    replace: function (nextData) {
      window.AppData = nextData || {};
      return window.AppData;
    }
  };
})(window);
