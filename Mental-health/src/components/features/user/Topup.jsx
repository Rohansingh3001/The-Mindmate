import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, ArrowLeft, Shield, Lock, Check, CreditCard, Sparkles, 
  Clock, TrendingUp, Zap, Award, Star, ChevronRight
} from "lucide-react";

const Topup = () => {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0.0");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [processingStep, setProcessingStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      id: 1,
      name: "Quick Chat",
      amount: 10,
      minutes: 20,
      icon: "⚡",
      badge: null,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      popular: false
    },
    {
      id: 2,
      name: "Best Value",
      amount: 25,
      minutes: 50,
      icon: "🔥",
      badge: "POPULAR",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      popular: true
    },
    {
      id: 3,
      name: "Premium",
      amount: 50,
      minutes: 100,
      icon: "💎",
      badge: null,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      popular: false
    },
    {
      id: 4,
      name: "Ultimate",
      amount: 100,
      minutes: 200,
      icon: "👑",
      badge: "BEST DEAL",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50",
      popular: false
    }
  ];

  useEffect(() => {
    const walletBalance = localStorage.getItem("wallet_balance") || "0.0";
    setBalance(walletBalance);
  }, []);

  const handleRecharge = async () => {
    if (!amount || parseFloat(amount) < 1) {
      toast.error("Please enter a valid amount (minimum ₹1)");
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }

    setLoading(true);

    const steps = [
      "Verifying payment details...",
      "Connecting to payment gateway...",
      "Processing payment...",
      "Updating wallet balance..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const prev = parseFloat(balance);
    const add = parseFloat(amount);
    const newBalance = (prev + add).toFixed(2);
    localStorage.setItem("wallet_balance", newBalance);
    window.dispatchEvent(new Event("walletUpdate"));
    
    setBalance(newBalance);
    setLoading(false);
    setProcessingStep(0);
    setShowSuccessModal(true);
    setAmount("");
    setUpiId("");
    
    toast.success(`₹${amount} added successfully!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back</span>
            </button>
            <div className="text-right">
              <div className="text-sm text-white/80">Current Balance</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                ₹{balance}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Recharge Your Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Choose a plan and start your therapy session
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">💬 ₹1 = 2 minutes of AI therapy</span>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan, index) => (
              <motion.button
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAmount(plan.amount.toString())}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  amount === plan.amount.toString()
                    ? `border-purple-500 bg-gradient-to-br ${plan.bgGradient} shadow-xl`
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
                } ${plan.popular ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold`}>
                    {plan.badge}
                  </div>
                )}
                <div className="text-4xl mb-3">{plan.icon}</div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{plan.name}</div>
                <div className={`text-4xl font-black mb-2 bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                  ₹{plan.amount}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {plan.minutes} minutes
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ₹{(plan.amount / plan.minutes).toFixed(2)}/min
                </div>
                {amount === plan.amount.toString() && (
                  <motion.div
                    layoutId="selectedPlan"
                    className="absolute inset-0 rounded-2xl border-2 border-purple-500 pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Details</h3>
              
              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Enter Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all"
                    min="1"
                  />
                </div>
                {amount && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    = {(parseFloat(amount) * 2).toFixed(0)} minutes of therapy
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === "upi"
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">📱</div>
                    <div className="font-semibold text-sm">UPI</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === "card"
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💳</div>
                    <div className="font-semibold text-sm">Card</div>
                  </button>
                </div>
              </div>

              {/* UPI Input */}
              {paymentMethod === "upi" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900"
                  />
                </motion.div>
              )}

              {/* Recharge Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRecharge}
                disabled={loading || !amount}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Recharge Now
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Current Balance</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{balance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Top-up Amount</span>
                  <span className="font-bold text-purple-600">+₹{amount || "0"}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">New Balance</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{amount ? (parseFloat(balance) + parseFloat(amount)).toFixed(2) : balance}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ≈ {amount ? ((parseFloat(balance) + parseFloat(amount)) * 2).toFixed(0) : (parseFloat(balance) * 2).toFixed(0)} mins
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-gray-900 dark:text-white">Secure Payment</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-600" />
                  256-bit SSL encryption
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-600" />
                  PCI DSS compliant
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-600" />
                  Instant activation
                </div>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Why Recharge?</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">24/7 AI Support</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Chat anytime, anywhere</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">Track Progress</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Monitor your mental health</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">Expert AI</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Trained on therapy techniques</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your wallet has been recharged successfully
              </p>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">New Balance</div>
                <div className="text-3xl font-bold text-purple-600">₹{balance}</div>
              </div>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(-1);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold"
              >
                Start Chatting
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Modal */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Processing Payment
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {processingStep === 1 && "Verifying payment details..."}
                {processingStep === 2 && "Connecting to payment gateway..."}
                {processingStep === 3 && "Processing payment..."}
                {processingStep === 4 && "Updating wallet balance..."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Topup;
