# import socket
# from ipaddress import IPv4Network
# import subprocess
# import platform
# from scapy.all import ARP, Ether, srp
# import nmap
# import requests
# import netifaces
# import json
# import concurrent.futures
# from tqdm import tqdm


# def get_all_subnets():
#     """Discovers all connected subnets dynamically using network interfaces."""
#     subnets = []
#     try:
#         for interface in netifaces.interfaces():
#             addrs = netifaces.ifaddresses(interface)
#             if netifaces.AF_INET in addrs:
#                 for addr in addrs[netifaces.AF_INET]:
#                     ip = addr['addr']
#                     netmask = addr['netmask']
#                     if ip and netmask:
#                         subnet = IPv4Network(f"{ip}/{netmask}", strict=False)
#                         subnets.append(str(subnet))
#     except Exception as e:
#         print(f"Error discovering subnets: {e}")
#     return subnets


# def arp_scan(subnet):
#     """Performs ARP scanning to find active devices on the subnet."""
#     devices = []
#     try:
#         arp_request = ARP(pdst=subnet)
#         broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
#         arp_request_broadcast = broadcast / arp_request
#         answered_list = srp(arp_request_broadcast, timeout=2, verbose=False)[0]

#         for sent, received in answered_list:
#             devices.append({'IP': received.psrc, 'MAC': received.hwsrc})
#     except Exception as e:
#         print(f"Error performing ARP scan: {e}")
#     return devices


# def get_mac_vendor(mac_address):
#     """Fetches the MAC address vendor using an API."""
#     try:
#         response = requests.get(f"https://api.macvendors.com/{mac_address}")
#         if response.status_code == 200:
#             return response.text
#     except:
#         pass
#     return "Unknown"


# def identify_device_type(ip):
#     """Uses Nmap to identify device type, OS, open ports, and hostnames."""
#     nm = nmap.PortScanner()
#     try:
#         nm.scan(ip, arguments='-sS -sU -O -A --host-timeout 30s')
#         device_info = nm[ip]
        
#         hostnames = [host['name'] for host in device_info.hostnames()] if 'hostnames' in device_info else []
#         os = device_info['osmatch'][0]['name'] if 'osmatch' in device_info and device_info['osmatch'] else "Unknown"
#         open_ports = list(device_info['tcp'].keys()) if 'tcp' in device_info else []

#         return {
#             'IP': ip,
#             'Hostnames': hostnames,
#             'OS': os,
#             'Open Ports': open_ports
#         }
#     except Exception as e:
#         return {'IP': ip, 'Error': str(e)}


# def get_devices_info(devices):
#     """Fetches detailed information about devices using multithreading."""
#     device_info_list = []
#     with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
#         futures = {executor.submit(identify_device_type, device['IP']): device for device in devices}
#         for future in tqdm(concurrent.futures.as_completed(futures), total=len(futures), desc="Scanning devices"):
#             result = future.result()
#             if result:
#                 device_info_list.append(result)
#     return device_info_list


# if __name__ == "__main__":
#     try:
#         subnets = get_all_subnets()
#         all_devices = []

#         for subnet in subnets:
#             print(f"Scanning subnet: {subnet}")
#             devices = arp_scan(subnet)
#             if not devices:
#                 print(f"No devices found in subnet {subnet}.")
#                 continue

#             for device in devices:
#                 device['MAC Vendor'] = get_mac_vendor(device.get('MAC'))

#             devices_info = get_devices_info(devices)

#             # Merge ARP data with Nmap data
#             for device in devices_info:
#                 mac = next((d['MAC'] for d in devices if d['IP'] == device['IP']), "Unknown")
#                 device['MAC'] = mac
#                 device['MAC Vendor'] = next((d['MAC Vendor'] for d in devices if d['IP'] == device['IP']), "Unknown")

#             all_devices.extend(devices_info)

#         # Output the results as JSON
#         print(json.dumps(all_devices, indent=4))
#         # Save results to a file
#         with open("network_scan_results.json", "w") as file:
#             json.dump(all_devices, file, indent=4)

#     except Exception as e:
#         print(json.dumps({"error": f"An error occurred: {str(e)}"}))

import nmap
import socket
import subprocess
import platform
from ipaddress import IPv4Network
import time
import json
import sys
import concurrent.futures


def get_current_ip():
    """Returns the current IP address of the machine."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0)
        s.connect(('8.8.8.8', 80))
        current_ip = s.getsockname()[0]
        s.close()
        return current_ip
    except Exception as e:
        return None

def scan_network(ip):
    """Scans the network for active devices."""
    try:
        subnet = '.'.join(ip.split('.')[:3]) + '.0/24'

        devices = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            futures = []
            for addr in IPv4Network(subnet, strict=False):
                addr_str = str(addr)
                if addr_str == ip:
                    continue
                futures.append(executor.submit(ping_device, addr_str))

            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                if result:
                    devices.append(result)

        return devices
    except Exception as e:
        return []

def ping_device(addr_str):
    """Pings a device to check if it is active."""
    try:
        ping_command = (
            ['ping', '-c', '1', '-W', '1', addr_str] if platform.system().lower() != 'windows'
            else ['ping', '-n', '1', '-w', '1000', addr_str]
        )
        result = subprocess.run(ping_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode == 0:
            return addr_str
        return None
    except Exception as e:
        return None

def identify_device_type(ip):
    """Identifies the type of a device using nmap."""
    nm = nmap.PortScanner()
    try:
        nm.scan(ip, '22-443', arguments='-O -A')
        
        device_info = nm[ip]
        hostnames = [host['name'] for host in device_info.hostnames()] if 'hostnames' in device_info else []
        os = device_info['osmatch'][0]['name'] if 'osmatch' in device_info and device_info['osmatch'] else "Unknown"
        open_ports = list(device_info['tcp'].keys()) if 'tcp' in device_info else []

        return {
            'IP': ip,
            'Hostnames': hostnames,
            'OS': os,
            'Open Ports': open_ports
        }
    except Exception as e:
        return None

def get_devices_info(devices):
    """Fetches detailed information about each device."""
    device_info_list = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(identify_device_type, device): device for device in devices}
        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            if result:
                device_info_list.append(result)
    return device_info_list

if __name__ == "__main__":
    try:
        ip = get_current_ip()
        if ip:
            
            devices = scan_network(ip)
            
            devices_info = get_devices_info(devices)
            
            # Output the result as JSON
            print(json.dumps(devices_info, indent=4))
        else:
            print(json.dumps({"error": "Could not determine the IP address."}))
    except Exception as e:
        print(json.dumps({"error": f"Error scanning network: {str(e)}"}))
