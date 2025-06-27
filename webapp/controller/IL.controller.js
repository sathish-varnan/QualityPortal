sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/core/ValueState",
    "sap/ui/core/UIComponent"
], function(Controller, MessageToast, JSONModel, Filter, FilterOperator, Sorter, ValueState, UIComponent) {
    "use strict";

    return Controller.extend("com.quality.portal.qualityportal.controller.IL", {
        onInit: function() {
            this._oSmartFilterBar = this.byId("bar0");
            this._oTable = this.byId("tableIL");
            this._currentKey = '';
            
            this._initModels();
            
            this._setupEventHandlers();

            this._loadInitialData();
        },

        _initModels: function() {
            this._oViewModel = new JSONModel({
                busy: false,
                hasPendingChanges: false
            });
            this.getView().setModel(this._oViewModel, "viewModel");
        },

        _setupEventHandlers: function() {
            this._oSmartFilterBar.attachSearch(this._onSearch.bind(this));
            
            this._oSmartFilterBar.attachClear(this._onClear.bind(this));
            
            this.byId("button0").attachPress(this.onLogout.bind(this));
        },

        navBack() {
            history.go(-1);
        },

        _loadInitialData: function() {
            this._oViewModel.setProperty("/busy", true);
            
            const oModel = this.getOwnerComponent().getModel();
            oModel.read("/YSAT_QM_IL", {
                success: this._onDataLoaded.bind(this),
                error: this._onDataLoadError.bind(this)
            });
        },

        _onDataLoaded: function(oData) {
            const jsonData = new JSONModel(oData);
            const _data = jsonData.oData.results;
            
            this._updateFilterCounts(_data);
            
            this._oTable.setModel(jsonData);
            this._oTable.bindItems({
                path: "/results",
                template: this._oTable.getBindingInfo("items").template
            });
            
            this._oViewModel.setProperty("/busy", false);
        },

        _onDataLoadError: function(oError) {
            MessageToast.show("Error loading inspection lots");
            this._oViewModel.setProperty("/busy", false);
            console.error(oError);
        },

        _updateFilterCounts: function(aData) {
            const count = this.byId("filter5");
            const pending = this.byId("filter6");
            const accepted = this.byId("filter7");
            const rejected = this.byId("filter8");
            
            count.setCount(aData.length);
            pending.setCount(aData.filter(item => item.vcode === '').length);
            accepted.setCount(aData.filter(item => item.vcode === 'A').length);
            rejected.setCount(aData.filter(item => item.vcode === 'R').length);
        },

        _onSearch: function(oEvent) {
            const aFilters = [];
            const oSmartFilterBar = this.byId("bar0");
            const oSearchField = this.byId("field0");
            const oDatePicker = this.byId("picker0");
            
            const sSearchTerm = oSearchField.getValue();
            if (sSearchTerm) {
                aFilters.push(new Filter("prueflos", FilterOperator.Contains, sSearchTerm));
            }
            
            const oDate = oDatePicker.getDateValue();
            if (oDate) {
                aFilters.push(new Filter("enstehdat", FilterOperator.GE, oDate));
            }

            const oTableBinding = this._oTable.getBinding("items");

            if (this._currentKey) {
                switch(this._currentKey) {
                    case "Acc":
                        aFilters.push(new Filter("vcode", FilterOperator.EQ, "A"));
                        break;
                    case "Pen":
                        aFilters.push(new Filter("vcode", FilterOperator.EQ, ""));
                        break;
                    case "Rej":
                        aFilters.push(new Filter("vcode", FilterOperator.EQ, "R"));
                }
            }

            oTableBinding.filter(aFilters);
        },

        _onClear: function() {
            const oTableBinding = this._oTable.getBinding("items");
            oTableBinding.filter([]);
            const aAllData = oTableBinding.getModel().getProperty("/results");
            this._updateFilterCounts(aAllData);
        },

        onFilter: function(oEvent) {
            const sKey = oEvent.getParameter("key");
            this._currentKey = sKey;
            const oTableBinding = this._oTable.getBinding("items");
            const aFilters = [];
            
            const aExistingFilters = oTableBinding.aFilters || [];
            const aNonDecisionFilters = aExistingFilters.filter(oFilter => 
                oFilter.sPath !== "vcode" && oFilter.sPath !== "prueflos" && oFilter.sPath !== "enstehdat"
            );
            
            switch(sKey) {
                case "Acc":
                    aFilters.push(new Filter("vcode", FilterOperator.EQ, "A"));
                    break;
                case "Pen":
                    aFilters.push(new Filter("vcode", FilterOperator.EQ, ""));
                    break;
                case "Rej":
                    aFilters.push(new Filter("vcode", FilterOperator.EQ, "R"));
            }
            
            const aCombinedFilters = [...aNonDecisionFilters, ...aFilters];
            
            oTableBinding.filter(aCombinedFilters.length > 0 ? aCombinedFilters : null);
        },

        valueFormat: function(sCode) {
            switch(sCode) {
                case 'A': return 'Accepted';
                case 'R': return 'Rejected';
                case '': return 'Pending';
                default: return sCode;
            }
        },

        codeFormart: function(sCode) {
            switch(sCode) {
                case 'A': return ValueState.Success;
                case 'R': return ValueState.Error;
                case '': return ValueState.Warning;
                default: return ValueState.None;
            }
        },

        onLogout: function() {
            const router = UIComponent.getRouterFor(this);
            router.navTo("Login");
        }
    });
});