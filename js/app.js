(function ($, window, document) {
  "use strict";

  var App = window.ReactivationApp || {};

  function run(module, method) {
    if (module && typeof module[method] === "function") {
      module[method]();
    }
  }

  $(function () {
    App.activateCurrentNavigation();
    App.hydrateStaticShell();

    run(App.dashboard, "render");
    run(App.recommendations, "render");
    run(App.coupons, "render");
    run(App.riskClients, "render");
    run(App.settings, "render");

    App.bindSharedUi();
    run(App.dashboard, "bind");
    run(App.recommendations, "bind");
    run(App.coupons, "bind");
    run(App.riskClients, "bind");
    run(App.settings, "bind");

    run(App.dashboard, "renderCharts");
    run(App.riskClients, "renderCharts");
  });
})(window.jQuery, window, document);
