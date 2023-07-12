import fetch from "node-fetch";
// fetch(
//   "https://api.sportradar.us/nhl/trial/v6/en/league/2023/07/12/transfers.json?api_key=pmg8cgm8cn8nbwdb6emtz55a"
// )
//   .then((response) => response.json()) // Extract JSON data from the response
//   .then((data) => {
//     // Handle the response data
//     console.log(data);
//   })
//   .catch((error) => {
//     // Handle any errors
//     console.error(error);
//});

async function getRandomUsers() {
  const res = await fetch(
    `https://api.sportradar.us/nhl/trial/v6/en/league/2023/07/10/transfers.json?api_key=pmg8cgm8cn8nbwdb6emtz55a`
  );
  const data = await res.json();
  return data;
}

getRandomUsers()
  .then((data) => {
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
  })
  .catch((error) => {
    console.error(error);
  });
