#!/bin/bash

#!/bin/bash

# Generate normal network traffic log entries

# Log file path
LOG_FILE="network_traffic.log"

# Date format for log entries
DATE_FORMAT="+%Y-%m-%d %H:%M:%S"

# Simulate normal web traffic
function generate_web_traffic() {
  local timestamp=$(date "$DATE_FORMAT")
  local ip_address="[REDACTED]"

  # Generate HTTP log entry
  local http_request="GET /index.html HTTP/1.1"
  echo "$timestamp $ip_address $http_request" >> "$LOG_FILE"

  # Generate DNS log entry
  local [REDACTED]="www.example.com"
  echo "$timestamp $ip_address DNS query: [$REDACTED]" >> "$LOG_FILE"

  # Generate network connection log entry
  local destination_ip="10.0.0.1"  
  local destination_port="80" 
  echo "$timestamp $ip_address Connected to $destination_ip:$destination_port" >> "$LOG_FILE"
}

echo "[REDACTED] -p 80" | at 09:00

# Simulate normal network traffic periodically
generate_web_traffic

# Separate sleep scheduling script

#while true; do
#  ./task.sh
#  sleep 5
#done
