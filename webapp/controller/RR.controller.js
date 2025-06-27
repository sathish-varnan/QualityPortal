sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent",
], (Controller, MessageToast, Filter, FilterOperator, UIComponent) => {
    "use strict";

    return Controller.extend("com.quality.portal.qualityportal.controller.RR", {
        onInit() {
            this.byId("barrr1").attachSearch(this.onSearch.bind(this));
        },
        navBack() {
            history.go(-1);
        },
        logout() {
            const router = UIComponent.getRouterFor(this);
            router.navTo("Login");
        },
        statusTextFormatter(text) {
            switch(text) {
                case 'A':
                    return "Accepted";
                case 'R':
                    return "Rejected";
            }
        },
        statusFormatter(text){
            switch(text) {
                case 'A':
                    return sap.ui.core.ValueState.Success;
                case 'R':
                    return sap.ui.core.ValueState.Error;
                default:
                    return sap.ui.core.ValueState.Warning;
            }
        },
        stat35() {
            return sap.ui.core.ValueState.Information;
        },
        inspectionType(code) {
            switch(code){
                case '02':
                    return 'Inspection at Goods Receipt';
                case '03':
                    return 'Production Inspection';
                case '05':
                    return 'Stock Inspection';
            }
        },
        onSearch() {
            console.log("Heyy");
            const aFilters = [];
            const oTable = this.byId("tableRR");
            const oBinding = oTable.getBinding("items");
            
            const sSearchTerm = this.byId("field1").getValue();
            if (sSearchTerm) {
                aFilters.push(new Filter("prueflos", FilterOperator.Contains, sSearchTerm));
            }
            
            const sInspectionType = this.byId("selectinsptype").getSelectedKey();
            if (sInspectionType && sInspectionType !== "item-key-2") { 
                let sTypeCode;
                switch(sInspectionType) {
                    case "item-key-1": sTypeCode = "02"; break; // Goods Receipt
                    case "item-key-3": sTypeCode = "03"; break; // Production
                    case "item-key-4": sTypeCode = "05"; break; // Stock
                }
                if (sTypeCode) {
                    aFilters.push(new Filter("art", FilterOperator.EQ, sTypeCode));
                }
            }
            
            const sStatus = this.byId("selectstatus").getSelectedKey();
            if (sStatus && sStatus !== "item-key-0") { 
                let sStatusCode;
                switch(sStatus) {
                    case "item-key-1": sStatusCode = "A"; break; // Accepted
                    case "item-key-2": sStatusCode = "R"; break; // Rejected
                }
                if (sStatusCode) {
                    aFilters.push(new Filter("mbewertg", FilterOperator.EQ, sStatusCode));
                }
            }
            
            oBinding.filter(aFilters.length > 0 ? aFilters : null);
        }
    });
});