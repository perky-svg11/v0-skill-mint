import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      // App Name
      appName: "SkillMint",
      
      // Navigation
      home: "Home",
      dashboard: "Dashboard",
      plans: "Plans",
      profile: "Profile",
      admin: "Admin",
      
      // Authentication
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      email: "Email",
      password: "Password",
      username: "Username",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      
      // Dashboard
      balance: "Balance",
      totalEarnings: "Total Earnings",
      planLevel: "Plan Level",
      daysSinceSignup: "Days Since Signup",
      topUp: "Top-Up",
      withdraw: "Withdraw",
      bankInfo: "Bank Info",
      rulesInfo: "Rules & Info",
      planInfo: "Plan Info",
      resetPassword: "Reset Password",
      
      // Top-up
      topUpTitle: "Top-Up Your Account",
      amount: "Amount",
      uploadScreenshot: "Upload Screenshot",
      paymentProof: "Payment Proof",
      companyBankDetails: "Company Bank Account Details",
      bankName: "Bank Name",
      accountNumber: "Account Number",
      accountHolder: "Account Holder",
      submitTopUp: "Submit Top-Up Request",
      
      // Withdrawal
      withdrawTitle: "Withdraw Funds",
      selectBankAccount: "Select Bank Account",
      minimumWithdraw: "Minimum Withdrawal",
      withdrawalConditions: "Withdrawal Conditions",
      accountAge: "Account must be 7+ days old",
      planRequirement: "Must meet plan minimum balance",
      submitWithdraw: "Submit Withdrawal Request",
      
      // Bank Info
      bankInfoTitle: "Bank Information",
      ibanAccountNumber: "IBAN / Account Number",
      phoneNumber: "Phone Number",
      branchCode: "Branch Code",
      saveBankInfo: "Save Bank Information",
      
      // Referrals
      referralSystem: "Referral System",
      yourReferralLink: "Your Referral Link",
      referralBonus: "Referral Bonus",
      referrerBonus: "You get 80 PKR when referred user tops up",
      referredBonus: "Referred user gets 40 PKR bonus",
      referralMilestones: "Referral Milestones",
      referrals: "Referrals",
      bonus: "Bonus",
      
      // Plans
      plansTitle: "Subscription Plans",
      starter: "Starter",
      pro: "Pro",
      elite: "Elite",
      titan: "Titan",
      legend: "Legend",
      topUpRequired: "Top-Up Required",
      minWithdraw: "Min Withdraw",
      unlocked: "Unlocked",
      locked: "Locked",
      
      // Admin
      adminDashboard: "Admin Dashboard",
      users: "Users",
      topUpRequests: "Top-Up Requests",
      withdrawRequests: "Withdraw Requests",
      referralMonitor: "Referral Monitor",
      manualTools: "Manual Tools",
      adminLogs: "Admin Logs",
      accessGranted: "Access granted",
      
      // Status
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      paid: "Paid",
      
      // Actions
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      approve: "Approve",
      reject: "Reject",
      markAsPaid: "Mark as Paid",
      copy: "Copy",
      share: "Share",
      
      // Messages
      success: "Success",
      error: "Error",
      loading: "Loading...",
      noData: "No data available",
      comingSoon: "Coming Soon",
      
      // Currency
      pkr: "PKR",
      
      // Time
      daysAgo: "days ago",
      hoursAgo: "hours ago",
      minutesAgo: "minutes ago",
      justNow: "just now"
    }
  },
  ur: {
    translation: {
      // App Name
      appName: "سکل منٹ",
      
      // Navigation
      home: "ہوم",
      dashboard: "ڈیش بورڈ",
      plans: "پلانز",
      profile: "پروفائل",
      admin: "ایڈمن",
      
      // Authentication
      login: "لاگ ان",
      signup: "سائن اپ",
      logout: "لاگ آؤٹ",
      email: "ای میل",
      password: "پاس ورڈ",
      username: "صارف نام",
      confirmPassword: "پاس ورڈ کی تصدیق",
      forgotPassword: "پاس ورڈ بھول گئے؟",
      dontHaveAccount: "اکاؤنٹ نہیں ہے؟",
      alreadyHaveAccount: "پہلے سے اکاؤنٹ ہے؟",
      
      // Dashboard
      balance: "بیلنس",
      totalEarnings: "کل کمائی",
      planLevel: "پلان لیول",
      daysSinceSignup: "سائن اپ کے دن",
      topUp: "ٹاپ اپ",
      withdraw: "نکالیں",
      bankInfo: "بینک کی معلومات",
      rulesInfo: "قوانین اور معلومات",
      planInfo: "پلان کی معلومات",
      resetPassword: "پاس ورڈ ری سیٹ",
      
      // Top-up
      topUpTitle: "اپنا اکاؤنٹ ٹاپ اپ کریں",
      amount: "رقم",
      uploadScreenshot: "اسکرین شاٹ اپ لوڈ کریں",
      paymentProof: "ادائیگی کا ثبوت",
      companyBankDetails: "کمپنی بینک اکاؤنٹ کی تفصیلات",
      bankName: "بینک کا نام",
      accountNumber: "اکاؤنٹ نمبر",
      accountHolder: "اکاؤنٹ ہولڈر",
      submitTopUp: "ٹاپ اپ کی درخواست جمع کریں",
      
      // Withdrawal
      withdrawTitle: "رقم نکالیں",
      selectBankAccount: "بینک اکاؤنٹ منتخب کریں",
      minimumWithdraw: "کم سے کم نکلوانا",
      withdrawalConditions: "نکلوانے کی شرائط",
      accountAge: "اکاؤنٹ 7+ دن پرانا ہونا چاہیے",
      planRequirement: "پلان کا کم سے کم بیلنس ہونا چاہیے",
      submitWithdraw: "نکلوانے کی درخواست جمع کریں",
      
      // Bank Info
      bankInfoTitle: "بینک کی معلومات",
      ibanAccountNumber: "آئی بی اے این / اکاؤنٹ نمبر",
      phoneNumber: "فون نمبر",
      branchCode: "برانچ کوڈ",
      saveBankInfo: "بینک کی معلومات محفوظ کریں",
      
      // Referrals
      referralSystem: "ریفرل سسٹم",
      yourReferralLink: "آپ کا ریفرل لنک",
      referralBonus: "ریفرل بونس",
      referrerBonus: "جب ریفر شدہ صارف ٹاپ اپ کرے تو آپ کو 80 روپے ملتے ہیں",
      referredBonus: "ریفر شدہ صارف کو 40 روپے بونس ملتا ہے",
      referralMilestones: "ریفرل سنگ میل",
      referrals: "ریفرلز",
      bonus: "بونس",
      
      // Plans
      plansTitle: "سبسکرپشن پلانز",
      starter: "شروعاتی",
      pro: "پرو",
      elite: "ایلیٹ",
      titan: "ٹائٹن",
      legend: "لیجنڈ",
      topUpRequired: "ٹاپ اپ ضروری",
      minWithdraw: "کم سے کم نکلوانا",
      unlocked: "کھلا ہوا",
      locked: "بند",
      
      // Admin
      adminDashboard: "ایڈمن ڈیش بورڈ",
      users: "صارفین",
      topUpRequests: "ٹاپ اپ کی درخواستیں",
      withdrawRequests: "نکلوانے کی درخواستیں",
      referralMonitor: "ریفرل مانیٹر",
      manualTools: "دستی ٹولز",
      adminLogs: "ایڈمن لاگز",
      accessGranted: "رسائی دی گئی",
      
      // Status
      pending: "زیر التواء",
      approved: "منظور شدہ",
      rejected: "مسترد",
      paid: "ادا شدہ",
      
      // Actions
      submit: "جمع کریں",
      cancel: "منسوخ",
      save: "محفوظ کریں",
      edit: "ترمیم",
      delete: "حذف کریں",
      approve: "منظور کریں",
      reject: "مسترد کریں",
      markAsPaid: "ادا شدہ کے طور پر نشان زد کریں",
      copy: "کاپی",
      share: "شیئر",
      
      // Messages
      success: "کامیابی",
      error: "خرابی",
      loading: "لوڈ ہو رہا ہے...",
      noData: "کوئی ڈیٹا دستیاب نہیں",
      comingSoon: "جلد آ رہا ہے",
      
      // Currency
      pkr: "روپے",
      
      // Time
      daysAgo: "دن پہلے",
      hoursAgo: "گھنٹے پہلے",
      minutesAgo: "منٹ پہلے",
      justNow: "ابھی"
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    interpolation: {
      escapeValue: false
    }
  })

export default i18n

