sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageStrip"
], (Controller, UIComponent, JSONModel, MessageToast, MessageStrip) => {
    "use strict";
    return Controller.extend("com.quality.portal.qualityportal.controller.Login", {
        
        onInit() {},

        showMessage(text, type) {
            const mStrip = this.byId("L_message_strip");
            mStrip.setText(text);
            mStrip.setType(type);
            mStrip.setVisible(true);
        },

        onClick() {
            const ID = this.byId("input_ID").getValue();
            const password = this.byId("input_password").getValue();
            if (!ID || !password) {
                this.showMessage("Check the credentials", "Warning");
                return;
            }
            this.validateUser(ID, password);
        },
        
        validateUser(id, password) {
            const oModel = this.getOwnerComponent().getModel();
            const router = UIComponent.getRouterFor(this);

            oModel.read(`/YSAT_QM_LOGIN(p_engineer='${id}',p_password='${password}')/Set`, {
                success: (data) => {
                    const jsonData = new JSONModel(data);
                    if (jsonData.oData.results[0]) {
                        this.showMessage("Login Successfull", "Success")
                        setTimeout(() => {
                            router.navTo("Dashboard");
                        }, 2000);
                    } else {
                        this.showMessage("Error Occurred", "Error");
                    }
                },
                error: (error) => {
                    MessageToast.show("Error Occurred", "Error");
                }
            });
        }
    });
});