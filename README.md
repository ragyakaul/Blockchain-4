# Blockchain-4
 Document Anchoring using Blockchain

## Cloning
 1. Clone repository `$ git clone https://github.com/CodedByHasan/Blockchain-4`
 2. (Optional) Checkout relevant branch `$ git checkout <branch_name>`
 3. To install packages and node server, run `$ npm i`

## Running
 - Run the JSX pre-processor `npx babel src --out-dir ./public/react-scripts --presets react-app/prod`
 - You can run the pre-processor in the background watching for changes with `npx babel --watch src --out-dir ./public/react-scripts --presets react-app/prod &`
 - To run on the default port, use `$ npm start` or to auto-restart on changes run `$ npm run mon`
 - If you need to specify a port, use `$ PORT=80 npm start`
 - Enter this URL in your browser: `http://localhost:3000`

## Development
 1. Pull the latest commits from `main`
 2. Checkout a new branch `$ git checkout -b <new_branch_name>`
 3. Install new packages `$ npm i`
 4. Make local changes
 5. Commit regularly `$ git add file1 file2 ...`, `$ git commit -m "<message>"`
 6. Lint code `./lint.sh`
 7. Merge `main` into your branch `$ git merge main`
 8. Push `$ git push`
 9. Submit Pull Request for `main` branch on github
 10. Another team member will review your pull request
