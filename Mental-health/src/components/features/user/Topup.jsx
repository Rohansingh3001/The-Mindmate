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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-mindmate-50 via-white to-lavender-100/50 px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-purple-600 font-bold shadow-lg hover:shadow-xl transition-all border border-purple-200"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          {t('topup.back')}
        </button>
        
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Sidebar - Summary & Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1 space-y-6"
          >
            {/* Payment Summary */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <IoWalletOutline className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">{t('topup.summary')}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('topup.currentBalance')}</span>
                  <span className="font-bold text-gray-900">₹{balance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('topup.topupAmount')}</span>
                  <span className="font-bold text-purple-600">₹{amount || "0"}</span>
                </div>
                <div className="border-t border-purple-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">{t('topup.newBalance')}</span>
                    <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹{amount ? (parseFloat(balance) + parseFloat(amount)).toFixed(2) : balance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Trust Badges */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-purple-200">
              <h4 className="text-sm font-bold text-gray-900 mb-4">{t('topup.securedPayment')}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <IoLockClosedOutline className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t('topup.sslEncryption')}</p>
                    <p className="text-xs text-gray-600">{t('topup.dataSecure')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IoShieldCheckmarkOutline className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t('topup.pciCompliant')}</p>
                    <p className="text-xs text-gray-600">{t('topup.bankGrade')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IoCheckmarkCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t('topup.rbiApproved')}</p>
                    <p className="text-xs text-gray-600">{t('topup.regulated')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Payment Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="MindMates" className="h-10 w-10 rounded-full shadow-md" />
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{t('topup.addMoney')}</h2>
                  <p className="text-sm text-gray-600">{t('topup.chooseMethod')}</p>
                </div>
              </div>

              {/* Quick Add Amounts */}
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-900 mb-2 block">{t('topup.quickSelect')}</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 50, 100, 200, 500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`px-4 py-3 rounded-xl border-2 font-bold transition-all ${
                        Number(amount) === amt 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-lg' 
                          : 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-100'
                      }`}
                      onClick={() => setAmount(amt.toString())}
                      disabled={loading}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Custom Amount Input */}
                <div>
                  <label htmlFor="amount" className="text-sm font-bold text-gray-900 mb-2 block">
                    {t('topup.customAmount')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 font-bold">₹</span>
                    <input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder={t('topup.enterAmount')}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-purple-50 text-gray-900 transition-all font-semibold"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
                >
                  {loading ? t('topup.processing') : `${t('topup.pay')} ₹${amount || "0"}`}
                </button>

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
