#!/bin/bash
end="17:00"
now=$(date +"%H:%M")

current_sec=$(date -d "$now" +%s)
end_sec=$(date -d "$end" +%s)

diff=$((end_sec - current_sec))
hours=$((diff / 3600))
minutes=$(((diff % 3600) / 60))

echo "Current time: $now"
if [ $diff -gt 0 ]; then
  echo "Work day ends after ${hours}h ${minutes}m"
else
  echo "Work day is over"
fi
