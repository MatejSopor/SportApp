import fetch from "node-fetch";
import cron from "node-cron";
import nodemailer from "nodemailer";

// Function to fetch data from the API
async function fetchData() {
  const res = await fetch(
    `https://api.sportradar.us/nhl/trial/v6/en/league/2023/07/13/transfers.json?api_key=pmg8cgm8cn8nbwdb6emtz55a`
  );
  const data = await res.json();
  return data;
}

// Function to send an email
async function sendEmail(data) {
  // Configure the email transporter
  const transporter = nodemailer.createTransport({
    // Configure your email provider details here
    host: "gmail",
    auth: {
      user: "@gmail.com",
      pass: "lzeazsdyeflvlxys",
    },
  });

  // Compose the email message
  const message = {
    from: "@gmail.com",
    to: "@gmail.com",
    subject: "New Data from API",
    text: JSON.stringify(data),
  };

  // Send the email
  const info = await transporter.sendMail(message);
  console.log("Email sent:", info.messageId);
}

// Schedule the task to run every hour
cron.schedule("0 * * * *", async () => {
  try {
    // Fetch the data from the API
    const data = await fetchData();

    // Check if there are new data (based on your criteria)
    // For example, compare with the previous data you stored

    // If there are new data, send an email
    // You can modify the condition based on your specific criteria
    if (data && data.players && data.players.length > 0) {
      const trades = [];
      const signings = [];

      data.players.forEach((player) => {
        player.transfers.forEach((transfer) => {
          const desc = transfer.desc;
          const toTeam = transfer.to_team;
          const fromTeam = transfer.from_team;

          if (toTeam && fromTeam) {
            trades.push(desc);
          } else if (desc && !(toTeam && fromTeam)) {
            signings.push(desc);
          }
        });
      });

      if (trades.length > 0) {
        console.log("Trades:");
        console.log(trades.join("\n"));
      }
      if (signings.length > 0) {
        console.log("Changes:");
        console.log(signings.join("\n"));
      }

      // Send email with the new data
      await sendEmail(data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
