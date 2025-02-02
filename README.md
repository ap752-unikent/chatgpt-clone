<b>To run the Backend follow these steps:</b>

```
cd backend
mkdir chat-history
npm i
```

Add a .env in the root of the /backend folder containing your OpenAI api key like so:
```
OPENAI_API_KEY=Your api key goes here
```

```
npm run dev-watch
```

If successful it should say 
```
[nodemon] 3.1.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/index.ts`
Server is running on http://localhost:3000
```

<b>To run the Frontend follow these steps</b>

navigate back to the root directory if you haven't already

```
cd frontend
npm i
npm run dev
```

navigate to http://localhost:5173/ and give it a spin.
