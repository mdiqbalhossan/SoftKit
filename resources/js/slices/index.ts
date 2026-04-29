import { combineReducers } from "redux";

import LayoutReducer from "./layouts/reducer";
import DashboardEcommerceReducer from "./dashboardEcommerce/reducer";

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    DashboardEcommerce: DashboardEcommerceReducer,
});

export default rootReducer;
