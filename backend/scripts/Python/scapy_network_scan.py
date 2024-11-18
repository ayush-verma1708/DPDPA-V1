from scapy.all import ARP, Ether, srp
import json
import sys

# Get the IP range to scan
target_ip = "192.168.1.0/24"  # Modify this as needed

# Create ARP request packet to find all devices on the network
arp_request = ARP(pdst=target_ip)
broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
arp_request_broadcast = broadcast/arp_request

# Send the request and capture the response
answered_list = srp(arp_request_broadcast, timeout=1, verbose=False)[0]

# Parse the results
devices = []
for element in answered_list:
    device_info = {
        "ip": element[1].psrc,
        "mac": element[1].hwsrc
    }
    devices.append(device_info)

# Output the results as a JSON string
print(json.dumps(devices))
sys.exit(0)
