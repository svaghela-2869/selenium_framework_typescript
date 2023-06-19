serial_cmd=`cat lib/runner/run.txt`

if [ "${serial_cmd}" == "" ]; then
  clear
  echo -e "\nNo spec found, please check selenium-runner.txt !!!"
  exit
fi

eval $serial_cmd

exit