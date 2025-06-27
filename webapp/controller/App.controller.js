sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("com.quality.portal.qualityportal.controller.App", {
        onInit() {
        },
        onclick() {
            MessageToast.show("You clicked", {
                my: "CenterCenter",
                at: "CenterCenter"
            });
        }
    });
});