import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoShieldCheckmarkOutline, 
  IoLockClosedOutline, 
  IoCheckmarkCircle,
  IoCardOutline,
  IoWalletOutline,
  IoClose 
} from "react-icons/io5";
import logo from "../../../assets/logo.svg";
import upiIcon from "../../../assets/upi.png";
import cardIcon from "../../../assets/card.jpeg";
import bankIcon from "../../../assets/bank.jpeg";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";

const Topup = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0.0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [netBankingBank, setNetBankingBank] = useState("");
  const [cardType, setCardType] = useState("");
  const [processingStep, setProcessingStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date MM/YY
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? "/" + v.slice(2, 4) : "");
    }
    return v;
  };

  // Detect card type
  const detectCardType = (number) => {
    const num = number.replace(/\s/g, "");
    if (/^4/.test(num)) return "Visa";
    if (/^5[1-5]/.test(num)) return "Mastercard";
    if (/^3[47]/.test(num)) return "Amex";
    if (/^6/.test(num)) return "RuPay";
    return "";
  };

  // Generate transaction ID
  const generateTransactionId = () => {
    return "TXN" + Date.now() + Math.random().toString(36).substring(2, 9).toUpperCase();
  };

  useEffect(() => {
    const walletBalance = localStorage.getItem("wallet_balance") || "0.0";
    setBalance(walletBalance);
  }, []);

  useEffect(() => {
    if (card.number) {
      setCardType(detectCardType(card.number));
    }
  }, [card.number]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!amount || isNaN(amount) || Number(amount) < 1) {
      setError("Please enter a valid amount (minimum ₹1)");
      return;
    }
    if (paymentMethod === "upi" && !upiId) {
      setError("Please enter your UPI ID");
      return;
    }
    if (paymentMethod === "card" && (!card.number || !card.name || !card.expiry || !card.cvv)) {
      setError("Please fill all card details");
      return;
    }
    if (paymentMethod === "netbanking" && !netBankingBank) {
      setError("Please select your bank");
      return;
    }
    setLoading(true);

    // Realistic processing steps
    const steps = [
      "Verifying payment details...",
      "Connecting to payment gateway...",
      "Authenticating transaction...",
      "Processing payment...",
      "Updating wallet balance..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Add recharge amount to existing balance
    const prev = parseFloat(localStorage.getItem("wallet_balance") || "0");
    const add = parseFloat(amount);
    const newBalance = (prev + add).toFixed(2);
    localStorage.setItem("wallet_balance", newBalance);
    
    const txnId = generateTransactionId();
    setTransactionId(txnId);
    setBalance(newBalance);
    setLoading(false);
    setProcessingStep(0);
    setShowSuccessModal(true);
    
    toast.success(`₹${amount} added successfully!`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const processingSteps = [
    t('topup.verifying'),
    t('topup.connecting'),
    t('topup.authenticating'),
    t('topup.processingPayment'),
    t('topup.updatingBalance')
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-purple-50/30 px-3 sm:px-4 py-4 sm:py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Mobile-First Header */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white text-purple-600 font-semibold shadow-sm hover:shadow-md transition-all border border-gray-200 text-sm sm:text-base"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            {t('topup.back')}
          </button>
          <div className="text-right">
            <div className="text-xs sm:text-sm text-gray-600">Current Balance</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">₹{balance}</div>
          </div>
        </div>
        
        {/* Mobile-First Pricing Plans - Prominent Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
            Choose Your Plan
          </h2>
          <p className="text-sm text-gray-600 mb-4 sm:mb-6 text-center px-2">
            💬 ₹1 = 2 minutes of therapy chat • Instant activation
          </p>
          
          {/* Pricing Cards - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Plan 1 - Starter */}
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAmount("10")}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                amount === "10"
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="text-sm font-semibold text-gray-600 mb-2">Starter</div>
              <div className="text-3xl sm:text-4xl font-black text-purple-600 mb-2">₹10</div>
              <div className="text-sm text-gray-700 font-medium mb-3">20 minutes chat</div>
              <div className="text-xs text-gray-500">Perfect for quick sessions</div>
            </motion.button>

            {/* Plan 2 - Popular */}
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAmount("25")}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
                amount === "25"
                  ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-xl'
                  : 'border-pink-300 bg-gradient-to-br from-pink-50/50 to-purple-50/50 hover:border-pink-400'
              }`}
            >
              <div className="absolute top-2 right-2 bg-pink-500 text-white text-xxs font-bold px-2 py-0.5 rounded-full">
                POPULAR
              </div>
              <div className="text-sm font-semibold text-gray-600 mb-2">Value Pack</div>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">₹25</div>
              <div className="text-sm text-gray-700 font-medium mb-3">50 minutes chat</div>
              <div className="text-xs text-gray-500">Most popular choice</div>
            </motion.button>

            {/* Plan 3 - Premium */}
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAmount("50")}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                amount === "50"
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="text-sm font-semibold text-gray-600 mb-2">Premium</div>
              <div className="text-3xl sm:text-4xl font-black text-purple-600 mb-2">₹50</div>
              <div className="text-sm text-gray-700 font-medium mb-3">100 minutes chat</div>
              <div className="text-xs text-gray-500">Extended sessions</div>
            </motion.button>
          </div>
          
          {/* Custom Amount Input */}
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600 mb-2">Or enter custom amount</div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full max-w-xs mx-auto px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-center text-lg font-semibold"
              min="1"
            />
          </div>
        </motion.div>

        {/* Two Column Layout - Mobile Shows All */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Sidebar - Summary & Trust Indicators - Mobile First */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-2 md:order-1 md:col-span-1 space-y-4 sm:space-y-6"
          >
            {/* Payment Summary - Mobile Friendly */}
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <IoWalletOutline className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{t('topup.summary')}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('topup.currentBalance')}</span>
                  <span className="font-bold text-gray-900">₹{balance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('topup.topupAmount')}</span>
                  <span className="font-bold text-purple-600">+₹{amount || "0"}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{t('topup.newBalance')}</span>
                    <div className="text-right">
                      <div className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{amount ? (parseFloat(balance) + parseFloat(amount)).toFixed(2) : balance}
                      </div>
                      <div className="text-xs text-gray-500">
                        ≈ {amount ? ((parseFloat(balance) + parseFloat(amount)) * 2).toFixed(0) : (parseFloat(balance) * 2).toFixed(0)} mins
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Trust Badges - Compact */}
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 mb-3 sm:mb-4">{t('topup.securedPayment')}</h4>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <IoLockClosedOutline className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t('topup.sslEncryption')}</p>
                    <p className="text-xs text-gray-600">{t('topup.dataSecure')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <IoShieldCheckmarkOutline className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t('topup.pciCompliant')}</p>
                    <p className="text-xs text-gray-600">{t('topup.bankGrade')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <IoCheckmarkCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t('topup.rbiApproved')}</p>
                    <p className="text-xs text-gray-600">{t('topup.regulated')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Payment Form - Mobile Optimized */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-1 md:order-2 md:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 md:p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <img src={logo} alt="MindMates" className="h-6 w-6 sm:h-7 sm:w-7 rounded-full" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{t('topup.addMoney')}</h2>
                  <p className="text-xs sm:text-sm text-gray-600">{t('topup.chooseMethod')}</p>
                </div>
              </div>

              {/* Quick Add Amounts */}
              {/* Selected Amount Display */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                <div className="text-sm text-gray-600 mb-1">Selected Amount</div>
                <div className="text-3xl font-bold text-purple-600">₹{amount || "0"}</div>
                <div className="text-xs text-gray-500 mt-1">
                  ≈ {amount ? (Number(amount) * 2).toFixed(0) : "0"} minutes of therapy
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Payment Method Selection */}
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-3 block">{t('topup.paymentMethod')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      disabled={loading}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'upi' 
                          ? 'border-purple-600 bg-purple-50 shadow-lg' 
                          : 'border-purple-200 hover:border-purple-400 hover:bg-purple-50'
                      }`}
                    >
                      <img src={upiIcon} alt="UPI" className="w-8 h-8" />
                      <span className="text-sm font-bold text-gray-900">{t('topup.upi')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      disabled={loading}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'card' 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      <IoCardOutline className="w-8 h-8 text-slate-700 dark:text-slate-300" />
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      disabled={loading}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'netbanking' 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      <img src={bankIcon} alt="Net Banking" className="w-8 h-8" />
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Net Banking</span>
                    </button>
                  </div>
                </div>

                {/* Payment Details Forms */}
                <AnimatePresence mode="wait">
                  {paymentMethod === "upi" && (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="upiId" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                          {t('topup.upiId')}
                        </label>
                        <input
                          id="upiId"
                          type="text"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          placeholder="yourname@bank"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all"
                          disabled={loading}
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "card" && (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="cardNumber" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                          {t('topup.cardNumber')} {cardType && <span className="text-indigo-600 font-semibold">({cardType})</span>}
                        </label>
                        <input
                          id="cardNumber"
                          type="text"
                          value={card.number}
                          onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all"
                          disabled={loading}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cardName" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                          {t('topup.cardholderName')}
                        </label>
                        <input
                          id="cardName"
                          type="text"
                          value={card.name}
                          onChange={e => setCard({ ...card, name: e.target.value.toUpperCase() })}
                          placeholder="JOHN DOE"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all uppercase"
                          disabled={loading}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardExpiry" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            {t('topup.expiryDate')}
                          </label>
                          <input
                            id="cardExpiry"
                            type="text"
                            value={card.expiry}
                            onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all"
                            disabled={loading}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="cardCvv" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            {t('topup.cvv')}
                          </label>
                          <input
                            id="cardCvv"
                            type="password"
                            value={card.cvv}
                            onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })}
                            placeholder="123"
                            maxLength="4"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all"
                            disabled={loading}
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <motion.div
                      key="netbanking"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="bank" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                          {t('topup.selectBank')}
                        </label>
                        <select
                          id="bank"
                          value={netBankingBank}
                          onChange={e => setNetBankingBank(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all"
                          disabled={loading}
                          required
                        >
                          <option value="">{t('topup.chooseBank')}</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="axis">Axis Bank</option>
                          <option value="pnb">Punjab National Bank</option>
                          <option value="bob">Bank of Baroda</option>
                          <option value="kotak">Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Processing Steps */}
                {loading && processingStep > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                        {processingSteps[processingStep - 1]}
                      </p>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(processingStep / 5) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-2 bg-indigo-600 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Submit Button - Mobile-First */}
                <motion.button
                  type="submit"
                  disabled={loading || !amount || parseFloat(amount) < 1}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 sm:py-5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('topup.processing')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <IoCardOutline className="w-5 h-5" />
                      <span>{t('topup.pay')} ₹{amount || "0"}</span>
                    </div>
                  )}
                </motion.button>

                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  {t('topup.termsAgree')}
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoCheckmarkCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('topup.success')}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">₹{amount} {t('topup.addedToWallet')}</p>
                
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{t('topup.transactionId')}</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{transactionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{t('topup.amount')}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">₹{amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{t('topup.newBalance')}</span>
                    <span className="font-semibold text-indigo-600">₹{balance}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/user");
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
                >
                  {t('topup.goToDashboard')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Topup;
