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

# import nmap
# import socket
# import subprocess
# import platform
# from ipaddress import IPv4Network
# import time
# import json
# import sys
# import concurrent.futures

# def loading(message):
#     sys.stdout.write(message)
#     sys.stdout.flush()
#     for _ in range(3):
#         time.sleep(1)
#         sys.stdout.write(".")
#         sys.stdout.flush()
#     print()

# def get_current_ip():
#     try:
#         s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
#         s.settimeout(0)
#         s.connect(('8.8.8.8', 80))
#         current_ip = s.getsockname()[0]
#         s.close()
#         return current_ip
#     except Exception as e:
#         print(f"Error getting IP address: {e}")
#         return None

# def scan_network(ip):
#     try:
#         subnet = '.'.join(ip.split('.')[:3]) + '.0/24'
#         print(f"Scanning network: {subnet}")

#         devices = []
#         with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
#             futures = []
#             for addr in IPv4Network(subnet, strict=False):
#                 addr_str = str(addr)
#                 if addr_str == ip:
#                     continue
#                 futures.append(executor.submit(ping_device, addr_str))

#             for future in concurrent.futures.as_completed(futures):
#                 if future.result():
#                     devices.append(future.result())

#         return devices
#     except Exception as e:
#         print(f"Error scanning network: {e}")
#         return []

# def ping_device(addr_str):
#     try:
#         ping_command = (
#             ['ping', '-c', '1', '-W', '1', addr_str] if platform.system().lower() != 'windows'
#             else ['ping', '-n', '1', '-w', '1000', addr_str]
#         )
#         result = subprocess.run(ping_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
#         if result.returncode == 0:
#             print(f"Device found: {addr_str}")
#             return addr_str
#         else:
#             return None
#     except Exception as e:
#         print(f"Error pinging {addr_str}: {e}")
#         return None

# def identify_device_type(ip):
#     nm = nmap.PortScanner()
#     try:
#         print(f"Scanning device {ip} for details...", end="")
#         nm.scan(ip, '22-443', arguments='-O -A')
#         device_info = nm[ip]
        
#         # Extract the hostnames as a list (ensure it's serializable)
#         hostname = device_info.hostnames if device_info.hostnames else []
        
#         # Extract the OS information (ensure it's serializable)
#         os = device_info.get('osmatch', [{'osclass': 'Unknown'}])[0].get('osclass', 'Unknown') if 'osmatch' in device_info else 'Unknown'
        
#         # Extract open ports (ensure it's serializable)
#         open_ports = list(device_info['tcp'].keys()) if 'tcp' in device_info else []

#         print(" Done!")
        
#         # Return serializable data
#         return {
#             'IP': ip,
#             'Hostnames': hostname,
#             'OS': os,
#             'Open Ports': open_ports
#         }
#     except Exception as e:
#         print(f"Error identifying device {ip}: {e}")
#         return None

# def get_devices_info(devices):
#     device_info_list = []
#     for device in devices:
#         info = identify_device_type(device)
#         if info:
#             device_info_list.append(info)
#     return device_info_list

# # Custom serializer to handle non-serializable objects (like methods)
# def custom_serializer(obj):
#     if callable(obj):  # If the object is a method, convert it to string
#         return str(obj)
#     raise TypeError(f"Object of type {obj.__class__.__name__} is not serializable")

# if __name__ == "__main__":
#     # Only output relevant data as JSON
#     try:
#         loading("Determining current IP address")
#         ip = get_current_ip()
#         if ip:
#             print(f"Current IP: {ip}")
            
#             loading("Scanning network for devices")
#             devices = scan_network(ip)
#             print(f"Found {len(devices)} devices on the network.")
            
#             loading("Fetching devices' information")
#             devices_info = get_devices_info(devices)
            
#             # Output the result as JSON using the custom serializer
#             print(json.dumps(devices_info, default=custom_serializer, indent=4))
#         else:
#             print(json.dumps({"error": "Could not determine the IP address."}))
#     except Exception as e:
#         print(json.dumps({"error": f"Error scanning network: {str(e)}"}))

# # import nmap
# # import socket
# # import subprocess
# # import platform
# # from ipaddress import IPv4Network
# # import time
# # import json
# # import sys
# # import concurrent.futures

# # def loading(message):
# #     sys.stdout.write(message)
# #     sys.stdout.flush()
# #     for _ in range(3):
# #         time.sleep(1)
# #         sys.stdout.write(".")
# #         sys.stdout.flush()
# #     print()

# # def get_current_ip():
# #     try:
# #         s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# #         s.settimeout(0)
# #         s.connect(('8.8.8.8', 80))
# #         current_ip = s.getsockname()[0]
# #         s.close()
# #         return current_ip
# #     except Exception as e:
# #         print(f"Error getting IP address: {e}")
# #         return None

# # def scan_network(ip):
# #     try:
# #         subnet = '.'.join(ip.split('.')[:3]) + '.0/24'
# #         print(f"Scanning network: {subnet}")

# #         devices = []
# #         with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
# #             futures = []
# #             for addr in IPv4Network(subnet, strict=False):
# #                 addr_str = str(addr)
# #                 if addr_str == ip:
# #                     continue
# #                 futures.append(executor.submit(ping_device, addr_str))

# #             for future in concurrent.futures.as_completed(futures):
# #                 if future.result():
# #                     devices.append(future.result())

# #         return devices
# #     except Exception as e:
# #         print(f"Error scanning network: {e}")
# #         return []

# # def ping_device(addr_str):
# #     try:
# #         ping_command = (
# #             ['ping', '-c', '1', '-W', '1', addr_str] if platform.system().lower() != 'windows'
# #             else ['ping', '-n', '1', '-w', '1000', addr_str]
# #         )
# #         result = subprocess.run(ping_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
# #         if result.returncode == 0:
# #             print(f"Device found: {addr_str}")
# #             return addr_str
# #         else:
# #             return None
# #     except Exception as e:
# #         print(f"Error pinging {addr_str}: {e}")
# #         return None

# # def identify_device_type(ip):
# #     nm = nmap.PortScanner()
# #     try:
# #         print(f"Scanning device {ip} for details...", end="")
# #         nm.scan(ip, '22-443', arguments='-O -A')
# #         device_info = nm[ip]
        
# #         # Extract the hostnames as a list (ensure it's serializable)
# #         hostname = device_info.hostnames if device_info.hostnames else []
        
# #         # Extract the OS information (ensure it's serializable)
# #         os = device_info.get('osmatch', [{'osclass': 'Unknown'}])[0].get('osclass', 'Unknown') if 'osmatch' in device_info else 'Unknown'
        
# #         # Extract open ports (ensure it's serializable)
# #         open_ports = list(device_info['tcp'].keys()) if 'tcp' in device_info else []

# #         print(" Done!")
        
# #         # Return serializable data
# #         return {
# #             'IP': ip,
# #             'Hostnames': hostname,
# #             'OS': os,
# #             'Open Ports': open_ports
# #         }
# #     except Exception as e:
# #         print(f"Error identifying device {ip}: {e}")
# #         return None

# # def get_devices_info(devices):
# #     device_info_list = []
# #     for device in devices:
# #         info = identify_device_type(device)
# #         if info:
# #             device_info_list.append(info)
# #     return device_info_list

# # # Custom serializer to handle non-serializable objects (like methods)
# # def custom_serializer(obj):
# #     if callable(obj):  # If the object is a method, convert it to string
# #         return str(obj)
# #     raise TypeError(f"Object of type {obj.__class__.__name__} is not serializable")

# # if __name__ == "__main__":
# #     loading("Determining current IP address")
# #     ip = get_current_ip()
# #     if ip:
# #         print(f"Current IP: {ip}")
        
# #         loading("Scanning network for devices")
# #         devices = scan_network(ip)
# #         print(f"Found {len(devices)} devices on the network.")
        
# #         loading("Fetching devices' information")
# #         devices_info = get_devices_info(devices)
        
# #         # Output the result as JSON using the custom serializer
# #         print(json.dumps(devices_info, default=custom_serializer, indent=4))
# #     else:
# #         print("Could not determine the IP address.")

# # # import nmap
# # # import socket
# # # import subprocess
# # # import platform
# # # from ipaddress import IPv4Network
# # # import time
# # # import json
# # # import sys
# # # import concurrent.futures


# # # def loading(message):
# # #     sys.stdout.write(message)
# # #     sys.stdout.flush()
# # #     for _ in range(3):
# # #         time.sleep(1)
# # #         sys.stdout.write(".")
# # #         sys.stdout.flush()
# # #     print()

# # # def get_current_ip():
# # #     try:
# # #         s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# # #         s.settimeout(0)
# # #         s.connect(('8.8.8.8', 80))
# # #         current_ip = s.getsockname()[0]
# # #         s.close()
# # #         return current_ip
# # #     except Exception as e:
# # #         print(f"Error getting IP address: {e}")
# # #         return None

# # # def scan_network(ip):
# # #     try:
# # #         subnet = '.'.join(ip.split('.')[:3]) + '.0/24'
# # #         print(f"Scanning network: {subnet}")

# # #         devices = []
# # #         with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
# # #             futures = []
# # #             for addr in IPv4Network(subnet, strict=False):
# # #                 addr_str = str(addr)
# # #                 if addr_str == ip:
# # #                     continue
# # #                 futures.append(executor.submit(ping_device, addr_str))

# # #             for future in concurrent.futures.as_completed(futures):
# # #                 if future.result():
# # #                     devices.append(future.result())

# # #         return devices
# # #     except Exception as e:
# # #         print(f"Error scanning network: {e}")
# # #         return []

# # # def ping_device(addr_str):
# # #     try:
# # #         ping_command = (
# # #             ['ping', '-c', '1', '-W', '1', addr_str] if platform.system().lower() != 'windows'
# # #             else ['ping', '-n', '1', '-w', '1000', addr_str]
# # #         )
# # #         result = subprocess.run(ping_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
# # #         if result.returncode == 0:
# # #             print(f"Device found: {addr_str}")
# # #             return addr_str
# # #         else:
# # #             return None
# # #     except Exception as e:
# # #         print(f"Error pinging {addr_str}: {e}")
# # #         return None

# # # def identify_device_type(ip):
# # #     nm = nmap.PortScanner()
# # #     try:
# # #         print(f"Scanning device {ip} for details...", end="")
# # #         nm.scan(ip, '22-443', arguments='-O -A')
# # #         device_info = nm[ip]
        
# # #         # Extract the hostnames as a list (ensure it's serializable)
# # #         hostname = device_info.hostnames if device_info.hostnames else []
        
# # #         # Extract the OS information (ensure it's serializable)
# # #         os = device_info.get('osmatch', [{'osclass': 'Unknown'}])[0].get('osclass', 'Unknown') if 'osmatch' in device_info else 'Unknown'
        
# # #         # Extract open ports (ensure it's serializable)
# # #         open_ports = list(device_info['tcp'].keys()) if 'tcp' in device_info else []

# # #         print(" Done!")
        
# # #         # Return serializable data
# # #         return {
# # #             'IP': ip,
# # #             'Hostnames': hostname,
# # #             'OS': os,
# # #             'Open Ports': open_ports
# # #         }
# # #     except Exception as e:
# # #         print(f"Error identifying device {ip}: {e}")
# # #         return None

# # # def get_devices_info(devices):
# # #     device_info_list = []
# # #     for device in devices:
# # #         info = identify_device_type(device)
# # #         if info:
# # #             device_info_list.append(info)
# # #     return device_info_list

# # # if __name__ == "__main__":
# # #     loading("Determining current IP address")
# # #     ip = get_current_ip()
# # #     if ip:
# # #         print(f"Current IP: {ip}")
        
# # #         loading("Scanning network for devices")
# # #         devices = scan_network(ip)
# # #         print(f"Found {len(devices)} devices on the network.")
        
# # #         loading("Fetching devices' information")
# # #         devices_info = get_devices_info(devices)
        
# # #         # Output the result as JSON
# # #         print(json.dumps(devices_info, indent=4))
# # #     else:
# # #         print("Could not determine the IP address.")

# # # # import nmap
# # # # import socket
# # # # import subprocess
# # # # import platform
# # # # from ipaddress import IPv4Network
# # # # import time
# # # # import sys
# # # # import concurrent.futures

# # # # # Function to display a loading indicator
# # # # def loading(message):
# # # #     sys.stdout.write(message)
# # # #     sys.stdout.flush()
# # # #     for _ in range(3):
# # # #         time.sleep(1)
# # # #         sys.stdout.write(".")
# # # #         sys.stdout.flush()
# # # #     print()  # Newline after loading

# # # # # Function to get the current IP address
# # # # def get_current_ip():
# # # #     try:
# # # #         # Create a socket to connect to an external address (Google DNS as an example)
# # # #         s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# # # #         s.settimeout(0)
# # # #         s.connect(('8.8.8.8', 80))  # Google's public DNS server
# # # #         current_ip = s.getsockname()[0]
# # # #         s.close()
# # # #         return current_ip
# # # #     except Exception as e:
# # # #         print(f"Error getting IP address: {e}")
# # # #         return None

# # # # # Function to scan the network for active devices
# # # # def scan_network(ip):
# # # #     try:
# # # #         # Split the IP to calculate the subnet (assumes /24 subnet mask)
# # # #         subnet = '.'.join(ip.split('.')[:3]) + '.0/24'
# # # #         print(f"Scanning network: {subnet}")

# # # #         devices = []
# # # #         with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
# # # #             futures = []
# # # #             for addr in IPv4Network(subnet, strict=False):
# # # #                 addr_str = str(addr)
# # # #                 if addr_str == ip:
# # # #                     continue  # Skip the current device's IP

# # # #                 # Submit ping tasks to the executor
# # # #                 futures.append(executor.submit(ping_device, addr_str))

# # # #             for future in concurrent.futures.as_completed(futures):
# # # #                 if future.result():
# # # #                     devices.append(future.result())

# # # #         return devices
# # # #     except Exception as e:
# # # #         print(f"Error scanning network: {e}")
# # # #         return []

# # # # # Function to ping a device and check if it's alive
# # # # def ping_device(addr_str):
# # # #     try:
# # # #         # Perform a ping to the address
# # # #         ping_command = (
# # # #             ['ping', '-c', '1', '-W', '1', addr_str] if platform.system().lower() != 'windows'
# # # #             else ['ping', '-n', '1', '-w', '1000', addr_str]
# # # #         )
# # # #         result = subprocess.run(ping_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# # # #         if result.returncode == 0:  # Ping successful
# # # #             print(f"Device found: {addr_str}")
# # # #             return addr_str
# # # #         else:
# # # #             return None
# # # #     except Exception as e:
# # # #         print(f"Error pinging {addr_str}: {e}")
# # # #         return None

# # # # # Function to identify the device type using Nmap
# # # # def identify_device_type(ip):
# # # #     nm = nmap.PortScanner()
# # # #     try:
# # # #         # Scan the IP address with Nmap to detect the device type (OS, open ports)
# # # #         print(f"Scanning device {ip} for details...", end="")
# # # #         nm.scan(ip, '22-443', arguments='-O -A')  # Scan ports 22-443 to detect open services

# # # #         # Output the host information
# # # #         device_info = nm[ip]
# # # #         hostname = device_info.hostnames
# # # #         os = device_info.get('osmatch', [{'osclass': 'Unknown'}])[0]['osclass'] if 'osmatch' in device_info else 'Unknown'
# # # #         open_ports = device_info['tcp'].keys() if 'tcp' in device_info else []

# # # #         print(" Done!")
# # # #         return {
# # # #             'IP': ip,
# # # #             'Hostnames': hostname,
# # # #             'OS': os,
# # # #             'Open Ports': open_ports
# # # #         }
# # # #     except Exception as e:
# # # #         print(f"Error identifying device {ip}: {e}")
# # # #         return None

# # # # # Function to gather information about devices
# # # # def get_devices_info(devices):
# # # #     device_info_list = []
# # # #     for device in devices:
# # # #         info = identify_device_type(device)
# # # #         if info:
# # # #             device_info_list.append(info)
# # # #     return device_info_list

# # # # if __name__ == "__main__":
# # # #     loading("Determining current IP address")
# # # #     ip = get_current_ip()
# # # #     if ip:
# # # #         print(f"Current IP: {ip}")
        
# # # #         loading("Scanning network for devices")
# # # #         devices = scan_network(ip)
# # # #         print(f"Found {len(devices)} devices on the network.")
        
# # # #         loading("Fetching devices' information")
# # # #         devices_info = get_devices_info(devices)
        
# # # #         print("Devices information:")
# # # #         for device in devices_info:
# # # #             print(f"\nDevice IP: {device['IP']}")
# # # #             print(f"Hostnames: {device['Hostnames']}")
# # # #             print(f"Operating System: {device['OS']}")
# # # #             print(f"Open Ports: {device['Open Ports']}")
# # # #     else:
# # # #         print("Could not determine the IP address.")
