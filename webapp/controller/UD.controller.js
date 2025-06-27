sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent"
], function(Controller, MessageToast, Filter, FilterOperator, JSONModel, UIComponent) {
    "use strict";

    return Controller.extend("com.quality.portal.qualityportal.controller.UD", {
        onInit: function() {
            this._initFilters();
        },

        _initFilters: function() {
            this.oSearchField = this.byId("fieldUD1");
            this.oValuationModeSelect = this.byId("select0");
            this.oUDSelect = this.byId("select0_1751024028637");
            this.oSearchField.attachSearch(this.onSearch.bind(this));
            this.oValuationModeSelect.attachChange(this.onFilterChange.bind(this));
            this.oUDSelect.attachChange(this.onFilterChange.bind(this));
            this.oTable = this.byId("tableUD");
        },

        onSearch: function(oEvent) {
            var sQuery = oEvent.getParameter("query");
            this._applyFilters(sQuery);
        },

        onFilterChange: function(oEvent) {
            this._applyFilters();
        },

        _applyFilters: function(sSearchQuery) {
            var aFilters = [];
            var oTable = this.oTable;
            var oBinding = oTable.getBinding("items");

            if (sSearchQuery) {
                aFilters.push(new Filter("prueflos", FilterOperator.Contains, sSearchQuery));
            }
            
            var sValuationMode = this.oValuationModeSelect.getSelectedKey();
            if (sValuationMode && sValuationMode !== "item-key-3") { 
                aFilters.push(new Filter("vauswahlmg", FilterOperator.EQ, this._getValuationModeKey(sValuationMode)));
            }
            
            var sUDValue = this.oUDSelect.getSelectedKey();
            if (sUDValue && sUDValue !== "item-key-3") { 
                aFilters.push(new Filter("vcode", FilterOperator.EQ, sUDValue === "item-key-1" ? "A" : "R"));
            }
            

            oBinding.filter(aFilters.length > 0 ? new Filter({
                filters: aFilters,
                and: true
            }) : []);
        },

        _getValuationModeKey: function(sSelectKey) {

            switch(sSelectKey) {
                case "item-key-1": return "02"; // Material Specific
                case "item-key-2": return "03"; // Material Group
                case "item-key-4": return "04"; // Mixed valuation
                case "item-key-5": return "05"; // Alternative valuation
                default: return "";
            }
        },

        onNavBack: function() {
            history.go(-1);
        },

        onLogoutPress: function() {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Login");
        },

        valuationModes: function(code) {
            switch(code) {
                case '02': return "Material Specific";
                case '03': return "Material Group";
                case '04': return "Mixed Valuation";
                case '05': return "Fallback";
                default: return code;
            }
        },

        UDStatus: function(code) {
            switch(code) {
                case 'A': return 'Accepted';
                case 'R': return 'Rejected';
                default: return code;
            }
        },

        UDStatusValueState: function(code) {
            switch(code) {
                case 'A': return sap.ui.core.ValueState.Success;
                case 'R': return sap.ui.core.ValueState.Error;
                default: return sap.ui.core.ValueState.None;
            }
        },
    });
});