import socket

def get_current_ip():
    try:
        # Create a socket to connect to an external address (Google DNS as an example)
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0)
        s.connect(('8.8.8.8', 80))  # Google's public DNS server
        current_ip = s.getsockname()[0]
        s.close()
        return current_ip
    except Exception as e:
        print(f"Error getting IP address: {e}")
        return None

if __name__ == "__main__":
    ip = get_current_ip()
    if ip:
        print(f"Current IP: {ip}")
    else:
        print("Could not determine the IP address.")

# import socket
# import sys

# def get_current_ip():
#     try:
#         s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
#         s.settimeout(5)  # 5 seconds timeout
#         s.connect(('8.8.8.8', 80))  # Google's public DNS server
#         current_ip = s.getsockname()[0]
#         s.close()
#         return current_ip
#     except socket.timeout:
#         print("Timeout occurred while trying to get IP address.")
#         return None
#     except Exception as e:
#         print(f"Error getting IP address: {e}")
#         return None

# if __name__ == "__main__":
#     ip = get_current_ip()
#     if ip:
#         print(f"Current IP: {ip}")
#     else:
#         print("Could not determine the IP address.", file=sys.stderr)
#         sys.exit(1)
