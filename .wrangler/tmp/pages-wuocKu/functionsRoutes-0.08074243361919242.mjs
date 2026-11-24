import { onRequestPost as __api_admin_login_js_onRequestPost } from "C:\\Users\\Nagarjun\\Downloads\\order tracking\\functions\\api\\admin-login.js"
import { onRequestPost as __api_create_order_js_onRequestPost } from "C:\\Users\\Nagarjun\\Downloads\\order tracking\\functions\\api\\create-order.js"
import { onRequestGet as __api_get_order_js_onRequestGet } from "C:\\Users\\Nagarjun\\Downloads\\order tracking\\functions\\api\\get-order.js"
import { onRequestGet as __api_get_products_js_onRequestGet } from "C:\\Users\\Nagarjun\\Downloads\\order tracking\\functions\\api\\get-products.js"
import { onRequestGet as __api_list_orders_js_onRequestGet } from "C:\\Users\\Nagarjun\\Downloads\\order tracking\\functions\\api\\list-orders.js"
import { onRequestPost as __api_mark_shipped_js_onRequestPost } from "C:\\Users\\Nagarjun\\Downloads\\order tracking\\functions\\api\\mark-shipped.js"
import { onRequestGet as __api_track_order_js_onRequestGet } from "C:\\Users\\Nagarjun\\Downloads\\order tracking\\functions\\api\\track-order.js"
import { onRequestPost as __api_update_status_js_onRequestPost } from "C:\\Users\\Nagarjun\\Downloads\\order tracking\\functions\\api\\update-status.js"
import { onRequestOptions as ___middleware_js_onRequestOptions } from "C:\\Users\\Nagarjun\\Downloads\\order tracking\\functions\\_middleware.js"
import { onRequest as ___middleware_js_onRequest } from "C:\\Users\\Nagarjun\\Downloads\\order tracking\\functions\\_middleware.js"

export const routes = [
    {
      routePath: "/api/admin-login",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_login_js_onRequestPost],
    },
  {
      routePath: "/api/create-order",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_create_order_js_onRequestPost],
    },
  {
      routePath: "/api/get-order",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_get_order_js_onRequestGet],
    },
  {
      routePath: "/api/get-products",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_get_products_js_onRequestGet],
    },
  {
      routePath: "/api/list-orders",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_list_orders_js_onRequestGet],
    },
  {
      routePath: "/api/mark-shipped",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_mark_shipped_js_onRequestPost],
    },
  {
      routePath: "/api/track-order",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_track_order_js_onRequestGet],
    },
  {
      routePath: "/api/update-status",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_update_status_js_onRequestPost],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "OPTIONS",
      middlewares: [___middleware_js_onRequestOptions],
      modules: [],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]