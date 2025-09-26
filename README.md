## youtube-backend

### Description
This is a backend focused project build with Typescript, Express, MongoDB, and with Zod validation. Images and videos are first stored on server with Multer then deleted after uploading to cloudinary. Authentication is JWT-based, which consists of access tokens and refresh tokens, where access tokens are used to carry the authorized requests and refresh tokens are used to refresh access tokens. A user can create, update its profile. Also, user can upload videos, create tweets, create comments for videos and tweets, can like videos, tweets and comments and dislike too. A user can create playlists where it can keep videos. This project has 7 MongoDB documents: `users`, `videos`, `tweets`, `playlists`,`comments`, `likes`, `subscriptions`. `users` has all the user information and watch history too. `videos` has all the videos uploaded by different users and there duration and views. `tweets` has all the tweets uploaded by different users. `playlists` are all the playlists uploaded by the users and they are public. `comments` contains the all-time comments posted by different users on videos and tweets. `likes` contains all the documents of videos, tweets and comments. `subscriptions` stores all the subscriber, subscription data in document. 
<br></br>
### Routes
All routes starts with /api/v1/\<route-name\>/, where route-name is the name of route as per below:

`healthcheck`
- `/`: Performs healthcheck

`users`
- `/register`: Registers a fresh user, if fields are validated.
- `/login`: Logs in a existing user.(Secure route)
- `/logout`: Logs out current user. (Secure route)
- `/refresh-token`: Used to refresh access token of an authorized user.(Secure route)
- `/change-password`: Change password of a user. (Secure route)
- `/current-user`: Returns the current user. (Secure route)
- `/update-account`: Updates the user account, if fields are validated.(Secure route)
- `/avatar`: Updates the avatar(secure route)
- `/cover-image`: Updates the cover image(Secure route)
- `/c/:username`: Gets the channel profile(Secure route)
- `/history`: Gets the watch history(Secure route)

`videos`\
All routes are secured.
- `/`: Gets all videos
- `/`(POST): Post a video
- `/:videoId`: Get a video by id
- `/:videoId`(DELETE): Delete a video by id
- `/:videoId`(PATCH): Update a video title, description, thumbnail
- `/toggle/publish/:videoId`: Toggle publish status

`tweets`\
All routes are secured.
- `/`: Post a tweet
- `/user/:userId`: Get user's tweets
- `/:tweetId`(PATCH): Update a tweet content
- `/:tweetId`(DELETE): Delete a tweet

`playlist`\
All routes are secured.
- `/`: Create a playlist
- `/:playlistId`: Get a playlist by id.
- `/:playlistId`(PATCH): Update a playlist
- `/:playlistId`(DELETE): Delete a playlist.
- `/add/:videoId/:playlistId`: Add video to playlist
- `/remove/:videoId/:playlistId`: Remove video to playlist
- `/user/:userId`: Get users playlist

`comments`\
All routes are secured.
- `/:videoId`: Get video comments
- `/:videoId`(POST): Post a comment
- `/c/:commentId`(DELETE): Delete a comment
- `/c/:commentId`(PATCH): Update a comment

`likes`\
All routes are secured.
- `/toggle/v/:videoId`: Toggle Video Like
- `/toggle/c/:commentId`: Toggle Comment Like
- `/toggle/t/:tweetId`: Toggle Tweet Like
- `/videos`: Get Liked Videos

`subscriptions`\
All routes are secured.
- `/c/:channelId`: Get subscriber list
- `/c/:channelId`: Toggle Subscription
- `/u/:subscriberId`: Get channel list which user has subscribed

`dashboard`\
All routes are secured.
- `/stats`: Get channel stats
- `/videos`: Get channel videos


### Installation
Clone the repository:
```bash
git clone https://github.com/tausiq2003/bp-2-youtube-backend
```
Move to the folder and create `.env` according to `.env.example`:
```bash
cd bp-2-youtube-backend
touch .env
```

Install dependencies: 
```bash
npm install
```
Run in dev mode: 
```
npm run dev
```
OR
<br></br>
Using docker\
Build the image: 
```bash
docker build -t <image-name> .
```
Run the container: 
```
docker run -it --name <container-name> -p 8000:8000 <image-name> 
```
Visit `localhost:8000/api/v1/healthcheck`

