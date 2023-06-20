serial_cmd=`cat lib/runner/run.txt`

if [ "${serial_cmd}" == "" ]; then
  echo -e "\nNo valid spec found, please check selenium-runner.txt !!!"
  exit
fi

eval $serial_cmd

exit