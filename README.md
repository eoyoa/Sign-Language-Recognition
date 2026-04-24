# Sign Language Recognition

Start the dev server with `npm run dev` then visit the URL that Vite hosted it on on your browser.

(It's likely `localhost:5173`.)

## Annotating signs

One person at a time. Before you start:

1. `git pull` to get the latest database
2. `npm run dev` — annotate your signs
3. `git add public/MappingDatabase.json && git commit && git push` when done

If two people annotate at the same time without pulling first, one person's signs will overwrite the other's.

## How to push changes

- Fork your own copy of the repo
- Make your changes
- Push them to your fork
- Create a pull request