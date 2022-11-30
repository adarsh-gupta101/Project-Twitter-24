import express from "express";
var router = express.Router();
import session from "express-session";

import { TwitterApi } from "twitter-api-v2";

let data;
const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
});

async function main() {
  const tweet = await client.tweets.findTweetById("20");
  console.log(tweet.data.text);
}

// main();

// middleware specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.get("/test", (req, res) => {
  let test = { 1: "sec" };
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: "oneDay" },
    resave: false 
})
  res.send(req.session.cookie);
});
// define the home page route
router.get("/", async (req, res) => {
  const authLink = await client.generateAuthLink(
    "http://localhost:3000/user/callback",
    {
      linkMode: "authorize",
    }
  );

  data = authLink.url;
  session({ oauth_token_secret: authLink.oauth_token_secret });
  //save in session

  console.log(authLink);
  res.redirect(authLink.url);
});
// define the about route
router.get("/callback", (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;
  // Get the saved oauth_token_secret from session
  //   console.log(req.session)
  const { oauth_token_secret } = req.session;
  // const oauth_token_secret=data.oauth_token_secret

  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    return res.status(400).send("You denied the app or your session expired!");
  }

  const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  });
  client
    .login(oauth_verifier)
    .then(({ client: loggedClient, accessToken, accessSecret }) => {
      // loggedClient is an authenticated client in behalf of some user
      // Store accessToken & accessSecret somewhere
    })
    .catch(() => res.status(403).send("Invalid verifier or access tokens!"));
});

export default router;
