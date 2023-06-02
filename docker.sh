docker network rm grid

docker network create grid

docker run -d -p 4444:4444 -p 6900:5900 --net grid --name selenium --shm-size='2g' selenium/standalone-chrome:latest

docker run -d --net grid --name video -v /Users/sagarvaghela/study_work/selenium_framework_typescript/results/videos:/videos selenium/video:latest

docker stop video

docker rm video

docker stop selenium && docker rm selenium

docker network rm grid