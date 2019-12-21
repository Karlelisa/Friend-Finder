//Cited: HotRestaurant class ativity
// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

let friendsData = require("../data/friends");



// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function (req, res) {
    res.json(friendsData);
  });



  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  // app.post("/api/friends", function (req, res) {
  // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
  // It will do this by sending out the value "true" have a table
  // req.body is available since we're using the body parsing middleware
  //   if (friendsData.length < 5) {
  //     friendsData.push(req.body);
  //     res.json(true);
  //   }
  // });

  //   Cited: Watch "Express Tutorial - Node.js Friend Finder" on YouTube
  // https://youtu.be/kWu9stxD6m0  and the Hot Restaurant class activity
  // *** Updates an array of friends "database" array and sends back the json form of the most compatible new friend
  app.post('/api/friends', function (req, res) {
    // newFriend is the user that filled out the survey
    let newFriend = req.body;

    // compute best match from scores
    let bestMatch = {};

    for (let i = 0; i < newFriend.scores.length; i++) {
      if (newFriend.scores[i] == "1 (Strongly Disagree)") {
        newFriend.scores[i] = 1;
      } else if (newFriend.scores[i] == "5 (Strongly Agree)") {
        newFriend.scores[i] = 5;
      } else {
        newFriend.scores[i] = parseInt(newFriend.scores[i]);
      }
    }

    //Cited: https://teamtreehouse.com/community/total-difference-algo-javascript
    // compare the scores of newFriend with the scores of each friend in the database and find the friend with the smallest difference when each set of scores is compared

    let bestMatchIndex = 0;
    //greatest score difference for a question is 4, therefore greatest difference is 4 times # of questions in survey
    let bestMatchDifference = 40;

    for (let i = 0; i < friendsData.length; i++) {
      let totalDifference = 0;

      for (let index = 0; index < friendsData[i].scores.length; index++) {
        let differenceOneScore = Math.abs(friendsData[i].scores[index] - newFriend.scores[index]);
        totalDifference += differenceOneScore;
      }

      // if the totalDifference in scores is less than the best match so far
      // save that index and difference
      if (totalDifference < bestMatchDifference) {
        bestMatchIndex = i;
        bestMatchDifference = totalDifference;
      }
    }

    // the best match index is used to get the best match data from the friends index
    bestMatch = friendsData[bestMatchIndex];

    console.log(bestMatch);

    // Put new friend from survey in "database" array
    friendsData.push(newFriend);

    // return best match friend
    res.json(bestMatch);
  });
};