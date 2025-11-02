import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";
import upiIcon from "../assets/upi.png";
import cardIcon from "../assets/card.jpeg";
import bankIcon from "../assets/bank.jpeg";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoShieldCheckmarkOutline, 
  IoLockClosedOutline, 
  IoCheckmarkCircle,
  IoArrowBack,
  IoClose,
  IoCardOutline,
  IoWalletOutline
} from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";

const Topup = () => {
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

  useEffect(() => {
    const walletBalance = localStorage.getItem("wallet_balance") || "0.0";
    setBalance(walletBalance);
  }, []);

  // Detect card type based on card number
  useEffect(() => {
    const number = card.number.replace(/\s/g, '');
    if (number.startsWith('4')) {
      setCardType('visa');
    } else if (number.startsWith('5') || number.startsWith('2')) {
      setCardType('mastercard');
    } else if (number.startsWith('3')) {
      setCardType('amex');
    } else if (number.startsWith('6')) {
      setCardType('rupay');
    } else {
      setCardType('');
    }
  }, [card.number]);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  // Generate transaction ID
  const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

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
    setProcessingStep(0);

    // Simulate realistic payment processing steps
    const steps = [
      { step: 0, message: "Initiating payment...", delay: 800 },
      { step: 1, message: "Verifying payment details...", delay: 1000 },
      { step: 2, message: "Connecting to payment gateway...", delay: 1200 },
      { step: 3, message: "Processing transaction...", delay: 1000 },
      { step: 4, message: "Confirming payment...", delay: 800 }
    ];

    for (const { step, delay } of steps) {
      await new Promise(resolve => setTimeout(resolve, delay));
      setProcessingStep(step + 1);
    }

    // Complete payment
    const prev = parseFloat(localStorage.getItem("wallet_balance") || "0");
    const add = parseFloat(amount);
    const newBalance = (prev + add).toFixed(2);
    localStorage.setItem("wallet_balance", newBalance);
    setBalance(newBalance);
    
    const txnId = generateTransactionId();
    setTransactionId(txnId);
    setLoading(false);
    setShowSuccessModal(true);
    
    // Dispatch wallet update event
    window.dispatchEvent(new Event("walletUpdate"));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setTimeout(() => navigate("/user"), 500);
  };

  const processingSteps = [
    "Initiating payment...",
    "Verifying details...",
    "Connecting to gateway...",
    "Processing transaction...",
    "Confirming payment..."
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header with back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all"
        >
          <IoArrowBack className="text-xl" />
          Back
        </motion.button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Payment Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 h-fit sticky top-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="MindMates" className="h-10 w-10 rounded-lg" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">The MindMates</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Secure Payment</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-sm text-slate-600 dark:text-slate-400">Current Balance</span>
                <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">₹{balance}</span>
              </div>

              {amount && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 rounded-xl border border-indigo-200 dark:border-indigo-800"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Top-up Amount</span>
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹{amount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-indigo-200 dark:border-indigo-800">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">New Balance</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ₹{(parseFloat(balance) + parseFloat(amount)).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Security Badges */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
                  <IoShieldCheckmarkOutline className="text-green-600 text-lg" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
                  <IoLockClosedOutline className="text-green-600 text-lg" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <IoCheckmarkCircle className="text-green-600 text-lg" />
                  <span>RBI Approved Gateway</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center italic">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Payment Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 border border-slate-200 dark:border-slate-700"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Complete Payment</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose your preferred payment method</p>

            {/* Quick Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Select Amount or Enter Custom
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
                {[10, 20, 50, 80, 100, 150, 200].map((amt) => (
                  <motion.button
                    key={amt}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                      Number(amount) === amt
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                    onClick={() => setAmount(amt.toString())}
                    disabled={loading}
                  >
                    ₹{amt}
                  </motion.button>
                ))}
              </div>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">₹</span>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"
>
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    disabled={loading}
                    className="sr-only"
                  />
                  <img src={upiIcon} alt="UPI" className="w-8 h-8 object-contain" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white">UPI</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">GPay, PhonePe, Paytm</div>
                  </div>
                  {paymentMethod === 'upi' && (
                    <IoCheckmarkCircle className="text-indigo-600 text-xl absolute top-2 right-2" />
                  )}
                </motion.label>

                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    disabled={loading}
                    className="sr-only"
                  />
                  <IoCardOutline className="w-8 h-8 text-slate-700 dark:text-slate-300" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white">Card</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Debit/Credit Card</div>
                  </div>
                  {paymentMethod === 'card' && (
                    <IoCheckmarkCircle className="text-indigo-600 text-xl absolute top-2 right-2" />
                  )}
                </motion.label>

                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    disabled={loading}
                    className="sr-only"
                  />
                  <img src={bankIcon} alt="Net Banking" className="w-8 h-8 object-contain" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white">Net Banking</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">All Banks</div>
                  </div>
                  {paymentMethod === 'netbanking' && (
                    <IoCheckmarkCircle className="text-indigo-600 text-xl absolute top-2 right-2" />
                  )}
                </motion.label>
              </div>
            </div>

            {/* Payment Method Details */}
            <form onSubmit={handleSubmit} className="space-y-6">
                  <img src={cardIcon} alt="Card" className="w-6 h-6" />
                  <span className="font-medium text-gray-700 dark:text-gray-100">Card</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl border-2 ${paymentMethod === 'netbanking' ? 'border-purple-500 bg-purple-50 dark:bg-[#39396a]' : 'border-gray-300 dark:border-[#39396a]'}`}>
                  <input type="radio" name="paymentMethod" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} disabled={loading} />
                  <img src={bankIcon} alt="Net Banking" className="w-6 h-6" />
                  <span className="font-medium text-gray-700 dark:text-gray-100">Net Banking</span>
                </label>
              </div>
            </div>
            {/* Payment Inputs */}
            {paymentMethod === "upi" && (
              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="upiId" className="text-sm font-medium text-gray-700 dark:text-gray-200">UPI ID</label>
                <input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="yourname@bank"
                  className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                  disabled={loading}
                  required
                />
              </div>
            )}
            {paymentMethod === "card" && (
              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 dark:text-gray-200">Card Number</label>
                <input
                  id="cardNumber"
                  type="text"
                  maxLength={19}
                  value={card.number}
                  onChange={e => setCard({ ...card, number: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                  disabled={loading}
                  required
                />
                <label htmlFor="cardName" className="text-sm font-medium text-gray-700 dark:text-gray-200">Name on Card</label>
                <input
                  id="cardName"
                  type="text"
                  value={card.name}
                  onChange={e => setCard({ ...card, name: e.target.value })}
                  placeholder="Cardholder Name"
                  className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                  disabled={loading}
                  required
                />
                <div className="flex gap-2">
                  <div className="flex flex-col flex-1">
                    <label htmlFor="cardExpiry" className="text-sm font-medium text-gray-700 dark:text-gray-200">Expiry</label>
                    <input
                      id="cardExpiry"
                      type="text"
                      maxLength={5}
                      value={card.expiry}
                      onChange={e => setCard({ ...card, expiry: e.target.value })}
                      placeholder="MM/YY"
                      className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label htmlFor="cardCvv" className="text-sm font-medium text-gray-700 dark:text-gray-200">CVV</label>
                    <input
                      id="cardCvv"
                      type="password"
                      maxLength={4}
                      value={card.cvv}
                      onChange={e => setCard({ ...card, cvv: e.target.value })}
                      placeholder="123"
                      className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            {paymentMethod === "netbanking" && (
              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="bankSelect" className="text-sm font-medium text-gray-700 dark:text-gray-200">Select Bank</label>
                <select
                  id="bankSelect"
                  value={netBankingBank}
                  onChange={e => setNetBankingBank(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300 dark:border-[#39396a] focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-gray-100 transition-all focus:shadow"
                  disabled={loading}
                  required
                >
                  <option value="">Choose your bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="Axis">Axis Bank</option>
                </select>
              </div>
            )}
            {error && <div className="text-red-500 text-sm font-semibold text-center mt-2">{error}</div>}
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 hover:from-purple-800 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all text-lg tracking-wide disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><circle cx="11" cy="11" r="10" /></svg>Processing...</span>
              ) : (
                "Recharge Now"
              )}
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500 italic">Simulated payment gateway • Not a real transaction</div>
        </div>
      </div>
    </div>
  );
};

export default Topup;
