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

3. If you want video also of the running specs, then use below command.

```
npm run docker
```

### Note

1. If you want to run multiple spec files, then give all spec paths in 'selenium-runner.txt' file, each in new line. ( you can also give folder path which contains spec files, example : `chrome => tests/random_search/**/*.spec.ts` )

2. Make sure you have docker installed on your system, if you are running using 3rd option to get the video.
