docker_cmd=`cat selenium-runner-final.txt`

echo -e "\n======================== Selenium Grid ========================"
echo -e "\nhttp://localhost:4444"
echo -e "\n===============================================================\n"

IFS=$'\n'
ADDR=( ${docker_cmd} )

echo -e "<< entry >>"
docker network create grid
docker run -d -p 4442-4444:4442-4444 --net grid --name selenium-hub selenium/hub:latest
echo -e "<< entry >>"
sleep 5

for cmd in "${ADDR[@]}";
do
IFS=$'`'
read -a ADDRCMD <<< "$cmd"

echo -e "\nDocker spec => ${ADDRCMD[0]}"
echo -e "Docker browser => ${ADDRCMD[1]}\n"

width=1920
height=1080
frame=30

docker run --env SE_EVENT_BUS_HOST=selenium-hub --env SE_EVENT_BUS_PUBLISH_PORT=4442 --env SE_EVENT_BUS_SUBSCRIBE_PORT=4443 --env SE_SCREEN_WIDTH=$width --env SE_SCREEN_HEIGHT=$height --env SE_VNC_NO_PASSWORD=1 --env SE_VNC_VIEW_ONLY=1 --net grid -d --name selenium --shm-size='2g' selenium/node-"${ADDRCMD[1]}":latest
docker run --env SE_EVENT_BUS_HOST=selenium-hub --env SE_EVENT_BUS_PUBLISH_PORT=4442 --env SE_EVENT_BUS_SUBSCRIBE_PORT=4443 --env SE_SCREEN_WIDTH=$width --env SE_SCREEN_HEIGHT=$height --env SE_FRAME_RATE=$frame --env FILE_NAME="${ADDRCMD[0]}".mp4 -d --net grid --name video -v ./"${ADDRCMD[2]}"/recordings:/videos selenium/video:latest

eval "${ADDRCMD[3]}"

docker stop video &>/dev/null && docker rm video ; docker stop selenium &>/dev/null && docker rm selenium

done

sleep 3
echo -e "\n<< exit >>"
docker stop selenium-hub &>/dev/null && docker rm selenium-hub
docker rm $(docker ps --all -q) -f &>/dev/null
docker network rm grid
echo -e "<< exit >>"

exit