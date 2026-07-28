(() => {
  "use strict";

  const DATA_URL = "generated/index.json";
  const VALUE_LABELS_URL = "i18n/value-labels.json";

  const copy = {
    zh: {
      navExplore: "探索 IP",
      navContribute: "贡献指南",
      navDocs: "项目文档",
      downloadJson: "下载 JSON",
      eyebrow: "开放、可追溯、面向工程评估",
      heroTitle: "开源芯片 IP，随时可供评估",
      heroCopy: "为 RISC-V SoC 工程师汇集来源、成熟度、许可证与集成信息。",
      searchLabel: "搜索 IP",
      searchPlaceholder: "搜索名称、UID、接口或功能族",
      statTotal: "IP 总数",
      statCategories: "分类数",
      statProven: "已流片验证",
      statCandidate: "候选条目",
      catalogKicker: "CATALOG",
      catalogTitle: "探索 IP 目录",
      refine: "REFINE",
      filters: "筛选",
      clearAll: "全部清除",
      resultUnit: "个 IP",
      sortBy: "排序",
      sortName: "名称",
      sortUid: "UID",
      sortFamily: "功能族",
      sortCategory: "分类",
      sortStatus: "状态",
      sortReview: "最后审核日期",
      ascending: "升序",
      descending: "降序",
      cards: "卡片",
      table: "表格",
      loading: "正在加载目录数据…",
      unknown: "未知",
      more: "项更多",
      noResultsTitle: "没有匹配的 IP",
      noResultsCopy: "调整搜索词或清除部分筛选条件后再试。",
      retry: "重试",
      errorTitle: "目录数据加载失败",
      errorCopy: "请检查网络连接或稍后重试。",
      reviewed: "审核",
      category: "分类",
      ipFamily: "功能族",
      interfaces: "接口",
      maturity: "成熟度",
      licenseRisk: "许可证风险",
      integrationDifficulty: "集成难度",
      dataQuality: "数据质量",
      name: "名称",
      license: "许可证",
      lastReviewed: "最后审核",
      basicInfo: "基本信息",
      technical: "技术能力",
      integration: "集成评估",
      verification: "验证与版本",
      legal: "法务信息",
      dataState: "数据状态",
      sourceLinks: "来源链接",
      summary: "摘要",
      uid: "UID",
      slug: "Slug",
      subcategories: "子分类",
      languages: "语言",
      busCompatibility: "总线兼容性",
      compatibility: "兼容性",
      features: "特性",
      implementationStyle: "实现形式",
      integrationProfile: "集成配置",
      resourceProfile: "资源特征",
      performanceProfile: "性能特征",
      bestFor: "适用场景",
      notRecommendedFor: "不建议用于",
      fpgaSupport: "FPGA 支持",
      asicSupport: "ASIC 支持",
      currentRef: "当前引用",
      currentRefType: "引用类型",
      commercialUse: "商业使用",
      status: "状态",
      documentationQuality: "文档质量",
      nextAction: "下一步行动",
      catalogRepository: "目录仓库",
      upstreamRepository: "上游仓库",
      homepage: "项目主页",
      documentation: "项目文档",
      yes: "是",
      no: "否",
      closeDetails: "关闭详情",
      closeFilters: "关闭筛选",
    },
    en: {
      navExplore: "Explore IP",
      navContribute: "Contribute",
      navDocs: "Documentation",
      downloadJson: "Download JSON",
      eyebrow: "Open, traceable, engineering-ready",
      heroTitle: "Open-source IP, ready to evaluate",
      heroCopy: "Source, maturity, licensing, and integration context for RISC-V SoC engineers.",
      searchLabel: "Search IP",
      searchPlaceholder: "Search name, UID, interface, or family",
      statTotal: "IP cores",
      statCategories: "Categories",
      statProven: "Silicon-proven",
      statCandidate: "Candidates",
      catalogKicker: "CATALOG",
      catalogTitle: "Explore the IP catalog",
      refine: "REFINE",
      filters: "Filters",
      clearAll: "Clear all",
      resultUnit: "IP cores",
      sortBy: "Sort by",
      sortName: "Name",
      sortUid: "UID",
      sortFamily: "Family",
      sortCategory: "Category",
      sortStatus: "Status",
      sortReview: "Last reviewed",
      ascending: "Ascending",
      descending: "Descending",
      cards: "Cards",
      table: "Table",
      loading: "Loading catalog data…",
      unknown: "Unknown",
      more: "more",
      noResultsTitle: "No matching IP",
      noResultsCopy: "Try a different search or clear some filters.",
      retry: "Retry",
      errorTitle: "Catalog data failed to load",
      errorCopy: "Check your connection and try again.",
      reviewed: "Reviewed",
      category: "Category",
      ipFamily: "IP family",
      interfaces: "Interfaces",
      maturity: "Maturity",
      licenseRisk: "License risk",
      integrationDifficulty: "Integration",
      dataQuality: "Data quality",
      name: "Name",
      license: "License",
      lastReviewed: "Last reviewed",
      basicInfo: "Basic information",
      technical: "Technical capabilities",
      integration: "Integration assessment",
      verification: "Verification & version",
      legal: "Legal",
      dataState: "Data status",
      sourceLinks: "Source links",
      summary: "Summary",
      uid: "UID",
      slug: "Slug",
      subcategories: "Subcategories",
      languages: "Languages",
      busCompatibility: "Bus compatibility",
      compatibility: "Compatibility",
      features: "Features",
      implementationStyle: "Implementation style",
      integrationProfile: "Integration profile",
      resourceProfile: "Resource profile",
      performanceProfile: "Performance profile",
      bestFor: "Best for",
      notRecommendedFor: "Not recommended for",
      fpgaSupport: "FPGA support",
      asicSupport: "ASIC support",
      currentRef: "Current ref",
      currentRefType: "Ref type",
      commercialUse: "Commercial use",
      status: "Status",
      documentationQuality: "Documentation quality",
      nextAction: "Next action",
      catalogRepository: "Catalog repository",
      upstreamRepository: "Upstream repository",
      homepage: "Homepage",
      documentation: "Documentation",
      yes: "Yes",
      no: "No",
      closeDetails: "Close details",
      closeFilters: "Close filters",
    },
  };

  const filterDefinitions = [
    { field: "category", label: "category" },
    { field: "ip_family", label: "ipFamily" },
    { field: "interfaces", label: "interfaces", array: true },
    { field: "maturity", label: "maturity" },
    { field: "license_risk", label: "licenseRisk" },
    { field: "integration_difficulty", label: "integrationDifficulty" },
    { field: "data_quality", label: "dataQuality" },
  ];

  const tableColumns = [
    { field: "display_name", label: "name" },
    { field: "uid", label: "uid" },
    { field: "category", label: "category" },
    { field: "interfaces", label: "interfaces" },
    { field: "maturity", label: "maturity" },
    { field: "license", label: "license" },
    { field: "license_risk", label: "licenseRisk" },
    { field: "integration_difficulty", label: "integrationDifficulty" },
    { field: "last_reviewed_at", label: "lastReviewed" },
  ];

  const els = {
    search: document.querySelector("#searchInput"),
    stats: {
      total: document.querySelector("#statTotal"),
      categories: document.querySelector("#statCategories"),
      proven: document.querySelector("#statProven"),
      candidate: document.querySelector("#statCandidate"),
    },
    resultCount: document.querySelector("#resultCount"),
    resultsContent: document.querySelector("#resultsContent"),
    filterGroups: document.querySelector("#filterGroups"),
    activeFilters: document.querySelector("#activeFilters"),
    clearFilters: document.querySelector("#clearFilters"),
    sort: document.querySelector("#sortSelect"),
    sortDirection: document.querySelector("#sortDirection"),
    cardView: document.querySelector("#cardViewButton"),
    tableView: document.querySelector("#tableViewButton"),
    filterPanel: document.querySelector("#filterPanel"),
    filterTrigger: document.querySelector("#filterTrigger"),
    filterClose: document.querySelector("#filterClose"),
    filterScrim: document.querySelector("#filterScrim"),
    mobileFilterCount: document.querySelector("#mobileFilterCount"),
    drawer: document.querySelector("#detailDrawer"),
    drawerScrim: document.querySelector("#drawerScrim"),
    drawerClose: document.querySelector("#drawerClose"),
    drawerTitle: document.querySelector("#detailTitle"),
    drawerUid: document.querySelector("#detailUid"),
    drawerBody: document.querySelector("#drawerBody"),
    langZh: document.querySelector("#langZh"),
    langEn: document.querySelector("#langEn"),
    navToggle: document.querySelector("#navToggle"),
    nav: document.querySelector("#mainNav"),
    toast: document.querySelector("#toast"),
  };

  const state = {
    records: [],
    total: 0,
    valueLabels: { zh: {}, en: {} },
    lang: "zh",
    query: "",
    filters: new Map(filterDefinitions.map(({ field }) => [field, new Set()])),
    sort: "display_name",
    view: "cards",
    activeRecord: null,
    lastFocus: null,
  };

  function t(key) {
    return copy[state.lang][key] ?? key;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && value !== "";
  }

  function rawText(value) {
    if (!hasValue(value)) return t("unknown");
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? t("yes") : t("no");
    return String(value);
  }

  function labelValue(field, value) {
    if (!hasValue(value)) return t("unknown");
    if (Array.isArray(value)) return value.map((item) => labelValue(field, item)).join(", ");
    if (typeof value === "boolean") return value ? t("yes") : t("no");
    const labels = state.valueLabels[state.lang]?.[field] ?? {};
    return labels[value] ?? String(value);
  }

  function summaryFor(record) {
    if (state.lang === "zh" && hasValue(record.summary_zh)) return record.summary_zh;
    return record.summary || t("unknown");
  }

  function uniqueValues(field, isArray) {
    const values = new Set();
    state.records.forEach((record) => {
      const value = record[field];
      if (isArray && Array.isArray(value)) {
        value.filter(hasValue).forEach((item) => values.add(String(item)));
      } else if (hasValue(value)) {
        values.add(String(value));
      }
    });
    return [...values].sort((a, b) =>
      labelValue(field, a).localeCompare(labelValue(field, b), state.lang === "zh" ? "zh-CN" : "en")
    );
  }

  function valueCount(field, value, isArray) {
    return state.records.filter((record) => {
      const candidate = record[field];
      return isArray && Array.isArray(candidate)
        ? candidate.map(String).includes(value)
        : String(candidate) === value;
    }).length;
  }

  function renderStaticCopy() {
    document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-placeholder]").forEach((node) => {
      node.placeholder = t(node.dataset.placeholder);
    });
    els.langZh.classList.toggle("active", state.lang === "zh");
    els.langEn.classList.toggle("active", state.lang === "en");
    els.langZh.setAttribute("aria-pressed", String(state.lang === "zh"));
    els.langEn.setAttribute("aria-pressed", String(state.lang === "en"));
    els.drawerClose.setAttribute("aria-label", t("closeDetails"));
    els.filterClose.setAttribute("aria-label", t("closeFilters"));
    renderSortControls();
  }

  function currentSort() {
    return state.sort.endsWith("_desc")
      ? { field: state.sort.slice(0, -5), direction: "desc" }
      : { field: state.sort, direction: "asc" };
  }

  function setSort(field, direction) {
    state.sort = direction === "desc" ? `${field}_desc` : field;
    renderSortControls();
    renderResults();
  }

  function renderSortControls() {
    const { field, direction } = currentSort();
    els.sort.value = field;
    const label = t(direction === "asc" ? "ascending" : "descending");
    els.sortDirection.querySelector("[aria-hidden]").textContent = direction === "asc" ? "↑" : "↓";
    els.sortDirection.querySelector(".sr-only").textContent = label;
    els.sortDirection.setAttribute("aria-label", label);
    els.sortDirection.title = label;
  }

  function renderStats() {
    els.stats.total.textContent = String(state.total);
    els.stats.categories.textContent = String(new Set(state.records.map((record) => record.category)).size);
    els.stats.proven.textContent = String(state.records.filter((record) => record.maturity === "silicon-proven").length);
    els.stats.candidate.textContent = String(state.records.filter((record) => record.status === "candidate").length);
  }

  function renderFilterGroups() {
    els.filterGroups.replaceChildren();
    filterDefinitions.forEach(({ field, label, array }) => {
      const details = element("details", "filter-group");
      details.open = true;
      const summary = element("summary", "", t(label));
      const options = element("div", "filter-options");

      uniqueValues(field, array).forEach((value) => {
        const option = element("label", "filter-option");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.dataset.field = field;
        checkbox.checked = state.filters.get(field).has(value);
        checkbox.addEventListener("change", () => {
          const selected = state.filters.get(field);
          checkbox.checked ? selected.add(value) : selected.delete(value);
          renderResults();
          renderActiveFilters();
          updateFilterCount();
        });
        option.append(
          checkbox,
          element("span", "", labelValue(field, value)),
          element("span", "option-count", String(valueCount(field, value, array)))
        );
        options.append(option);
      });

      details.append(summary, options);
      els.filterGroups.append(details);
    });
  }

  function selectedFilterCount() {
    return [...state.filters.values()].reduce((total, selected) => total + selected.size, 0);
  }

  function updateFilterCount() {
    const count = selectedFilterCount();
    els.mobileFilterCount.hidden = count === 0;
    els.mobileFilterCount.textContent = String(count);
  }

  function renderActiveFilters() {
    els.activeFilters.replaceChildren();
    filterDefinitions.forEach(({ field }) => {
      state.filters.get(field).forEach((value) => {
        const chip = element("span", "active-filter", labelValue(field, value));
        const remove = element("button", "", "×");
        remove.type = "button";
        remove.setAttribute("aria-label", `${t("clearAll")}: ${labelValue(field, value)}`);
        remove.addEventListener("click", () => {
          state.filters.get(field).delete(value);
          const checkbox = els.filterGroups.querySelector(`input[data-field="${field}"][value="${CSS.escape(value)}"]`);
          if (checkbox) checkbox.checked = false;
          renderResults();
          renderActiveFilters();
          updateFilterCount();
        });
        chip.append(remove);
        els.activeFilters.append(chip);
      });
    });
  }

  function searchableText(record) {
    return [
      record.uid,
      record.display_name,
      record.slug,
      record.summary,
      record.summary_zh,
      record.ip_family,
      ...(Array.isArray(record.interfaces) ? record.interfaces : []),
    ]
      .filter(hasValue)
      .join(" ")
      .toLocaleLowerCase();
  }

  function matchesFilters(record) {
    return filterDefinitions.every(({ field, array }) => {
      const selected = state.filters.get(field);
      if (!selected.size) return true;
      const value = record[field];
      if (array && Array.isArray(value)) {
        return value.some((item) => selected.has(String(item)));
      }
      return selected.has(String(value));
    });
  }

  function filteredRecords() {
    const query = state.query.trim().toLocaleLowerCase();
    const records = state.records.filter(
      (record) => (!query || searchableText(record).includes(query)) && matchesFilters(record)
    );
    const { field, direction } = currentSort();
    return records.sort((a, b) => {
      const left = labelValue(field, a[field]);
      const right = labelValue(field, b[field]);
      const compared = left.localeCompare(right, state.lang === "zh" ? "zh-CN" : "en", {
        numeric: true,
        sensitivity: "base",
      });
      const result = compared || rawText(a.uid).localeCompare(rawText(b.uid), undefined, { numeric: true });
      return direction === "desc" ? -result : result;
    });
  }

  function createTag(text, neutral = false) {
    return element("span", `tag${neutral ? " neutral" : ""}`, text);
  }

  function createRiskBadge(record) {
    const value = hasValue(record.license_risk) ? String(record.license_risk) : "unknown";
    const riskClass = ["low", "medium", "high"].includes(value) ? value : "unknown";
    return element("span", `risk-badge risk-${riskClass}`, labelValue("license_risk", value));
  }

  function createStatusBadge(field, value) {
    return element("span", "status-badge", labelValue(field, value));
  }

  function appendInterfaceTags(container, interfaces, max = 3) {
    const values = Array.isArray(interfaces) ? interfaces : [];
    values.slice(0, max).forEach((value) => container.append(createTag(labelValue("interfaces", value))));
    if (values.length > max) container.append(createTag(`+${values.length - max} ${t("more")}`, true));
  }

  function createCard(record) {
    const card = element("article", "ip-card");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${record.display_name}, ${record.uid}`);

    const top = element("div", "card-top");
    const title = element("div", "card-title");
    title.append(element("p", "mono", record.uid), element("h3", "", rawText(record.display_name)));
    top.append(title, createRiskBadge(record));

    const meta = element("div", "card-meta");
    meta.append(
      createTag(labelValue("category", record.category), true),
      createTag(labelValue("ip_family", record.ip_family), true),
      createStatusBadge("maturity", record.maturity)
    );
    appendInterfaceTags(meta, record.interfaces);

    const summary = element("p", "card-summary", summaryFor(record));
    const footer = element("div", "card-footer");
    footer.append(
      element("span", "", rawText(record.languages)),
      element("span", "", rawText(record.license)),
      element("span", "", `${t("reviewed")} ${rawText(record.last_reviewed_at)}`)
    );

    card.append(top, meta, summary, footer);
    card.addEventListener("click", () => openDrawer(record, card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDrawer(record, card);
      }
    });
    return card;
  }

  function sortFromTable(field) {
    const current = currentSort();
    const direction = current.field === field
      ? (current.direction === "asc" ? "desc" : "asc")
      : (field === "last_reviewed_at" ? "desc" : "asc");
    setSort(field, direction);
  }

  function createTable(records) {
    const shell = element("div", "table-shell");
    const table = element("table", "ip-table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    tableColumns.forEach(({ field, label }) => {
      const th = document.createElement("th");
      const button = element("button", "table-sort", t(label));
      const ascending = state.sort === field;
      const descending = state.sort === `${field}_desc`;
      if (ascending || descending) {
        button.append(element("span", "sort-indicator", ascending ? "↑" : "↓"));
        th.setAttribute("aria-sort", ascending ? "ascending" : "descending");
      } else {
        th.setAttribute("aria-sort", "none");
      }
      button.type = "button";
      button.addEventListener("click", () => sortFromTable(field));
      th.append(button);
      headerRow.append(th);
    });
    thead.append(headerRow);

    const tbody = document.createElement("tbody");
    records.forEach((record) => {
      const row = document.createElement("tr");
      row.tabIndex = 0;
      row.setAttribute("aria-label", `${record.display_name}, ${record.uid}`);
      tableColumns.forEach(({ field }) => {
        const td = document.createElement("td");
        if (field === "display_name") {
          td.append(element("span", "table-name", rawText(record.display_name)));
        } else if (field === "interfaces") {
          const tags = element("div", "table-tags");
          appendInterfaceTags(tags, record.interfaces, 2);
          td.append(tags);
        } else if (field === "license_risk") {
          td.append(createRiskBadge(record));
        } else if (field === "maturity") {
          td.append(createStatusBadge("maturity", record.maturity));
        } else if (["category", "integration_difficulty"].includes(field)) {
          td.textContent = labelValue(field, record[field]);
        } else {
          td.textContent = rawText(record[field]);
        }
        row.append(td);
      });
      row.addEventListener("click", () => openDrawer(record, row));
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDrawer(record, row);
        }
      });
      tbody.append(row);
    });

    table.append(thead, tbody);
    shell.append(table);
    return shell;
  }

  function renderResults() {
    const records = filteredRecords();
    els.resultCount.textContent = String(records.length);
    els.resultsContent.replaceChildren();

    if (!records.length) {
      const empty = element("div", "empty-state");
      empty.append(
        element("div", "empty-mark", "0"),
        element("h3", "", t("noResultsTitle")),
        element("p", "", t("noResultsCopy"))
      );
      els.resultsContent.append(empty);
      return;
    }

    if (state.view === "cards") {
      const grid = element("div", "card-grid");
      records.forEach((record) => grid.append(createCard(record)));
      els.resultsContent.append(grid);
    } else {
      els.resultsContent.append(createTable(records));
    }
  }

  function addDefinition(grid, label, field, value, translate = false) {
    if (!hasValue(value)) return;
    const wrapper = document.createElement("div");
    wrapper.append(
      element("dt", "", t(label)),
      element("dd", "", translate ? labelValue(field, value) : rawText(value))
    );
    grid.append(wrapper);
  }

  function detailSection(title) {
    const section = element("section", "detail-section");
    section.append(element("h3", "", t(title)));
    return section;
  }

  function addTagSection(title, fields) {
    const values = fields.flatMap(({ field, translate = false }) => {
      const source = state.activeRecord[field];
      const list = Array.isArray(source) ? source : hasValue(source) ? [source] : [];
      return list.map((value) => (translate ? labelValue(field, value) : rawText(value)));
    });
    if (!values.length) return null;
    const section = detailSection(title);
    const list = element("ul", "detail-list");
    values.forEach((value) => {
      const item = document.createElement("li");
      item.append(createTag(value, true));
      list.append(item);
    });
    section.append(list);
    return section;
  }

  function safeExternalUrl(value) {
    if (!hasValue(value)) return null;
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function renderDrawer() {
    const record = state.activeRecord;
    if (!record) return;
    els.drawerUid.textContent = rawText(record.uid);
    els.drawerTitle.textContent = rawText(record.display_name);
    els.drawerBody.replaceChildren();

    const basic = detailSection("basicInfo");
    basic.append(element("p", "detail-description", summaryFor(record)));
    const basicGrid = element("dl", "detail-grid");
    addDefinition(basicGrid, "uid", "uid", record.uid);
    addDefinition(basicGrid, "slug", "slug", record.slug);
    addDefinition(basicGrid, "category", "category", record.category, true);
    addDefinition(basicGrid, "subcategories", "subcategories", record.subcategories, true);
    addDefinition(basicGrid, "ipFamily", "ip_family", record.ip_family, true);
    basic.append(basicGrid);
    els.drawerBody.append(basic);

    const technical = detailSection("technical");
    const technicalGrid = element("dl", "detail-grid");
    addDefinition(technicalGrid, "languages", "languages", record.languages);
    addDefinition(technicalGrid, "interfaces", "interfaces", record.interfaces, true);
    addDefinition(technicalGrid, "busCompatibility", "bus_compatibility", record.bus_compatibility);
    addDefinition(technicalGrid, "compatibility", "compatibility", record.compatibility);
    addDefinition(technicalGrid, "implementationStyle", "implementation_style", record.implementation_style);
    technical.append(technicalGrid);
    if (hasValue(record.features)) {
      const list = element("ul", "detail-list");
      record.features.forEach((value) => {
        const item = document.createElement("li");
        item.append(createTag(rawText(value), true));
        list.append(item);
      });
      technical.append(list);
    }
    if (technicalGrid.children.length || hasValue(record.features)) {
      els.drawerBody.append(technical);
    }

    const integration = detailSection("integration");
    const integrationGrid = element("dl", "detail-grid");
    addDefinition(integrationGrid, "integrationProfile", "integration_profile", record.integration_profile);
    addDefinition(integrationGrid, "resourceProfile", "resource_profile", record.resource_profile);
    addDefinition(integrationGrid, "performanceProfile", "performance_profile", record.performance_profile);
    addDefinition(integrationGrid, "integrationDifficulty", "integration_difficulty", record.integration_difficulty, true);
    addDefinition(integrationGrid, "bestFor", "best_for", record.best_for);
    addDefinition(integrationGrid, "notRecommendedFor", "not_recommended_for", record.not_recommended_for);
    integration.append(integrationGrid);
    if (integrationGrid.children.length) els.drawerBody.append(integration);

    const verification = detailSection("verification");
    const verificationGrid = element("dl", "detail-grid");
    addDefinition(verificationGrid, "maturity", "maturity", record.maturity, true);
    addDefinition(verificationGrid, "fpgaSupport", "fpga_support", record.fpga_support, true);
    addDefinition(verificationGrid, "asicSupport", "asic_support", record.asic_support, true);
    addDefinition(verificationGrid, "currentRef", "current_ref", record.current_ref);
    addDefinition(verificationGrid, "currentRefType", "current_ref_type", record.current_ref_type, true);
    verification.append(verificationGrid);
    if (verificationGrid.children.length) els.drawerBody.append(verification);

    const legal = detailSection("legal");
    const legalGrid = element("dl", "detail-grid");
    addDefinition(legalGrid, "license", "license", record.license);
    addDefinition(legalGrid, "licenseRisk", "license_risk", record.license_risk, true);
    addDefinition(legalGrid, "commercialUse", "commercial_use_allowed", record.commercial_use_allowed, true);
    legal.append(legalGrid);
    if (legalGrid.children.length) els.drawerBody.append(legal);

    const dataState = detailSection("dataState");
    const dataGrid = element("dl", "detail-grid");
    addDefinition(dataGrid, "status", "status", record.status, true);
    addDefinition(dataGrid, "dataQuality", "data_quality", record.data_quality, true);
    addDefinition(dataGrid, "documentationQuality", "documentation_quality", record.documentation_quality, true);
    addDefinition(dataGrid, "lastReviewed", "last_reviewed_at", record.last_reviewed_at);
    addDefinition(dataGrid, "nextAction", "next_action", record.next_action);
    dataState.append(dataGrid);
    if (dataGrid.children.length) els.drawerBody.append(dataState);

    const links = [
      ["catalogRepository", record.catalog_repository],
      ["upstreamRepository", record.upstream_repository],
      ["homepage", record.homepage],
      ["documentation", record.documentation],
    ].filter(([, value]) => safeExternalUrl(value));
    if (links.length) {
      const sources = detailSection("sourceLinks");
      const list = element("div", "link-list");
      links.forEach(([label, value]) => {
        const anchor = element("a", "", t(label));
        anchor.href = safeExternalUrl(value);
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
        anchor.append(element("span", "", "↗"));
        list.append(anchor);
      });
      sources.append(list);
      els.drawerBody.append(sources);
    }
  }

  function openDrawer(record, trigger) {
    state.activeRecord = record;
    state.lastFocus = trigger;
    renderDrawer();
    els.drawer.classList.add("open");
    els.drawerScrim.classList.add("open");
    els.drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
    window.setTimeout(() => els.drawerClose.focus(), 50);
  }

  function closeDrawer() {
    els.drawer.classList.remove("open");
    els.drawerScrim.classList.remove("open");
    els.drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
    state.activeRecord = null;
    if (state.lastFocus?.isConnected) state.lastFocus.focus();
  }

  function openFilters() {
    els.filterPanel.classList.add("open");
    els.filterScrim.classList.add("open");
    els.filterTrigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("filters-open");
    window.setTimeout(() => els.filterClose.focus(), 50);
  }

  function closeFilters() {
    els.filterPanel.classList.remove("open");
    els.filterScrim.classList.remove("open");
    els.filterTrigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("filters-open");
    els.filterTrigger.focus();
  }

  function setView(view) {
    state.view = view;
    els.cardView.classList.toggle("active", view === "cards");
    els.tableView.classList.toggle("active", view === "table");
    els.cardView.setAttribute("aria-pressed", String(view === "cards"));
    els.tableView.setAttribute("aria-pressed", String(view === "table"));
    renderResults();
  }

  function clearAllFilters() {
    state.filters.forEach((selected) => selected.clear());
    els.filterGroups.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = false;
    });
    renderResults();
    renderActiveFilters();
    updateFilterCount();
  }

  function setLanguage(lang) {
    state.lang = lang;
    renderStaticCopy();
    renderFilterGroups();
    renderActiveFilters();
    renderResults();
    if (state.activeRecord) renderDrawer();
  }

  function trapFocus(event, container) {
    const focusable = [...container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((node) => node.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function showError() {
    els.resultsContent.replaceChildren();
    const error = element("div", "error-state");
    const retry = element("button", "primary-button", t("retry"));
    retry.type = "button";
    retry.addEventListener("click", init);
    error.append(
      element("div", "empty-mark", "!"),
      element("h3", "", t("errorTitle")),
      element("p", "", t("errorCopy")),
      retry
    );
    els.resultsContent.append(error);
  }

  function bindEvents() {
    els.search.addEventListener("input", () => {
      state.query = els.search.value;
      renderResults();
    });
    els.clearFilters.addEventListener("click", clearAllFilters);
    els.sort.addEventListener("change", () => {
      setSort(els.sort.value, currentSort().direction);
    });
    els.sortDirection.addEventListener("click", () => {
      const { field, direction } = currentSort();
      setSort(field, direction === "asc" ? "desc" : "asc");
    });
    els.cardView.addEventListener("click", () => setView("cards"));
    els.tableView.addEventListener("click", () => setView("table"));
    els.langZh.addEventListener("click", () => setLanguage("zh"));
    els.langEn.addEventListener("click", () => setLanguage("en"));
    els.drawerClose.addEventListener("click", closeDrawer);
    els.drawerScrim.addEventListener("click", closeDrawer);
    els.filterTrigger.addEventListener("click", openFilters);
    els.filterClose.addEventListener("click", closeFilters);
    els.filterScrim.addEventListener("click", closeFilters);
    els.navToggle.addEventListener("click", () => {
      const open = els.nav.classList.toggle("open");
      els.navToggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && els.drawer.classList.contains("open")) {
        trapFocus(event, els.drawer);
      } else if (event.key === "Tab" && els.filterPanel.classList.contains("open") && window.innerWidth <= 1120) {
        trapFocus(event, els.filterPanel);
      }
      if (event.key === "Escape") {
        if (els.drawer.classList.contains("open")) closeDrawer();
        else if (els.filterPanel.classList.contains("open")) closeFilters();
        else if (els.nav.classList.contains("open")) {
          els.nav.classList.remove("open");
          els.navToggle.setAttribute("aria-expanded", "false");
          els.navToggle.focus();
        }
      }
      if (
        event.key === "/" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)
      ) {
        event.preventDefault();
        els.search.focus();
      }
    });
  }

  async function init() {
    els.resultsContent.replaceChildren();
    const loading = element("div", "loading-state");
    loading.append(element("span", "loader"), element("p", "", t("loading")));
    els.resultsContent.append(loading);
    try {
      const [dataResponse, labelsResponse] = await Promise.all([
        fetch(DATA_URL, { cache: "no-store" }),
        fetch(VALUE_LABELS_URL, { cache: "no-store" }),
      ]);
      if (!dataResponse.ok || !labelsResponse.ok) throw new Error("Catalog fetch failed");
      const payload = await dataResponse.json();
      state.valueLabels = await labelsResponse.json();
      state.records = Array.isArray(payload.records) ? payload.records : [];
      state.total = Number.isFinite(payload.total) ? payload.total : state.records.length;
      renderStats();
      renderFilterGroups();
      renderActiveFilters();
      renderResults();
    } catch (error) {
      console.error(error);
      showError();
    }
  }

  renderStaticCopy();
  bindEvents();
  init();
})();
