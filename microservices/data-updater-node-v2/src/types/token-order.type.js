"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusEnum = exports.PriceTypeEnum = exports.OrderTypeEnum = void 0;
var OrderTypeEnum;
(function (OrderTypeEnum) {
    OrderTypeEnum["BUY"] = "buy";
    OrderTypeEnum["SELL"] = "sell";
})(OrderTypeEnum || (exports.OrderTypeEnum = OrderTypeEnum = {}));
var PriceTypeEnum;
(function (PriceTypeEnum) {
    PriceTypeEnum["SINGLE"] = "single";
    PriceTypeEnum["RANGE"] = "range";
})(PriceTypeEnum || (exports.PriceTypeEnum = PriceTypeEnum = {}));
var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum["ACTIVE"] = "Active";
    OrderStatusEnum["EXECUTED"] = "Executed";
    OrderStatusEnum["CANCELLED"] = "Cancelled";
})(OrderStatusEnum || (exports.OrderStatusEnum = OrderStatusEnum = {}));
