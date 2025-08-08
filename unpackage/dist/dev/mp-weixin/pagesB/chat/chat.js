(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pagesB/chat/chat"],{

/***/ 270:
/*!*******************************************************************************************!*\
  !*** /Users/zhulin/Documents/HBuilderProjects/AI/main.js?{"page":"pagesB%2Fchat%2Fchat"} ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _chat = _interopRequireDefault(__webpack_require__(/*! ./pagesB/chat/chat.vue */ 271));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_chat.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 271:
/*!************************************************************************!*\
  !*** /Users/zhulin/Documents/HBuilderProjects/AI/pagesB/chat/chat.vue ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _chat_vue_vue_type_template_id_7e774f28___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chat.vue?vue&type=template&id=7e774f28& */ 272);
/* harmony import */ var _chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chat.vue?vue&type=script&lang=js& */ 274);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _chat_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chat.vue?vue&type=style&index=0&lang=scss& */ 276);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 48);

var renderjs





/* normalize component */

var component = Object(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _chat_vue_vue_type_template_id_7e774f28___WEBPACK_IMPORTED_MODULE_0__["render"],
  _chat_vue_vue_type_template_id_7e774f28___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _chat_vue_vue_type_template_id_7e774f28___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pagesB/chat/chat.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 272:
/*!*******************************************************************************************************!*\
  !*** /Users/zhulin/Documents/HBuilderProjects/AI/pagesB/chat/chat.vue?vue&type=template&id=7e774f28& ***!
  \*******************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_template_id_7e774f28___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./chat.vue?vue&type=template&id=7e774f28& */ 273);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_template_id_7e774f28___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_template_id_7e774f28___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_template_id_7e774f28___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_template_id_7e774f28___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 273:
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/zhulin/Documents/HBuilderProjects/AI/pagesB/chat/chat.vue?vue&type=template&id=7e774f28& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    Flexbox: function () {
      return Promise.all(/*! import() | components/Flexbox/Flexbox */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/Flexbox/Flexbox")]).then(__webpack_require__.bind(null, /*! @/components/Flexbox/Flexbox.vue */ 691))
    },
    Navbar: function () {
      return Promise.all(/*! import() | components/Navbar/Navbar */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/Navbar/Navbar")]).then(__webpack_require__.bind(null, /*! @/components/Navbar/Navbar.vue */ 733))
    },
    Typography: function () {
      return Promise.all(/*! import() | components/Typography/Typography */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/Typography/Typography")]).then(__webpack_require__.bind(null, /*! @/components/Typography/Typography.vue */ 705))
    },
    mpHtml: function () {
      return Promise.all(/*! import() | uni_modules/mp-html/components/mp-html/mp-html */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/mp-html/components/mp-html/mp-html")]).then(__webpack_require__.bind(null, /*! @/uni_modules/mp-html/components/mp-html/mp-html.vue */ 740))
    },
    Icon: function () {
      return Promise.all(/*! import() | components/Icon/Icon */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/Icon/Icon")]).then(__webpack_require__.bind(null, /*! @/components/Icon/Icon.vue */ 698))
    },
    Tabbar: function () {
      return Promise.all(/*! import() | components/Tabbar/Tabbar */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/Tabbar/Tabbar")]).then(__webpack_require__.bind(null, /*! @/components/Tabbar/Tabbar.vue */ 712))
    },
    Login: function () {
      return Promise.all(/*! import() | components/Login/Login */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/Login/Login")]).then(__webpack_require__.bind(null, /*! @/components/Login/Login.vue */ 719))
    },
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var l0 = _vm.__map(_vm.messages, function (message, index) {
    var $orig = _vm.__get_orig(message)
    var g0 =
      !(message.is_mold === 1) &&
      !(message.is_mold === 2) &&
      !(message.is_mold === 3) &&
      message.is_mold === 5
        ? Math.floor(message.content.duration / 1000)
        : null
    return {
      $orig: $orig,
      g0: g0,
    }
  })
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        l0: l0,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 274:
/*!*************************************************************************************************!*\
  !*** /Users/zhulin/Documents/HBuilderProjects/AI/pagesB/chat/chat.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./chat.vue?vue&type=script&lang=js& */ 275);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 275:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/zhulin/Documents/HBuilderProjects/AI/pagesB/chat/chat.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _vuex = __webpack_require__(/*! vuex */ 33);
var _request = __webpack_require__(/*! @/utils/request */ 34);
var _util = __webpack_require__(/*! @/utils/util */ 36);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var _default = {
  data: function data() {
    return {
      isRobot: false,
      sessionId: '',
      lastChunkContent: '',
      animationBuffer: '',
      animationTimer: null,
      typingSpeed: 100,
      messageIndex: 0,
      // 当前助手消息所在下标
      isWaiting: false,
      // 正在等待流数据
      isFinished: true,
      // 对话是否完成
      friendName: '',
      friendId: '',
      roomId: '',
      isAgent: '',
      previousPageLastMessageTime: '',
      scrollTop: 0,
      pageNo: 1,
      pageSize: 20,
      count: 0,
      isPlaying: false,
      // 初始状态下的 icon 修改为 voice-3.png
      voiceIcon: 'voice-3.png',
      voiceInterval: null,
      // 切换 icon 的定时器
      currentPlayingVoiceMessageId: null,
      // 当前正在播放的语音消息 id
      friend: null,
      socketTask: null,
      messages: []
    };
  },
  onLoad: function onLoad(option) {
    var _this = this;
    uni.$on('chunkReceived', this.handleChunk);
    this.friendName = decodeURIComponent(option.friendName);
    this.friendId = option.friendId;
    this.getRoomId(option.friendId);
    this.getSessionId();
    this.audio = uni.createInnerAudioContext();
    this.audio.onEnded(function () {
      _this.clearVoiceInterval();
      _this.isPlaying = false;
      _this.currentPlayingVoiceMessageId = null;
    });
  },
  onUnload: function onUnload() {
    // 页面卸载时移除事件监听，并清除定时器防止内存泄漏
    uni.$off('chunkReceived', this.handleChunk);
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
  },
  computed: _objectSpread({}, (0, _vuex.mapState)(['userInfo', 'statusBarHeight'])),
  methods: {
    getSessionId: function getSessionId() {
      var _this2 = this;
      (0, _request.request)({
        url: '/api/v1/chat/sessions',
        method: 'POST',
        data: {
          user_id: this.userInfo.member_id.toString()
        },
        isRobot: true,
        success: function success(result) {
          if (result) {
            _this2.sessionId = result.session_id;
          }
        }
      });
    },
    handleChunk: function handleChunk(chunk) {
      var _this3 = this;
      console.log('收到流式数据：', chunk);
      var newContent = chunk.content.replace(/\s*##\d+\$\$/g, '');
      var diff = newContent.slice(this.lastChunkContent.length);
      this.lastChunkContent = newContent;
      this.animationBuffer += diff;
      if (!this.animationTimer) {
        this.animationTimer = setInterval(function () {
          if (_this3.animationBuffer.length > 0) {
            // 取出缓冲区第一个字符追加到助手消息中
            _this3.messages[_this3.messageIndex].content += _this3.animationBuffer[0];
            _this3.animationBuffer = _this3.animationBuffer.slice(1);
            _this3.messages[_this3.messageIndex].content = _this3.messages[_this3.messageIndex].content;
            _this3.scrollToBottom();
          } else {
            clearInterval(_this3.animationTimer);
            _this3.animationTimer = null;
          }
        }, this.typingSpeed);
      }
    },
    getAIResponse: function getAIResponse(question) {
      var _this4 = this;
      this.isWaiting = true;
      // 发起流式请求，流数据会通过 uni.$emit('chunkReceived', parsed) 逐块返回
      (0, _request.request)({
        url: '/api/v1/chat/stream',
        method: 'POST',
        data: {
          question: question,
          session_id: this.sessionId,
          user_id: this.userInfo.member_id.toString(),
          stream: true
        },
        isRobot: true,
        success: function success(res) {
          // 当流式请求结束时，启动定时器等待动画缓冲区清空
          var checkBuffer = setInterval(function () {
            if (_this4.animationBuffer.length === 0) {
              clearInterval(checkBuffer);
              if (_this4.animationTimer) {
                clearInterval(_this4.animationTimer);
                _this4.animationTimer = null;
              }
              _this4.isWaiting = false;
              _this4.isFinished = true;
              if (_this4.messages[_this4.messageIndex]) {
                _this4.messages[_this4.messageIndex].time = (0, _util.formatDate)(new Date().getTime(), 'YYYY-MM-DD hh:mm:ss');
              }
              _this4.saveMessage(_this4.messages[_this4.messageIndex]);
              _this4.scrollToBottom();
            }
          }, _this4.typingSpeed);
        },
        complete: function complete() {
          _this4.isWaiting = false;
        }
      });
    },
    togglePlay: function togglePlay(src, msgId) {
      var _this5 = this;
      // 如果点击的语音消息正处于播放状态，则暂停播放
      if (this.currentPlayingVoiceMessageId === msgId && this.isPlaying) {
        this.audio.pause();
        this.clearVoiceInterval();
        this.isPlaying = false;
        this.currentPlayingVoiceMessageId = null;
      } else {
        // 如果已有其他语音在播放，先暂停它
        if (this.currentPlayingVoiceMessageId && this.isPlaying) {
          this.audio.pause();
          this.clearVoiceInterval();
        }
        // 播放当前语音消息
        this.audio.src = src;
        this.audio.play();
        this.isPlaying = true;
        this.currentPlayingVoiceMessageId = msgId;
        // 开始切换 icon，每300ms切换一次，循环顺序：voice-3 -> voice-1 -> voice-2 -> voice-3
        this.voiceInterval = setInterval(function () {
          if (_this5.voiceIcon === 'voice-3.png') {
            _this5.voiceIcon = 'voice-1.png';
          } else if (_this5.voiceIcon === 'voice-1.png') {
            _this5.voiceIcon = 'voice-2.png';
          } else {
            _this5.voiceIcon = 'voice-3.png';
          }
        }, 300);
      }
    },
    clearVoiceInterval: function clearVoiceInterval() {
      if (this.voiceInterval) {
        clearInterval(this.voiceInterval);
        this.voiceInterval = null;
      }
      // 重置 icon 为初始状态 voice-3.png
      this.voiceIcon = 'voice-3.png';
    },
    navigateToPlan: function navigateToPlan() {
      uni.navigateTo({
        url: '/pagesB/plan/plan'
      });
    },
    navigateToSurvey: function navigateToSurvey() {
      uni.navigateTo({
        url: '/pagesB/survey/survey'
      });
    },
    formatTime: function formatTime(time) {
      var now = new Date();
      var messageDate = new Date(time.replace(/-/g, '/'));
      var diffInMilliseconds = now - messageDate;
      var diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      var hours = String(messageDate.getHours()).padStart(2, '0');
      var minutes = String(messageDate.getMinutes()).padStart(2, '0');
      if (diffInDays === 0) {
        return "".concat(hours, ":").concat(minutes);
      } else if (diffInDays === 1) {
        return "\u6628\u5929 ".concat(hours, ":").concat(minutes);
      } else if (diffInDays <= 7) {
        var weekdays = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return "".concat(weekdays[messageDate.getDay()], " ").concat(hours, ":").concat(minutes);
      } else if (messageDate.getFullYear() === now.getFullYear()) {
        return "".concat(messageDate.getMonth() + 1, "\u6708").concat(messageDate.getDate(), "\u65E5 ").concat(hours, ":").concat(minutes);
      } else {
        return "".concat(messageDate.getFullYear(), "\u5E74").concat(messageDate.getMonth() + 1, "\u6708").concat(messageDate.getDate(), "\u65E5 ").concat(hours, ":").concat(minutes);
      }
    },
    showTime: function showTime(index) {
      var message = this.messages[index];
      if (index === 0) {
        return true;
      }
      var previousMessage = this.messages[index - 1];
      var currentTime = new Date(message.time.replace(/-/g, '/')).getTime();
      var previousTime = new Date(previousMessage.time.replace(/-/g, '/')).getTime();
      var timeDiff = Math.floor((currentTime - previousTime) / (1000 * 60));
      return timeDiff >= 5;
    },
    scrollToBottom: function scrollToBottom() {
      var _this6 = this;
      setTimeout(function () {
        _this6.$nextTick(function () {
          var query = uni.createSelectorQuery().in(_this6);
          query.select('.message-list').boundingClientRect(function (data) {
            _this6.scrollTop = data.height;
          }).exec();
        });
      }, 100);
    },
    scrollToTop: function scrollToTop() {
      if (this.count > this.messages.length) {
        this.pageNo++;
        this.previousPageLastMessageTime = this.messages[this.messages.length - 1].time;
        this.getChat();
      }
    },
    sendMessage: function sendMessage(content, is_mold, duration) {
      var message = {
        user_id: this.userInfo.member_id,
        type: 'say',
        to_friend_id: this.friend.user_id,
        room_id: this.roomId,
        friend_name: this.friend.name,
        user_name: this.userInfo.nickname,
        is_mold: is_mold,
        id: this.friend.id
      };
      if (is_mold === 5) {
        message.content = {};
        message.content.url = content;
        message.content.duration = duration;
      } else {
        message.content = content;
      }
      this.socketTask.send({
        data: JSON.stringify(message)
      });
    },
    saveMessage: function saveMessage(data) {
      (0, _request.request)({
        url: '/api/chat/save_message',
        method: 'POST',
        data: data,
        success: function success(res) {}
      });
    },
    getRoomId: function getRoomId(to_friend_id) {
      var _this7 = this;
      (0, _request.request)({
        url: '/api/chat/get_room_id',
        data: {
          to_friend_id: to_friend_id
        },
        success: function success(res) {
          if (res) {
            _this7.roomId = res.room_id;
            _this7.initChat(res.room_id, to_friend_id);
          }
        }
      });
    },
    initChat: function initChat(room_num, to_friend_id) {
      var _this8 = this;
      (0, _request.request)({
        url: '/api/chat/chat_index',
        method: 'POST',
        data: {
          room_num: room_num,
          to_friend_id: to_friend_id,
          type: 'friend'
        },
        success: function success(res) {
          if (res) {
            _this8.count = res.count;
            _this8.isAgent = res.is_agent;
            _this8.friend = res.to_friend;
            _this8.getChat();
            _this8.initSocket();
          }
        }
      });
    },
    getChat: function getChat() {
      var _this9 = this;
      (0, _request.request)({
        url: '/api/chat/chat_record',
        method: 'POST',
        data: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          room_num: this.roomId,
          to_friend_id: this.friendId,
          type: 'friend'
        },
        success: function success(res) {
          if (res) {
            var scrollTop = 0;
            var query = uni.createSelectorQuery().in(_this9);
            query.select('.message-list').boundingClientRect(function (data) {
              scrollTop = data.height;
            }).exec();
            _this9.messages = [].concat((0, _toConsumableArray2.default)(res.data.reverse()), (0, _toConsumableArray2.default)(_this9.messages));
            _this9.messages = _this9.messages.map(function (item, index) {
              return _objectSpread({
                newTime: _this9.formatTime(item.time),
                showTime: _this9.showTime(index)
              }, item);
            });
            setTimeout(function () {
              _this9.$nextTick(function () {
                var query = uni.createSelectorQuery().in(_this9);
                query.select('.message-list').boundingClientRect(function (data) {
                  _this9.scrollTop = data.height - scrollTop;
                }).exec();
              });
            }, 500);
          }
        }
      });
    },
    initSocket: function initSocket() {
      var _this10 = this;
      this.socketTask = uni.connectSocket({
        url: 'wss://niushop.yulongtianzi.com/ws',
        success: function success() {
          console.log('WebSocket 连接成功');
        },
        fail: function fail() {
          console.log('WebSocket 连接失败');
        }
      });
      this.socketTask.onOpen(function () {
        var message = {
          user_id: _this10.userInfo.member_id,
          type: 'login',
          room_id: _this10.roomId,
          user_name: _this10.userInfo.nickname,
          is_agent: _this10.isAgent
        };
        _this10.socketTask.send({
          data: JSON.stringify(message)
        });
      });
      this.socketTask.onMessage(function (res) {
        var data = JSON.parse(res.data);
        switch (data.type) {
          case 'login':
            var message = {
              user_id: _this10.userInfo.member_id,
              type: 'bild',
              room_id: _this10.roomId,
              user_name: _this10.userInfo.nickname,
              is_agent: _this10.isAgent
            };
            _this10.socketTask.send({
              data: JSON.stringify(message)
            });
            break;
          case 'say':
            _this10.messages.push(_objectSpread(_objectSpread({}, data), {}, {
              is_me: 0
            }));
            _this10.count++;
            _this10.scrollToBottom();
            break;
          case 'save':
            _this10.saveMessage(data);
            _this10.messages.push(_objectSpread(_objectSpread({}, data), {}, {
              is_me: 1
            }));
            if (!data.isonline && !data.is_agent) {
              _this10.isRobot = true;
              _this10.animationBuffer = '';
              if (_this10.animationTimer) {
                clearInterval(_this10.animationTimer);
                _this10.animationTimer = null;
              }
              _this10.isFinished = false;
              _this10.lastChunkContent = '';
              _this10.messages.push(_objectSpread(_objectSpread({}, data), {}, {
                is_me: 0,
                is_agent: 1,
                friend_name: _this10.userInfo.nickname,
                to_friend_id: data.user_id,
                user_id: data.to_friend_id,
                content: ''
              }));
              _this10.messageIndex = _this10.messages.length - 1;
              _this10.count += 2;
              _this10.scrollToBottom();
              var content = data.is_mold === 5 ? data.content.url : data.content;
              _this10.getAIResponse(content);
            } else {
              _this10.count++;
              _this10.scrollToBottom();
              _this10.isRobot = false;
            }
            break;
        }
        console.log('WebSocket 收到消息:', res.data);
      });
      this.socketTask.onError(function (err) {
        console.log('WebSocket 发生错误:', err);
      });
      // 监听 WebSocket 关闭事件
      this.socketTask.onClose(function () {
        console.log('WebSocket 连接关闭');
        _this10.initSocket();
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 276:
/*!**********************************************************************************************************!*\
  !*** /Users/zhulin/Documents/HBuilderProjects/AI/pagesB/chat/chat.vue?vue&type=style&index=0&lang=scss& ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./chat.vue?vue&type=style&index=0&lang=scss& */ 277);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_chat_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 277:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/zhulin/Documents/HBuilderProjects/AI/pagesB/chat/chat.vue?vue&type=style&index=0&lang=scss& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[270,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pagesB/chat/chat.js.map