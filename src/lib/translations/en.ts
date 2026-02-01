const en = {
  Sidebar: {
    dashboard: "Dashboard",
    diary: "Diary",
    foods: "Foods",
    profile: "Profile",
    features: "Features",
    about: "About",
    signOut: "Sign Out"
  },
  Common: {
    loading: "Loading..."
  },
  Landing: {
    title: "InsightEats",
    description: "Track your nutrition with AI-powered food analysis",
    signIn: "Sign In",
    getStarted: "Get Started",
    goToDashboard: "Go to Dashboard",
    copyright: "© 2026 InsightEats. All rights reserved."
  },
  Camera: {
    takePhoto: "Take Photo",
    uploadFromGallery: "Upload from Gallery",
    cancel: "Cancel",
    capture: "Capture"
  },
  Features: {
    title: "Features",
    description: "Discover what InsightEats can do for you",
    backToApp: "Back to App",
    mission: {
      title: "Our Mission",
      content: "To help people make healthier food choices through intelligent technology."
    },
    technologies: {
      title: "Technologies",
      description: "Powered by advanced AI and machine learning"
    },
    version: "Version",
    smartTracking: {
      title: "Smart Tracking",
      description: "Track your meals with AI-powered food recognition"
    },
    detailedInsights: {
      title: "Detailed Insights",
      description: "Get comprehensive nutritional analysis and progress tracking"
    },
    globalDatabase: {
      title: "Global Database",
      description: "Access millions of foods from Open Food Facts and USDA databases"
    },
    quickEasy: {
      title: "Quick & Easy",
      description: "Log your meals in seconds with our intuitive interface"
    }
  },
  About: {
    title: "About InsightEats & Iterio Tech",
    backToApp: "Back to App",
    presentation: {
      title: "Iterio Tech | Project Presentation",
      paragraph1: "Iterio Tech is a cutting-edge software development initiative dedicated to bridging gap between complex data and daily human experience. We specialize in crafting intuitive, high-performance digital solutions that empower users to take control of their personal growth and well-being.",
      paragraph2: "At core of our philosophy is the belief that technology should be a quiet enabler—providing clarity without complexity. With projects like InsightEats, we leverage modern full-stack architectures to transform nutritional tracking into a seamless, insightful journey.",
      paragraph3: "Iterio Tech is committed to building tools that are not just functional, but essential for a data-driven, healthier future."
    },
    mission: "Our mission is to empower individuals with clear, data-driven insights to make better lifestyle choices.",
    contact: {
      title: "Contact",
      intro: "Have questions or suggestions? Reach out to us. We are always open to collaboration, feedback, or inquiries regarding our projects. Feel free to connect with our team:",
      emailLabel: "Email: ",
      tagline: "Iterio Tech – Simplifying complexity, one line of code at a time."
    },
    footer: {
      copyright: "© {year} Iterio Tech"
    }
  },
  Dashboard: {
    toasts: {
      weightLogged: "Weight logged successfully",
      weightError: "Error logging weight"
    },
    title: "Dashboard",
    subtitle: "Track your progress and nutrition",
    weightEvolution: "Weight Evolution",
    last7Days: "7D",
    last30Days: "30D",
    last90Days: "90D",
    lastYear: "1Y",
    logWeight: "Log Weight",
    smartFoodSearch: "Smart Food Search",
    quickTip: "Quick Tip",
    tipContent: "Consistency is key to reaching your health goals. Log your meals daily!",
    loadingChart: "Loading chart...",
    noWeightData: "No weight data available",
    rangeStart: "Start",
    rangeCurrent: "Current",
    rangeChange: "Change",
    weightInputLabel: "Weight (kg)",
    weightInputPlaceholder: "Enter your weight",
    saving: "Saving...",
    logAction: "Log"
  },
  Profile: {
    toasts: {
      success: "Profile updated successfully",
      error: "Error updating profile"
    },
    title: "Profile",
    user_info: "User Information",
    subtitle: "Manage your personal information and goals",
    form: {
      age: "Age",
      weight: "Weight (kg)",
      height: "Height (cm)",
      sex: "Sex",
      male: "Male",
      female: "Female",
      activityLevel: "Activity Level",
      activityOptions: {
        sedentary: "Sedentary (little or no exercise)",
        light: "Lightly active (1-3 days/week)",
        moderate: "Moderately active (3-5 days/week)",
        active: "Active (6-7 days/week)",
        very_active: "Very active (physical job or 2x training)"
      },
      saving: "Saving...",
      saveGoals: "Save Goals"
    },
    dailyTargets: "Daily Targets",
    fillDetails: "Fill in your details to calculate your daily targets"
  },
  FoodVision: {
    title: "Analyze Food with AI",
    description: "Take a photo or upload an image of your meal and let AI identify the foods and estimate nutritional values.",
    analyzing: "Analyzing image...",
    analysisError: "Error analyzing image",
    aiSummary: "AI Summary",
    confidence: {
      high: "High",
      medium: "Medium",
      low: "Low"
    },
    search: "Search",
    searchingFor: "Searching for",
    foodAdded: "Food added to diary successfully!",
    errorAdding: "Error adding food to diary",
    close: "Close",
    addToDiary: "Add to Diary"
  },
  Diary: {
    title: "Food Diary",
    subtitle: "Track your meals and monitor your nutrition",
    addToDiary: "Add to Diary",
    todayLog: "Today's Log",
    noLogsToday: "No food logged today yet",
    logDeleted: "Entry deleted successfully",
    deleteError: "Error deleting entry",
    deleteLog: "Delete entry"
  },
  Foods: {
    title: "Foods Library",
    subtitle: "Manage your food database and add new items",
    addNewFood: "Add New Food",
    searchDescription: "Search for foods in external databases or add your own",
    yourLibrary: "Your Food Library",
    filterLibrary: "Filter foods...",
    emptyLibrary: "No foods in your library yet",
    headers: {
      name: "Name",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fat"
    }
  },
  FoodSearch: {
    placeholder: "Search for a food...",
    externalResults: "External Results",
    searchingExternal: "Searching external sources...",
    noResults: "No results found",
    addFood: "Add Food",
    quantityGrams: "Quantity (grams)",
    cancel: "Cancel",
    addToDiary: "Add to Diary",
    alreadyInDb: "Food already in database",
    addedToDb: "Food added to database",
    mealRecorded: "Meal recorded successfully!"
  },
  DailyProgress: {
    today: "Today",
    basedOnTargets: "Based on your targets",
    setGoals: "Set your goals",
    date: "Date",
    previous: "Previous",
    next: "Next",
    target: "Target",
    macros: {
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fats: "Fats",
      fiber: "Fiber"
    }
  }
} as const;

export default en;
