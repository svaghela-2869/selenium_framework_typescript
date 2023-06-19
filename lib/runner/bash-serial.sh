serial_cmd=`cat lib/runner/run.txt`

IFS=$'\n'
ADDR=( ${serial_cmd} )

if [ "${#ADDR[@]}" == "0" ]; then
  clear
  echo -e "\nNo spec found, please check selenium-runner.txt !!!"
  exit
fi

for cmd in "${ADDR[@]}";
do

eval $cmd

done

exit