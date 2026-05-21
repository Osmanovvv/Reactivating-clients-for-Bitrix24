window.AppData = {
  appName: "Реактивация клиентов",
  appSubtitle: "для Bitrix24",
  period: "01.05.2024 – 31.05.2024",
  updatedAt: "Обновлено: 5 мин. назад",
  periodOptions: [
    { label: "01.05.2024 – 31.05.2024", feedback: "Период выбран: 01.05.2024 – 31.05.2024" },
    { label: "01.04.2024 – 30.04.2024", feedback: "Период выбран: 01.04.2024 – 30.04.2024" },
    { label: "01.03.2024 – 31.03.2024", feedback: "Период выбран: 01.03.2024 – 31.03.2024" }
  ],
  ui: {
    messages: {
      copied: "Скопировано: {value}",
      helpOpened: "Инструкция открыта",
      periodSelected: "Период: {value}",
      dataUpdated: "Данные обновлены",
      updatedNow: "Обновлено: только что",
      extraActionsOpened: "Дополнительные действия открыты"
    }
  },
  managers: [
    "Иван Петров",
    "Мария Сидорова",
    "Алексей Кузнецов",
    "Екатерина Волкова"
  ],
  statuses: [
    "Создан",
    "Отправлен",
    "Использован",
    "Просрочен"
  ],
  risks: [
    "Низкий",
    "Средний",
    "Критический"
  ],
  segments: [
    "VIP",
    "Retail",
    "B2B",
    "Новые клиенты"
  ],
  periods: [
    "7 дней",
    "30 дней",
    "60 дней",
    "90 дней"
  ],
  settings: {
    connection: {
      status: "Активно",
      domain: "crm.domain.bitrix24.ru",
      checkMessage: "Подключение активно"
    },
    defaults: {
      minOrders: 3,
      minClientAmount: 0,
      aggression: "normal",
      couponsEnabled: true,
      maxDiscount: 10,
      discountType: "fixed",
      fallbackManager: "Иван Петров",
      cooldownDays: 30,
      excludeRecentOrder: true,
      excludeVip: true
    },
    managers: [
      "Иван Петров",
      "Мария Сидорова",
      "Алексей Кузнецов",
      "Екатерина Волкова"
    ],
    messages: {
      saved: "Настройки сохранены",
      savedButton: "Сохранено",
      reset: "Настройки сброшены к значениям по умолчанию",
      managerSelected: "Fallback-менеджер выбран",
      helpOpened: "Справка по настройкам открыта",
      extraActions: "Дополнительные действия настроек"
    }
  },
  dashboard: {
    kpis: [
      {
        label: "Возвращённая выручка",
        value: "€12,480",
        delta: "+18% к прошлому месяцу",
        icon: "assets/icons/kpi-revenue-bag.svg"
      },
      {
        label: "Реактивировано клиентов",
        value: "84",
        delta: "+16% к прошлому месяцу",
        icon: "assets/icons/kpi-clients.svg"
      },
      {
        label: "Выдано рекомендаций",
        value: "312",
        delta: "+12% к прошлому месяцу",
        icon: "assets/icons/kpi-coupon.svg"
      },
      {
        label: "Клиентов в зоне риска",
        value: "57",
        delta: "−3% к прошлому месяцу",
        icon: "assets/icons/kpi-warning.svg"
      }
    ],
    revenue: {
      title: "1. Возвращённая выручка",
      tooltip: "Динамика возвращённой выручки за выбранный период.",
      total: "€12,480",
      delta: "+18%",
      deltaText: "к прошлому месяцу",
      seriesName: "Возвращённая выручка",
      xAxisDaySuffix: " мая",
      periodOptions: ["По дням", "По неделям", "По месяцам"],
      seriesByPeriod: {
        "По неделям": [
          1500, 1800, 2100, 2300, 2600, 3000, 3600, 4100,
          4800, 5200, 5900, 6300, 6800, 7200, 7600, 8100,
          8500, 9000, 9500, 9900, 10300, 10800, 11200, 11600,
          12000, 12300, 12600, 12850, 13100, 13400, 13800
        ],
        "По месяцам": [
          1200, 1500, 1900, 2200, 2600, 3100, 3500, 3900,
          4400, 4800, 5200, 5600, 6000, 6400, 6800, 7200,
          7600, 8000, 8400, 8800, 9200, 9600, 10000, 10400,
          10800, 11200, 11600, 12000, 12400, 12900, 13650
        ]
      },
      series: [
        1600, 1900, 2200, 2300, 2500, 3100, 4200, 3600,
        4700, 5600, 6200, 6000, 6700, 7400, 7100, 8000,
        7700, 8500, 9100, 8800, 9600, 10100, 10700, 10900,
        10400, 11800, 12100, 12350, 12500, 12650, 13650
      ]
    },
    clients: {
      title: "2. Реактивировано клиентов",
      total: "84",
      unit: "клиента",
      segments: [
        { label: "Soft", count: 32, value: "32 (38%)", type: "success", color: "#3ebf7c" },
        { label: "Medium", count: 38, value: "38 (45%)", type: "warning", color: "#ffc11b" },
        { label: "Critical", count: 14, value: "14 (17%)", type: "danger", color: "#ff4b42" }
      ]
    },
    funnel: {
      title: "3. Конверсия по этапам",
      stats: [
        { label: "Soft", value: "18%" },
        { label: "Medium", value: "31%" },
        { label: "Critical", value: "22%" }
      ]
    },
    discounts: {
      title: "4. Эффективность скидок",
      tooltip: "Сравнение скидок по конверсии, использованию и возвращённой выручке.",
      rows: [
        { discount: "5%", conversion: "28%", progress: 28, bar: "success", uses: "148", revenue: "€5,240" },
        { discount: "10%", conversion: "29%", progress: 29, bar: "blue", uses: "96", revenue: "€4,860" },
        { discount: "15%", conversion: "30%", progress: 30, bar: "primary", uses: "68", revenue: "€4,120" }
      ],
      insight: {
        title: "Вывод: скидка 15% почти не эффективнее 5%.",
        text: "Рекомендуем использовать меньшие скидки для экономии бюджета."
      }
    },
    risk: {
      title: "5. Клиенты в зоне риска",
      tooltip: "Клиенты, у которых цикл заказа заметно отклоняется от привычного.",
      openButton: "Открыть в CRM",
      footerButton: "Показать всех (57)",
      openFeedback: "CRM откроется после подключения Bitrix24",
      footerFeedback: "Полный список клиентов будет доступен на странице клиентов в зоне риска",
      headers: ["Клиент", "Этап", "Задержка от привычного цикла", "Последний заказ"],
      actions: ["Открыть карточку", "Создать задачу", "Отправить письмо"],
      rows: [
        {
          client: "Иванов И.П.",
          company: "ООО «Иванов и Партнёры»",
          stage: "Critical",
          badge: "critical",
          delay: "42%",
          progress: 42,
          progressBar: "danger",
          lastOrder: "15.03.2024"
        },
        {
          client: "Petrov LLC",
          company: "Petrov LLC",
          stage: "Critical",
          badge: "critical",
          delay: "38%",
          progress: 38,
          progressBar: "danger",
          lastOrder: "20.03.2024"
        },
        {
          client: "Smith Co.",
          company: "Smith & Partners",
          stage: "Medium",
          badge: "medium",
          delay: "25%",
          progress: 25,
          progressBar: "warning",
          lastOrder: "02.04.2024"
        },
        {
          client: "ИП Сидоров А.А.",
          company: "ИП Сидоров",
          stage: "Medium",
          badge: "medium",
          delay: "22%",
          progress: 22,
          progressBar: "warning",
          lastOrder: "05.04.2024"
        },
        {
          client: "TechSolutions",
          company: "TechSolutions Ltd.",
          stage: "Soft",
          badge: "soft",
          delay: "18%",
          progress: 18,
          progressBar: "success",
          lastOrder: "10.04.2024"
        }
      ]
    }
  },
  recommendations: {
    kpis: [
      {
        label: "Всего рекомендаций",
        value: "57",
        meta: "на сумму €18,620"
      },
      {
        label: "Готовы к работе",
        value: "38",
        meta: "€12,430"
      },
      {
        label: "Кулдаун активен",
        value: "12",
        meta: "€3,210"
      },
      {
        label: "Исключены",
        value: "7",
        meta: "€2,980"
      }
    ],
    filters: {
      stages: ["Все этапы", "Критический", "Средний", "Мягкий"],
      managers: ["Все менеджеры", "Иван Петров", "Мария Сидорова", "Алексей Кузнецов", "Екатерина Волкова"]
    },
    ui: {
      filterPanelLabel: "Панель фильтров",
      filterTitle: "Фильтры",
      foundLabel: "Найдено",
      applyButton: "Применить",
      resetButton: "Сбросить",
      noFiltersText: "Фильтры не выбраны",
      emptyText: "Ничего не найдено",
      filterAppliedToast: "Фильтры применены: {total}",
      shownToast: "Показано рекомендаций: {total}",
      resetToast: "Фильтры сброшены",
      rowActionFeedback: "{action}: {client}",
      taskButton: "Создать задачу",
      taskCreatedToast: "Задача создана: {client}",
      mailButton: "Отправить письмо",
      mailSendNow: "Отправить сейчас",
      mailSchedule: "Запланировать",
      mailSentToast: "Письмо отправлено: {client}",
      mailScheduledToast: "Письмо запланировано: {client}",
      couponCodeLabel: "Код купона",
      rowActionsLabel: "Действия",
      nextPageLabel: "Следующая страница",
      selectRowLabel: "Выбрать {client}",
      filterSummaryLabels: {
        stage: "Этап",
        manager: "Менеджер",
        search: "Поиск"
      }
    },
    rows: [
      {
        client: "Иванов И.П.",
        company: "ООО «Иванов и Партнёры»",
        stage: "Критический",
        stageType: "critical",
        delay: "42%",
        delayText: "на 40 дней больше ожидаемого цикла",
        discount: "10%",
        discountType: "critical",
        coupon: "SAVE10-K2J9X",
        manager: "Иван Петров",
        managerRole: "менеджер",
        managerAvatar: "male"
      },
      {
        client: "Petrov LLC",
        company: "Petrov LLC",
        stage: "Критический",
        stageType: "critical",
        delay: "38%",
        delayText: "на 32 дня больше ожидаемого цикла",
        discount: "10%",
        discountType: "critical",
        coupon: "SAVE10-8D7F3",
        manager: "Мария Сидорова",
        managerRole: "менеджер",
        managerAvatar: "female"
      },
      {
        client: "Smith Co.",
        company: "Smith & Partners",
        stage: "Средний",
        stageType: "medium",
        delay: "25%",
        delayText: "на 18 дней больше ожидаемого цикла",
        discount: "5%",
        discountType: "medium",
        coupon: "SAVE5-A7H2K",
        manager: "Алексей Кузнецов",
        managerRole: "менеджер",
        managerAvatar: "male"
      },
      {
        client: "TechSolutions Ltd.",
        company: "TechSolutions Ltd.",
        stage: "Мягкий",
        stageType: "soft",
        delay: "16%",
        delayText: "на 9 дней больше ожидаемого цикла",
        discount: "5%",
        discountType: "soft",
        coupon: "SAVE5-P9L3M",
        manager: "Екатерина Волкова",
        managerRole: "менеджер",
        managerAvatar: "female"
      },
      {
        client: "ООО «СтройМаркет»",
        company: "ООО «СтройМаркет»",
        stage: "Критический",
        stageType: "critical",
        delay: "45%",
        delayText: "на 45 дней больше ожидаемого цикла",
        discount: "10%",
        discountType: "critical",
        coupon: "SAVE10-X1Z7Q",
        manager: "Иван Петров",
        managerRole: "менеджер",
        managerAvatar: "male"
      },
      {
        client: "Global Trade Inc.",
        company: "Global Trade Inc.",
        stage: "Средний",
        stageType: "medium",
        delay: "21%",
        delayText: "на 14 дней больше ожидаемого цикла",
        discount: "5%",
        discountType: "medium",
        coupon: "SAVE5-L8B2N",
        manager: "Мария Сидорова",
        managerRole: "менеджер",
        managerAvatar: "female"
      },
      {
        client: "Beta Logistics",
        company: "Beta Logistics LLC",
        stage: "Критический",
        stageType: "critical",
        delay: "36%",
        delayText: "на 29 дней больше ожидаемого цикла",
        discount: "10%",
        discountType: "critical",
        coupon: "SAVE10-B4T2L",
        manager: "Иван Петров",
        managerRole: "менеджер",
        managerAvatar: "male"
      },
      {
        client: "North Retail",
        company: "North Retail Group",
        stage: "Средний",
        stageType: "medium",
        delay: "23%",
        delayText: "на 16 дней больше ожидаемого цикла",
        discount: "5%",
        discountType: "medium",
        coupon: "SAVE5-N3R8Q",
        manager: "Екатерина Волкова",
        managerRole: "менеджер",
        managerAvatar: "female"
      },
      {
        client: "City Food",
        company: "City Food Market",
        stage: "Мягкий",
        stageType: "soft",
        delay: "14%",
        delayText: "на 8 дней больше ожидаемого цикла",
        discount: "5%",
        discountType: "soft",
        coupon: "SAVE5-C7F1D",
        manager: "Алексей Кузнецов",
        managerRole: "менеджер",
        managerAvatar: "male"
      },
      {
        client: "Prime Market",
        company: "Prime Market Ltd.",
        stage: "Критический",
        stageType: "critical",
        delay: "41%",
        delayText: "на 37 дней больше ожидаемого цикла",
        discount: "10%",
        discountType: "critical",
        coupon: "SAVE10-P6M4K",
        manager: "Мария Сидорова",
        managerRole: "менеджер",
        managerAvatar: "female"
      },
      {
        client: "Delta Service",
        company: "Delta Service",
        stage: "Средний",
        stageType: "medium",
        delay: "28%",
        delayText: "на 21 день больше ожидаемого цикла",
        discount: "5%",
        discountType: "medium",
        coupon: "SAVE5-D2S8V",
        manager: "Иван Петров",
        managerRole: "менеджер",
        managerAvatar: "male"
      },
      {
        client: "Orion Parts",
        company: "Orion Parts Co.",
        stage: "Мягкий",
        stageType: "soft",
        delay: "17%",
        delayText: "на 10 дней больше ожидаемого цикла",
        discount: "5%",
        discountType: "soft",
        coupon: "SAVE5-O9P2R",
        manager: "Алексей Кузнецов",
        managerRole: "менеджер",
        managerAvatar: "male"
      },
      {
        client: "Smart Office",
        company: "Smart Office LLC",
        stage: "Критический",
        stageType: "critical",
        delay: "39%",
        delayText: "на 34 дня больше ожидаемого цикла",
        discount: "10%",
        discountType: "critical",
        coupon: "SAVE10-S5O7F",
        manager: "Екатерина Волкова",
        managerRole: "менеджер",
        managerAvatar: "female"
      },
      {
        client: "Vega Trade",
        company: "Vega Trade Inc.",
        stage: "Средний",
        stageType: "medium",
        delay: "24%",
        delayText: "на 17 дней больше ожидаемого цикла",
        discount: "5%",
        discountType: "medium",
        coupon: "SAVE5-V4G6T",
        manager: "Мария Сидорова",
        managerRole: "менеджер",
        managerAvatar: "female"
      },
      {
        client: "Fresh Line",
        company: "Fresh Line",
        stage: "Мягкий",
        stageType: "soft",
        delay: "15%",
        delayText: "на 8 дней больше ожидаемого цикла",
        discount: "5%",
        discountType: "soft",
        coupon: "SAVE5-F2L5N",
        manager: "Иван Петров",
        managerRole: "менеджер",
        managerAvatar: "male"
      },
      {
        client: "TechnoPro",
        company: "TechnoPro Systems",
        stage: "Критический",
        stageType: "critical",
        delay: "43%",
        delayText: "на 42 дня больше ожидаемого цикла",
        discount: "10%",
        discountType: "critical",
        coupon: "SAVE10-T8P1R",
        manager: "Алексей Кузнецов",
        managerRole: "менеджер",
        managerAvatar: "male"
      },
      {
        client: "ООО «АльфаСнаб»",
        company: "ООО «АльфаСнаб»",
        stage: "Средний",
        stageType: "medium",
        delay: "22%",
        delayText: "на 15 дней больше ожидаемого цикла",
        discount: "5%",
        discountType: "medium",
        coupon: "SAVE5-A1S9B",
        manager: "Екатерина Волкова",
        managerRole: "менеджер",
        managerAvatar: "female"
      },
      {
        client: "Market Plus",
        company: "Market Plus",
        stage: "Мягкий",
        stageType: "soft",
        delay: "18%",
        delayText: "на 11 дней больше ожидаемого цикла",
        discount: "5%",
        discountType: "soft",
        coupon: "SAVE5-M6P3S",
        manager: "Мария Сидорова",
        managerRole: "менеджер",
        managerAvatar: "female"
      }
    ],
    actions: ["Открыть карточку", "Создать задачу", "Отправить письмо"],
    pagination: {
      perPage: "20",
      pageSizes: [20, 40, 60],
      visibleRows: 6,
      total: 57
    }
  },
  riskClients: {
    kpis: [
      {
        label: "Всего в зоне риска",
        value: "57",
        delta: "−3% к прошлому месяцу"
      },
      {
        label: "Критический риск",
        value: "14",
        delta: "−1% к прошлому месяцу"
      },
      {
        label: "Средний риск",
        value: "31",
        delta: "+5% к прошлому месяцу"
      },
      {
        label: "Потенциальные потери",
        value: "€18,420",
        delta: "+12% к прошлому месяцу"
      }
    ],
    filters: {
      risks: ["Уровень риска: Все", "Критический", "Средний", "Низкий"],
      managers: ["Менеджер: Все", "Иван Петров", "Мария Сидорова", "Алексей Кузнецов", "Екатерина Волкова"],
      periods: ["Период: 30 дней", "Период: 60 дней", "Период: 90 дней"],
      segments: ["Сегмент: Все", "B2B", "Retail", "VIP", "Новые клиенты"]
    },
    ui: {
      shownToast: "Показано клиентов: {total}",
      resetToast: "Фильтры сброшены",
      actionCompleteToast: "Действие выполнено",
      tasksCreatedToast: "Создано задач: {count}",
      emptyText: "Ничего не найдено",
      noFiltersText: "Фильтры не выбраны",
      rowActionFeedback: "{action}: {client}",
      filterSummaryLabels: {
        risk: "Риск",
        search: "Поиск"
      },
      actionLabels: {
        coupon: "Купон",
        mail: "Письмо",
        phone: "Звонок",
        view: "Просмотр",
        menu: "Меню"
      },
      actionFeedback: {
        couponPrepared: "Купон подготовлен: {client}",
        mailPrepared: "Письмо подготовлено: {client}",
        callScheduled: "Звонок запланирован: {client}",
        cardOpened: "Карточка открыта: {client}"
      },
      nextPageLabel: "Следующая страница",
      charts: {
        timeSeriesName: "Риск",
        lowSeriesName: "Низкий",
        mediumSeriesName: "Средний",
        lossSeriesName: "Потери",
        percentSuffix: "%",
        euroPrefix: "€",
        thousandSuffix: "k"
      }
    },
    rows: [
      {
        client: "Иванов И.П.",
        company: "ООО «Иванов и Партнёры»",
        risk: "Критический",
        riskType: "critical",
        delay: "42%",
        progress: 78,
        expectedCycle: "30 дней",
        factDays: "42",
        loss: "€1,200",
        action: "Срочный купон",
        actionType: "urgent",
        manager: "Иван Петров",
        segment: "B2B",
        periodDays: 42
      },
      {
        client: "Petrov LLC",
        company: "Petrov LLC",
        risk: "Критический",
        riskType: "critical",
        delay: "38%",
        progress: 68,
        expectedCycle: "25 дней",
        factDays: "34",
        loss: "€3,400",
        action: "Задача менеджеру",
        actionType: "task",
        manager: "Мария Сидорова",
        segment: "Retail",
        periodDays: 34
      },
      {
        client: "ООО «СтройМаркет»",
        company: "ООО «СтройМаркет»",
        risk: "Критический",
        riskType: "critical",
        delay: "37%",
        progress: 66,
        expectedCycle: "28 дней",
        factDays: "38",
        loss: "€2,800",
        action: "Срочный купон",
        actionType: "urgent",
        manager: "Иван Петров",
        segment: "B2B",
        periodDays: 38
      },
      {
        client: "Smith Co.",
        company: "Smith & Partners",
        risk: "Средний",
        riskType: "medium",
        delay: "25%",
        progress: 48,
        expectedCycle: "20 дней",
        factDays: "25",
        loss: "€800",
        action: "Напоминание",
        actionType: "remind",
        manager: "Алексей Кузнецов",
        segment: "VIP",
        periodDays: 25
      },
      {
        client: "ИП Сидоров А.А.",
        company: "ИП Сидоров",
        risk: "Средний",
        riskType: "medium",
        delay: "22%",
        progress: 42,
        expectedCycle: "18 дней",
        factDays: "22",
        loss: "€1,200",
        action: "Напоминание",
        actionType: "remind",
        manager: "Екатерина Волкова",
        segment: "Retail",
        periodDays: 22
      },
      {
        client: "TechSolutions Ltd.",
        company: "TechSolutions Ltd.",
        risk: "Низкий",
        riskType: "low",
        delay: "15%",
        progress: 33,
        expectedCycle: "14 дней",
        factDays: "16",
        loss: "€500",
        action: "Наблюдать",
        actionType: "watch",
        manager: "Екатерина Волкова",
        segment: "B2B",
        periodDays: 16
      },
      {
        client: "Global Trade Inc.",
        company: "Global Trade Inc.",
        risk: "Низкий",
        riskType: "low",
        delay: "12%",
        progress: 28,
        expectedCycle: "12 дней",
        factDays: "13",
        loss: "€300",
        action: "Наблюдать",
        actionType: "watch",
        manager: "Мария Сидорова",
        segment: "VIP",
        periodDays: 13
      },
      {
        client: "Beta Logistics",
        company: "Beta Logistics LLC",
        risk: "Критический",
        riskType: "critical",
        delay: "36%",
        progress: 64,
        expectedCycle: "31 день",
        factDays: "42",
        loss: "€2,100",
        action: "Срочный купон",
        actionType: "urgent",
        manager: "Иван Петров",
        segment: "B2B",
        periodDays: 42
      },
      {
        client: "North Retail",
        company: "North Retail Group",
        risk: "Средний",
        riskType: "medium",
        delay: "23%",
        progress: 44,
        expectedCycle: "33 дня",
        factDays: "41",
        loss: "€900",
        action: "Напоминание",
        actionType: "remind",
        manager: "Екатерина Волкова",
        segment: "Retail",
        periodDays: 41
      },
      {
        client: "City Food",
        company: "City Food Market",
        risk: "Низкий",
        riskType: "low",
        delay: "14%",
        progress: 31,
        expectedCycle: "35 дней",
        factDays: "40",
        loss: "€420",
        action: "Наблюдать",
        actionType: "watch",
        manager: "Алексей Кузнецов",
        segment: "Новые клиенты",
        periodDays: 40
      },
      {
        client: "Prime Market",
        company: "Prime Market Ltd.",
        risk: "Критический",
        riskType: "critical",
        delay: "41%",
        progress: 74,
        expectedCycle: "29 дней",
        factDays: "41",
        loss: "€1,600",
        action: "Срочный купон",
        actionType: "urgent",
        manager: "Мария Сидорова",
        segment: "Retail",
        periodDays: 41
      },
      {
        client: "Delta Service",
        company: "Delta Service",
        risk: "Средний",
        riskType: "medium",
        delay: "28%",
        progress: 52,
        expectedCycle: "32 дня",
        factDays: "41",
        loss: "€760",
        action: "Напоминание",
        actionType: "remind",
        manager: "Иван Петров",
        segment: "B2B",
        periodDays: 41
      }
    ],
    actions: ["Открыть карточку", "Создать задачу", "Отправить письмо", "Исключить из риска"],
    pagination: {
      perPage: 20,
      pageSizes: [20, 40, 60],
      visibleRows: 7,
      total: 57
    },
    info: {
      title: "Как считается риск?",
      tooltip: "Правила расчёта риска",
      lead: "Риск рассчитывается автоматически на основе:",
      items: [
        "Сравнения текущего интервала покупок",
        "с историческим циклом клиента",
        "чем реже клиент покупает — тем выше риск"
      ],
      legend: [
        { type: "critical", label: "Критический риск", value: "35% и выше" },
        { type: "medium", label: "Средний риск", value: "20% – 35%" },
        { type: "low", label: "Низкий риск", value: "ниже 20%" }
      ]
    },
    summary: {
      critical: { title: "Сегодня в зоне критического риска", count: "14", countLabel: "клиентов", loss: "€7,400", lossLabel: "потенциальные потери" },
      actions: { title: "Рекомендуемые действия", count: "8", text: "задач можно создать<br>в один клик", button: "Создать задачи" },
      efficiency: { title: "Эффективность реактивации", value: "68%", text: "успешных реактиваций<br>в этом месяце" }
    },
    charts: {
      time: {
        title: "Риск по времени",
        period: "60 дней",
        badge: "57%",
        labels: ["1 мая", "11 мая", "21 мая", "31 мая"],
        periodOptions: [
          {
            period: "30 дней",
            badge: "49%",
            labels: ["1 мая", "11 мая", "21 мая", "31 мая"],
            series: [18, 22, 20, 27, 31, 34, 39, 45, 42, 48, 44, 52, 49, 55, 51, 58, 56, 61, 64]
          },
          {
            period: "60 дней",
            badge: "57%",
            labels: ["1 мая", "11 мая", "21 мая", "31 мая"],
            series: [25, 30, 25, 34, 42, 41, 46, 58, 55, 61, 57, 70, 65, 70, 63, 73, 70, 78, 85]
          },
          {
            period: "90 дней",
            badge: "64%",
            labels: ["1 мая", "11 мая", "21 мая", "31 мая"],
            series: [32, 35, 31, 40, 46, 45, 52, 61, 60, 68, 64, 75, 70, 78, 74, 82, 80, 88, 92]
          }
        ],
        series: [25, 30, 25, 34, 42, 41, 46, 58, 55, 61, 57, 70, 65, 70, 63, 73, 70, 78, 85]
      },
      loss: {
        title: "Потенциальные потери",
        total: "€18,420",
        delta: "+12% к прошлому месяцу",
        labels: ["1 мая", "11 мая", "21 мая", "31 мая"],
        series: [8, 18, 14, 10, 17, 15, 16, 7, 13, 15, 14, 6, 9, 16, 20, 15]
      }
    }
  },
  coupons: {
    kpis: [
      {
        label: "Всего купонов",
        value: "312",
        delta: "+16% к прошлому месяцу"
      },
      {
        label: "Активных",
        value: "48",
        delta: "+8% к прошлому месяцу"
      },
      {
        label: "Использовано",
        value: "126",
        delta: "+24% к прошлому месяцу"
      },
      {
        label: "Выручка по купонам",
        value: "€8,420",
        delta: "+18% к прошлому месяцу"
      }
    ],
    filters: {
      statuses: ["Статус: Все", "Отправлен", "Использован", "Создан", "Просрочен"],
      stages: ["Этап: Все", "Критический", "Средний", "Низкий"],
      managers: ["Менеджер: Все", "Иван Петров", "Мария Сидорова", "Алексей Кузнецов", "Екатерина Волкова"],
      periods: [
        { label: "Период: 01.05 – 31.05", from: "2024-05-01", to: "2024-05-31" },
        { label: "Период: 01.05 – 10.05", from: "2024-05-01", to: "2024-05-10" },
        { label: "Период: 11.05 – 20.05", from: "2024-05-11", to: "2024-05-20" },
        { label: "Период: 21.05 – 31.05", from: "2024-05-21", to: "2024-05-31" }
      ]
    },
    ui: {
      shownToast: "Показано купонов: {total}",
      resetToast: "Фильтры сброшены",
      actionCompleteToast: "Действие выполнено",
      detailClosedToast: "Детали купона закрыты",
      exportReadyToast: "Отчёт подготовлен к экспорту",
      emptyText: "Ничего не найдено",
      noFiltersText: "Фильтры не выбраны",
      managerRole: "менеджер",
      copyCouponLabel: "Скопировать {coupon}",
      historyTitle: "История:",
      detailLabels: {
        delayCycle: "Задержка цикла",
        expectedCycle: "Ожидаемый цикл",
        actualCycle: "Фактический цикл"
      },
      actionFeedback: {
        send: "Купон отправлен: {client}",
        task: "Задача создана: {client}",
        report: "Открыт отчёт: {client}",
        exclude: "Купон исключён: {client}"
      },
      historyDefaults: {
        created: "Создан",
        sent: "Отправлен",
        used: "Использован",
        emptyTime: "–",
        createdTime: "{date} 10:30",
        sentTime: "{date} 11:15",
        usedTime: "{date} 16:40"
      },
      filterSummaryLabels: {
        status: "Статус",
        stage: "Этап",
        manager: "Менеджер",
        search: "Поиск"
      },
      nextPageLabel: "Следующая страница"
    },
    rows: [
      {
        client: "Иванов И.П.",
        company: "ООО «Иванов и Партнёры»",
        stage: "Критический",
        stageType: "critical",
        discount: "10%",
        coupon: "SAVE10-K2J9X",
        status: "Отправлен",
        statusType: "sent",
        manager: "Иван Петров",
        managerAvatar: "male",
        date: "15.05.2024",
        dateISO: "2024-05-15",
        delay: "42%",
        expectedCycle: "30 дней",
        actualCycle: "42 дня",
        history: [
          { type: "created", label: "Создан", time: "10.05.2024 10:30" },
          { type: "sent", label: "Отправлен", time: "10.05.2024 11:15" },
          { type: "used", label: "Использован", time: "–" }
        ]
      },
      {
        client: "Petrov LLC",
        company: "Petrov LLC",
        stage: "Средний",
        stageType: "medium",
        discount: "5%",
        coupon: "SAVE5-8D7F3",
        status: "Использован",
        statusType: "used",
        manager: "Мария Сидорова",
        managerAvatar: "female",
        date: "14.05.2024",
        dateISO: "2024-05-14",
        delay: "38%",
        expectedCycle: "28 дней",
        actualCycle: "39 дней"
      },
      {
        client: "Smith Co.",
        company: "Smith & Partners",
        stage: "Средний",
        stageType: "medium",
        discount: "5%",
        coupon: "SAVE5-AH2K9",
        status: "Создан",
        statusType: "created",
        manager: "Алексей Кузнецов",
        managerAvatar: "male",
        date: "13.05.2024",
        dateISO: "2024-05-13",
        delay: "25%",
        expectedCycle: "32 дня",
        actualCycle: "40 дней"
      },
      {
        client: "TechSolutions Ltd.",
        company: "TechSolutions Ltd.",
        stage: "Низкий",
        stageType: "low",
        discount: "5%",
        coupon: "SAVE5-P9L3M",
        status: "Создан",
        statusType: "created",
        manager: "Екатерина Волкова",
        managerAvatar: "female",
        date: "12.05.2024",
        dateISO: "2024-05-12",
        delay: "16%",
        expectedCycle: "35 дней",
        actualCycle: "41 день"
      },
      {
        client: "ООО «СтройМаркет»",
        company: "ООО «СтройМаркет»",
        stage: "Критический",
        stageType: "critical",
        discount: "15%",
        coupon: "SAVE15-X1Z7Q",
        status: "Просрочен",
        statusType: "expired",
        manager: "Иван Петров",
        managerAvatar: "male",
        date: "10.05.2024",
        dateISO: "2024-05-10",
        delay: "45%",
        expectedCycle: "30 дней",
        actualCycle: "44 дня"
      },
      {
        client: "Global Trade Inc.",
        company: "Global Trade Inc.",
        stage: "Средний",
        stageType: "medium",
        discount: "10%",
        coupon: "SAVE10-L8B2N",
        status: "Использован",
        statusType: "used",
        manager: "Мария Сидорова",
        managerAvatar: "female",
        date: "09.05.2024",
        dateISO: "2024-05-09",
        delay: "21%",
        expectedCycle: "36 дней",
        actualCycle: "44 дня"
      },
      {
        client: "ИП Сидоров А.А.",
        company: "ИП Сидоров",
        stage: "Низкий",
        stageType: "low",
        discount: "5%",
        coupon: "SAVE5-Q7N2K",
        status: "Отправлен",
        statusType: "sent",
        manager: "Алексей Кузнецов",
        managerAvatar: "male",
        date: "08.05.2024",
        dateISO: "2024-05-08",
        delay: "18%",
        expectedCycle: "34 дня",
        actualCycle: "40 дней"
      },
      {
        client: "Beta Logistics",
        company: "Beta Logistics LLC",
        stage: "Критический",
        stageType: "critical",
        discount: "10%",
        coupon: "SAVE10-B4T2L",
        status: "Отправлен",
        statusType: "sent",
        manager: "Иван Петров",
        managerAvatar: "male",
        date: "07.05.2024",
        dateISO: "2024-05-07",
        delay: "36%",
        expectedCycle: "31 день",
        actualCycle: "42 дня"
      },
      {
        client: "North Retail",
        company: "North Retail Group",
        stage: "Средний",
        stageType: "medium",
        discount: "5%",
        coupon: "SAVE5-N3R8Q",
        status: "Создан",
        statusType: "created",
        manager: "Екатерина Волкова",
        managerAvatar: "female",
        date: "06.05.2024",
        dateISO: "2024-05-06",
        delay: "23%",
        expectedCycle: "33 дня",
        actualCycle: "41 день"
      },
      {
        client: "City Food",
        company: "City Food Market",
        stage: "Низкий",
        stageType: "low",
        discount: "5%",
        coupon: "SAVE5-C7F1D",
        status: "Использован",
        statusType: "used",
        manager: "Алексей Кузнецов",
        managerAvatar: "male",
        date: "05.05.2024",
        dateISO: "2024-05-05",
        delay: "14%",
        expectedCycle: "35 дней",
        actualCycle: "40 дней"
      },
      {
        client: "Prime Market",
        company: "Prime Market Ltd.",
        stage: "Критический",
        stageType: "critical",
        discount: "10%",
        coupon: "SAVE10-P6M4K",
        status: "Просрочен",
        statusType: "expired",
        manager: "Мария Сидорова",
        managerAvatar: "female",
        date: "04.05.2024",
        dateISO: "2024-05-04",
        delay: "41%",
        expectedCycle: "29 дней",
        actualCycle: "41 день"
      },
      {
        client: "Delta Service",
        company: "Delta Service",
        stage: "Средний",
        stageType: "medium",
        discount: "5%",
        coupon: "SAVE5-D2S8V",
        status: "Создан",
        statusType: "created",
        manager: "Иван Петров",
        managerAvatar: "male",
        date: "03.05.2024",
        dateISO: "2024-05-03",
        delay: "28%",
        expectedCycle: "32 дня",
        actualCycle: "41 день"
      },
      {
        client: "Orion Parts",
        company: "Orion Parts Co.",
        stage: "Низкий",
        stageType: "low",
        discount: "5%",
        coupon: "SAVE5-O9P2R",
        status: "Отправлен",
        statusType: "sent",
        manager: "Алексей Кузнецов",
        managerAvatar: "male",
        date: "02.05.2024",
        dateISO: "2024-05-02",
        delay: "17%",
        expectedCycle: "30 дней",
        actualCycle: "35 дней"
      },
      {
        client: "Smart Office",
        company: "Smart Office LLC",
        stage: "Критический",
        stageType: "critical",
        discount: "10%",
        coupon: "SAVE10-S5O7F",
        status: "Отправлен",
        statusType: "sent",
        manager: "Екатерина Волкова",
        managerAvatar: "female",
        date: "01.05.2024",
        dateISO: "2024-05-01",
        delay: "39%",
        expectedCycle: "30 дней",
        actualCycle: "42 дня"
      },
      {
        client: "Vega Trade",
        company: "Vega Trade Inc.",
        stage: "Средний",
        stageType: "medium",
        discount: "5%",
        coupon: "SAVE5-V4G6T",
        status: "Использован",
        statusType: "used",
        manager: "Мария Сидорова",
        managerAvatar: "female",
        date: "22.05.2024",
        dateISO: "2024-05-22",
        delay: "24%",
        expectedCycle: "34 дня",
        actualCycle: "42 дня"
      },
      {
        client: "Fresh Line",
        company: "Fresh Line",
        stage: "Низкий",
        stageType: "low",
        discount: "5%",
        coupon: "SAVE5-F2L5N",
        status: "Создан",
        statusType: "created",
        manager: "Иван Петров",
        managerAvatar: "male",
        date: "24.05.2024",
        dateISO: "2024-05-24",
        delay: "15%",
        expectedCycle: "35 дней",
        actualCycle: "40 дней"
      },
      {
        client: "TechnoPro",
        company: "TechnoPro Systems",
        stage: "Критический",
        stageType: "critical",
        discount: "10%",
        coupon: "SAVE10-T8P1R",
        status: "Просрочен",
        statusType: "expired",
        manager: "Алексей Кузнецов",
        managerAvatar: "male",
        date: "26.05.2024",
        dateISO: "2024-05-26",
        delay: "43%",
        expectedCycle: "30 дней",
        actualCycle: "43 дня"
      },
      {
        client: "ООО «АльфаСнаб»",
        company: "ООО «АльфаСнаб»",
        stage: "Средний",
        stageType: "medium",
        discount: "5%",
        coupon: "SAVE5-A1S9B",
        status: "Отправлен",
        statusType: "sent",
        manager: "Екатерина Волкова",
        managerAvatar: "female",
        date: "28.05.2024",
        dateISO: "2024-05-28",
        delay: "22%",
        expectedCycle: "33 дня",
        actualCycle: "40 дней"
      },
      {
        client: "Market Plus",
        company: "Market Plus",
        stage: "Низкий",
        stageType: "low",
        discount: "5%",
        coupon: "SAVE5-M6P3S",
        status: "Использован",
        statusType: "used",
        manager: "Мария Сидорова",
        managerAvatar: "female",
        date: "30.05.2024",
        dateISO: "2024-05-30",
        delay: "18%",
        expectedCycle: "30 дней",
        actualCycle: "35 дней"
      }
    ],
    actions: ["Отправить купон", "Создать задачу", "Открыть отчёт", "Исключить"],
    pagination: {
      perPage: 20,
      pageSizes: [20, 40, 60],
      total: 312
    },
    efficiency: {
      title: "Эффективность купонов",
      caption: "Конверсия в покупку",
      rows: [
        { label: "5% скидки", value: "28%", type: "purple", width: 84 },
        { label: "10% скидки", value: "31%", type: "blue", width: 100 },
        { label: "15% скидки", value: "29%", type: "green", width: 88 }
      ]
    },
    summary: {
      conversion: { label: "Конверсия купонов", value: "29%", meta: "Купонов использовано" },
      discount: { label: "Средняя скидка", value: "8.2%", meta: "По всем купонам" },
      revenue: { label: "Выручка по купонам", value: "€8,420", meta: "За выбранный период" }
    }
  }
};
