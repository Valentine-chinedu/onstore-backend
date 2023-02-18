"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const router = express_1.default.Router();
router.route('/').get(cartController_1.getCart);
router.route('/add').post(cartController_1.addToCart);
router.route('/remove').delete(cartController_1.removeFromCart);
router.route('/empty').delete(cartController_1.emptyCart);
router.route('/increase').put(cartController_1.increaseCartQty);
router.route('/decrease').put(cartController_1.decreaseCartQty);
exports.default = router;
