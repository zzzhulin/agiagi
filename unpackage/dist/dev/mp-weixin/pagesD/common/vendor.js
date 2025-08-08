(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pagesD/common/vendor"],{

/***/ 545:
/*!******************************************************************!*\
  !*** /Users/zhulin/Documents/HBuilderProjects/AI/mixins/cart.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 30));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 32));
var _cart = __webpack_require__(/*! @/services/cart */ 546);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var _default = {
  data: function data() {
    return {
      goodsList: [],
      counts: [],
      loaded: false,
      selected: [],
      selectAll: false,
      loadingCart: false
    };
  },
  computed: {
    totalPrice: function totalPrice() {
      var _this = this;
      return this.goodsList.reduce(function (acc, g, idx) {
        return _this.selected[idx] ? acc + g.price * _this.counts[idx] : acc;
      }, 0).toFixed(2);
    }
  },
  methods: {
    navigateTo: function navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    },
    initCart: function initCart(userId, text) {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var recs, ids, qtys, skuList, cart;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this2.loadingCart = true;
                _context.prev = 1;
                _context.next = 4;
                return (0, _cart.fetchRecommendedProducts)(userId, text);
              case 4:
                recs = _context.sent;
                ids = recs.map(function (r) {
                  return r.product.id;
                });
                qtys = recs.map(function (r) {
                  return r.recommended_quantity || 1;
                }); // 2. 拿 SKU 详情
                _context.next = 9;
                return (0, _cart.fetchGoodsSkuPage)(ids);
              case 9:
                skuList = _context.sent;
                _context.next = 12;
                return (0, _cart.fetchCartList)();
              case 12:
                cart = _context.sent;
                _context.next = 15;
                return Promise.all(skuList.map(function (sku, i) {
                  if (!cart.some(function (ci) {
                    return ci.sku_id === sku.sku_id;
                  })) {
                    return (0, _cart.addCartItem)(sku.sku_id, qtys[i]);
                  }
                  return Promise.resolve();
                }));
              case 15:
                if (cart.length) {
                  _context.next = 19;
                  break;
                }
                _context.next = 18;
                return (0, _cart.fetchCartList)();
              case 18:
                cart = _context.sent;
              case 19:
                // 6. 合并并赋值
                _this2.goodsList = cart.map(function (item) {
                  var info = skuList.find(function (s) {
                    return s.sku_id === item.sku_id;
                  }) || {};
                  return _objectSpread(_objectSpread({}, item), info);
                });
                _this2.counts = _this2.goodsList.map(function (i) {
                  return i.num || 1;
                });
                _this2.selected = _this2.goodsList.map(function () {
                  return false;
                });
                _this2.selectAll = false;
                _this2.loaded = true;
                _context.next = 29;
                break;
              case 26:
                _context.prev = 26;
                _context.t0 = _context["catch"](1);
                uni.showToast({
                  title: _context.t0.message || '购物车加载失败',
                  icon: 'none'
                });
              case 29:
                _context.prev = 29;
                _this2.loadingCart = false;
                return _context.finish(29);
              case 32:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 26, 29, 32]]);
      }))();
    },
    toggleSelect: function toggleSelect(idx) {
      this.$set(this.selected, idx, !this.selected[idx]);
      this.selectAll = this.selected.every(function (v) {
        return v;
      });
    },
    toggleSelectAll: function toggleSelectAll() {
      var flag = !this.selectAll;
      this.selectAll = flag;
      this.selected = this.goodsList.map(function () {
        return flag;
      });
    },
    changeCount: function changeCount(type, idx) {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var item, cur, next;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                item = _this3.goodsList[idx];
                cur = _this3.counts[idx];
                if (!(type === 'minus')) {
                  _context3.next = 9;
                  break;
                }
                if (!(cur === 1)) {
                  _context3.next = 6;
                  break;
                }
                uni.showModal({
                  title: '提示',
                  content: '确定删除该商品吗',
                  success: function () {
                    var _success = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(res) {
                      return _regenerator.default.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              if (!res.confirm) {
                                _context2.next = 7;
                                break;
                              }
                              _context2.next = 3;
                              return (0, _cart.removeCartItem)(item.cart_id);
                            case 3:
                              _this3.goodsList.splice(idx, 1);
                              _this3.counts.splice(idx, 1);
                              _this3.selected.splice(idx, 1);
                              _this3.selectAll = _this3.selected.every(function (v) {
                                return v;
                              });
                            case 7:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    }));
                    function success(_x) {
                      return _success.apply(this, arguments);
                    }
                    return success;
                  }()
                });
                return _context3.abrupt("return");
              case 6:
                next = cur - 1;
                _context3.next = 10;
                break;
              case 9:
                next = Math.min(cur + 1, item.stock || 1);
              case 10:
                _this3.$set(_this3.counts, idx, next);
                _context3.next = 13;
                return (0, _cart.updateCartItem)(item.cart_id, next);
              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    checkout: function checkout() {
      var _this4 = this;
      var chosen = this.selected.map(function (v, i) {
        return v ? _this4.goodsList[i].cart_id : null;
      }).filter(Boolean).join(',');
      if (!chosen) {
        uni.showToast({
          title: '请先选择商品',
          icon: 'none'
        });
        return;
      }
      uni.redirectTo({
        url: "/pagesD/settlement/settlement?cartIds=".concat(chosen)
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 546:
/*!********************************************************************!*\
  !*** /Users/zhulin/Documents/HBuilderProjects/AI/services/cart.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCartItem = addCartItem;
exports.fetchCartList = fetchCartList;
exports.fetchGoodsSkuPage = fetchGoodsSkuPage;
exports.fetchRecommendedProducts = fetchRecommendedProducts;
exports.removeCartItem = removeCartItem;
exports.updateCartItem = updateCartItem;
var _request = __webpack_require__(/*! @/utils/request */ 34);
// src/services/cart.js

function fetchRecommendedProducts(userId, text) {
  return new Promise(function (resolve, reject) {
    (0, _request.request)({
      url: '/api/v2/product-ai-recommend/recommended',
      data: {
        user_id: userId,
        text: text
      },
      isRobot: true,
      success: function success(res) {
        if (res && res.recommended_products) {
          resolve(res.recommended_products);
        } else {
          resolve([]);
        }
      },
      fail: function fail(err) {
        return reject(err);
      }
    });
  });
}
function fetchGoodsSkuPage(goodsIdArr) {
  return new Promise(function (resolve, reject) {
    (0, _request.request)({
      url: '/api/Goodssku/page',
      method: 'POST',
      data: {
        goods_id_arr: goodsIdArr
      },
      success: function success(res) {
        resolve(res && res.list ? res.list : []);
      },
      fail: function fail(err) {
        return reject(err);
      }
    });
  });
}
function fetchCartList() {
  return new Promise(function (resolve, reject) {
    (0, _request.request)({
      url: '/api/cart/goodsLists',
      method: 'POST',
      success: function success(res) {
        return resolve(res || []);
      },
      fail: function fail(err) {
        return reject(err);
      }
    });
  });
}
function addCartItem(sku_id, num) {
  return new Promise(function (resolve, reject) {
    (0, _request.request)({
      url: '/api/cart/add',
      method: 'POST',
      data: {
        sku_id: sku_id,
        num: num
      },
      success: resolve,
      fail: reject
    });
  });
}
function updateCartItem(cart_id, num) {
  return new Promise(function (resolve, reject) {
    (0, _request.request)({
      url: '/api/cart/edit',
      method: 'POST',
      data: {
        cart_id: cart_id,
        num: num
      },
      success: resolve,
      fail: reject
    });
  });
}
function removeCartItem(cart_id) {
  return new Promise(function (resolve, reject) {
    (0, _request.request)({
      url: '/api/cart/delete',
      method: 'POST',
      data: {
        cart_id: cart_id
      },
      success: resolve,
      fail: reject
    });
  });
}

/***/ })

}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pagesD/common/vendor.js.map