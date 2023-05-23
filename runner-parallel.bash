NC='\033[0m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'

value=`cat selenium-runner.txt`

IFS=$'\n'
ADDR=( ${value} )

resultFolder=$(date +D%Y_%m_%dT%H_%M_%S)

baseCommand="npx mocha --require 'ts-node/register' --parallelRun true --browser chrome --diff true --full-trace true --no-timeouts --reporter mochawesome --reporter-options 'reportDir=results/$resultFolder,reportFilename="selenium-[status]-report",reportPageTitle="Mochawesome",embeddedScreenshots=true,charts=true,html=true,json=true,overwrite=true,inlineAssets=true,saveAllAttempts=false,code=false,quiet=false,ignoreVideos=true,showPending=false,autoOpen=true' --spec "
runnerCommand=""

current=0
length=${#ADDR[@]}

clear
echo -e "${GREEN}Below spec files / folders will be run parallelly.\n${NC}"

for spec in "${ADDR[@]}";
do
current=$((current + 1))
echo $spec
if [[ "$current" -eq "$length" ]]
then
   runnerCommand=$runnerCommand$baseCommand$spec
else
   runnerCommand="$runnerCommand$baseCommand$spec & sleep 1 && "
fi
sleep 1
newResultFolder=$(date +D%Y_%m_%dT%H_%M_%S)
runnerCommand="${runnerCommand//$resultFolder/$newResultFolder}"
eval "mkdir -p results/$newResultFolder"
runnerCommand="${runnerCommand//$spec/$spec 2>&1 | tee 'results/$newResultFolder/selenium-terminal-log.txt'}"
done

echo -e "\n${GREEN}Total spec files / folders found : $current${NC}"

echo -e "${YELLOW}\nAvailable browses on running system.\n${NC}"
eval "npx browser-list"

echo -e "${YELLOW}\nEnter browser name you want to run your specs ? ( default is chrome )${NC}"
echo -e "${RED}\nNOTE : Currently supported browsers are 'chrome' & 'firefox' only !\n${NC}"
read browser

if [[ -z "$browser" ]]
then
   final=$runnerCommand
   echo -e "${GREEN}Running in chrome.\n${NC}"
else
   final="${runnerCommand//chrome/$browser}"
   echo -e "\n${GREEN}Running in $browser.${NC}"
fi

eval $final
sleep 3
clear
exit