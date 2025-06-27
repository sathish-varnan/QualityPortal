sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], (Controller, MessageToast, UIComponent) => {
    "use strict";

    return Controller.extend("com.quality.portal.qualityportal.controller.Dashboard", {
        onInit() {
        },
        onILClick() {
            const router = UIComponent.getRouterFor(this);
            router.navTo("IL");
        },
        onRRClick() {
            const router = UIComponent.getRouterFor(this);
            router.navTo("RR");
        },
        onUDClick() {
            const router = UIComponent.getRouterFor(this);
            router.navTo("UD");
        },
        navBack() {
            history.go(-1);
        },
        logout() {
            const router = UIComponent.getRouterFor(this);
            router.navTo("Login");
        }
    });
});