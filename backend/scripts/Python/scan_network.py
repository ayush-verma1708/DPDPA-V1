from concurrent.futures import ThreadPoolExecutor
import socket
import subprocess
import platform
from ipaddress import IPv4Network

def get_current_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0)
        s.connect(('8.8.8.8', 80))
        current_ip = s.getsockname()[0]
        s.close()
        return current_ip
    except Exception as e:
        print(f"Error getting IP address: {e}")
        return None

def ping_address(addr_str):
    try:
        ping_command = (
            ['ping', '-c', '1', '-W', '0.5', addr_str] if platform.system().lower() != 'windows'
            else ['ping', '-n', '1', '-w', '500', addr_str]
        )
        result = subprocess.run(ping_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode == 0:  # Ping successful
            return addr_str
    except Exception as e:
        return None

def scan_network(ip):
    subnet = '.'.join(ip.split('.')[:3]) + '.0/24'
    print(f"Scanning network: {subnet}")
    devices = []
    with ThreadPoolExecutor(max_workers=50) as executor:  # Adjust the number of workers for your system
        futures = [executor.submit(ping_address, str(addr)) for addr in IPv4Network(subnet, strict=False)]
        for future in futures:
            result = future.result()
            if result:
                devices.append(result)
    return devices

if __name__ == "__main__":
    ip = get_current_ip()
    if ip:
        print(f"Current IP: {ip}")
        devices = scan_network(ip)
        print("Devices found on the network:")
        for device in devices:
            print(f"- {device}")
    else:
        print("Could not determine the IP address.")

# import socket
# import subprocess
# import platform
# from ipaddress import IPv4Network

# def get_current_ip():
#     try:
#         # Create a socket to connect to an external address (Google DNS as an example)
#         s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
#         s.settimeout(0)
#         s.connect(('8.8.8.8', 80))  # Google's public DNS server
#         current_ip = s.getsockname()[0]
#         s.close()
#         return current_ip
#     except Exception as e:
#         print(f"Error getting IP address: {e}")
#         return None
# import concurrent.futures

# def scan_network(ip):
#     try:
#         subnet = '.'.join(ip.split('.')[:3]) + '.0/24'
#         print(f"Scanning network: {subnet}")
#         devices = []

#         # Create a list of all IP addresses to scan
#         ips_to_scan = [str(addr) for addr in IPv4Network(subnet, strict=False) if str(addr) != ip]

#         def ping_device(addr_str):
#             ping_command = (
#                 ['ping', '-c', '1', '-W', '1', addr_str] if platform.system().lower() != 'windows'
#                 else ['ping', '-n', '1', '-w', '1000', addr_str]
#             )
#             result = subprocess.run(ping_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
#             if result.returncode == 0:  # Ping successful
#                 return addr_str
#             return None

#         with concurrent.futures.ThreadPoolExecutor() as executor:
#             # Run pings in parallel
#             results = list(executor.map(ping_device, ips_to_scan))

#         # Filter out None results (unreachable devices)
#         devices = [result for result in results if result is not None]

#         return devices

#     except Exception as e:
#         print(f"Error scanning network: {e}")
#         return []


# if __name__ == "__main__":
#     ip = get_current_ip()
#     if ip:
#         print(f"Current IP: {ip}")
#         devices = scan_network(ip)
#         print("Devices found on the network:")
#         for device in devices:
#             print(f"- {device}")
#     else:
#         print("Could not determine the IP address.")
