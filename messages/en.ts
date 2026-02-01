const en = {
  Sidebar: {
    dashboard: "Dashboard",
    diary: "Diary",
    foods: "Foods",
    profile: "Profile",
    signOut: "Sign Out"
  },
  Common: {
    loading: "Loading..."
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
    macros: {
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fats: "Fats"
    }
  }
} as const;

export default en;
