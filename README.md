# Selenium Framework with Typescript

### Setup

1. Install required dependencies.

```
npm install
```

2. To run spec files, place spec file path in 'selenium-runner.txt' & run below commands based on requirenment.

```
npm run serial

npm run parallel
```

### Note

1. If you want to run multiple spec files, then give all spec paths in 'selenium-runner.txt' file, each in new line. ( you can also give folder path which contains spec files, example : `chrome => src/specs/random_search/**/*.spec.ts` )
