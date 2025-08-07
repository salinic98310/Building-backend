const Fundraiser = require("../../models/Fundraiser.js");
const User = require("../../models/userSchema.js");

const AdminDashboard = async (req, res) => {
  try {
    console.log("Admin Dashboard Hit ✅"); 
    const totalUsers = await User.countDocuments();
    const totalFundraisers = await Fundraiser.countDocuments();

    const fundraisers = await Fundraiser.find({})
      .populate("userId", "email") // populate email from user
      .sort({ createdAt: -1 });

    let totalInvestment = 0;
    let totalMoneyRaised = 0;
    let recentFundraisers = [];
    const monthlyRaisedMap = {};
    const fundraiserRaisedMap = {};

    fundraisers.forEach((fundraiser) => {
      const { projectTitle, createdAt, userId, investors = [] } = fundraiser;

      // Calculate total investment and money raised
      investors.forEach((investor) => {
        const amount = (investor.moneyToRaise || 0) * (investor.quantity || 1);
        totalInvestment += 1;
        totalMoneyRaised += amount;

        // Aggregate by fundraiser title
        if (projectTitle) {
          fundraiserRaisedMap[projectTitle] = (fundraiserRaisedMap[projectTitle] || 0) + amount;
        }

        // Aggregate by month
        const monthKey = new Date(createdAt).toLocaleString("default", { month: "short", year: "numeric" });
        monthlyRaisedMap[monthKey] = (monthlyRaisedMap[monthKey] || 0) + amount;
      });

      // Push recent fundraiser info
      recentFundraisers.push({
        _id: fundraiser._id,
        projectTitle: projectTitle || "Untitled",
        email: userId?.email || "Unknown",
        createdAt,
      });
    });

    // Sort and slice recent fundraisers
    recentFundraisers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    recentFundraisers = recentFundraisers.slice(0, 5);

    // Convert monthlyRaisedMap to array
    const monthlyRaised = Object.entries(monthlyRaisedMap).map(([month, raised]) => ({
      month,
      raised,
    }));

    // Top fundraisers sorted by total raised amount
    const topFundraisers = Object.entries(fundraiserRaisedMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, amount]) => ({ projectTitle: title, moneyRaised: amount }))

    res.status(200).json({
      stats: {
        totalUsers,
        totalFundraisers,
        totalInvestment,
        totalMoneyRaised: totalMoneyRaised,
        recentFundraisers,
        monthlyRaised,
        topFundraisers: topFundraisers.map(({ projectTitle, moneyRaised }) => ({
          projectTitle,
          moneyRaised,
        })),
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({ error: "Server error while fetching admin stats." });
  }
};

module.exports = { AdminDashboard };
