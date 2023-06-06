docker_cmd=`cat selenium-docker-final.txt`

echo -e "\n======================== Selenium Grid ========================"
echo -e "\nhttp://localhost:4444"
echo -e "\n==============================================================="

IFS=$'\n'
ADDR=( ${docker_cmd} )

for cmd in "${ADDR[@]}";
do
IFS=$'`'
read -a ADDRCMD <<< "$cmd"

echo -e "\nDocker spec => ${ADDRCMD[0]}"
echo -e "Docker browser => ${ADDRCMD[1]}\n"
# echo -e "Result => ${ADDRCMD[2]}"
# echo -e "Command => ${ADDRCMD[3]}"

docker network rm grid &>/dev/null ; docker rm $(docker ps --all -q) -f &>/dev/null
docker network create grid

width=1920
height=1080
frame=30

docker run --env SE_SCREEN_WIDTH=$width --env SE_SCREEN_HEIGHT=$height --env SE_VNC_NO_PASSWORD=1 --env SE_VNC_VIEW_ONLY=1 --net grid -d -p 4444:4444 --name selenium --shm-size='2g' selenium/standalone-"${ADDRCMD[1]}":latest
docker run --env SE_SCREEN_WIDTH=$width --env SE_SCREEN_HEIGHT=$height --env SE_FRAME_RATE=$frame --env FILE_NAME="${ADDRCMD[0]}".mp4 -d --net grid --name video -v ./"${ADDRCMD[2]}"/recordings:/videos selenium/video:latest

eval "${ADDRCMD[3]}"

docker stop video &>/dev/null && docker rm video &>/dev/null ; docker stop selenium &>/dev/null && docker rm selenium &>/dev/null ; docker network rm grid &>/dev/null ; docker rm $(docker ps --all -q) -f &>/dev/null

done

exit