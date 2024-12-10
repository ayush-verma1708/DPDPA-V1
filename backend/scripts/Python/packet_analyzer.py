import sys
import json
import socket
import requests
from subprocess import Popen, PIPE
import ipaddress

# Hardcoded input for testing
input_data = '{"devices": ["192.168.1.4"]}'

# AWS IP Range Check
def get_aws_ip_ranges():
    url = 'https://ip-ranges.amazonaws.com/ip-ranges.json'
    response = requests.get(url)
    try:
        response_data = response.json()  # Try to parse JSON response
        return response_data.get('prefixes', [])
    except ValueError:
        print(f"Error: Received non-JSON response from AWS IP ranges")
        return []

def is_aws_ip(ip):
    aws_ips = get_aws_ip_ranges()
    for prefix in aws_ips:
        if ip_in_range(ip, prefix['ip_prefix']):
            return True
    return False

# Load Azure IP ranges from a local file
def get_azure_ip_ranges():
    try:
        with open('ServiceTags_Public_20241118.json', 'r') as file:
            # Load the content of the JSON file
            response_data = json.load(file)
            # Return the 'values' field containing IP ranges
            return response_data.get('values', [])
    except FileNotFoundError:
        print("Error: The file ServiceTags_Public_20241118.json was not found.")
        return []
    except json.JSONDecodeError:
        print("Error: Failed to decode the JSON file.")
        return []

# Check if an IP is in the Azure IP range
def is_azure_ip(ip):
    azure_ips = get_azure_ip_ranges()
    for prefix in azure_ips:
        # Assuming the correct key is 'properties' -> 'addressPrefixes' or any other key you find
        # Check if the IP is in the correct range
        address_prefix = prefix.get('properties', {}).get('addressPrefixes', [])
        for range_str in address_prefix:
            if ip_in_range(ip, range_str):
                return True
    return False



# Function to check if IP belongs to specific cloud service using ranges
def check_cloud_platform(ip):
    if is_aws_ip(ip):
        return "AWS"
    elif is_azure_ip(ip):
        return "Azure"
    # elif is_gcloud_ip(ip):
    #     return "Google Cloud"
    return None

# Reverse DNS Lookup to detect cloud provider hostnames
def get_reverse_dns(ip):
    try:
        return socket.gethostbyaddr(ip)
    except socket.herror:
        return None

def ip_in_range(ip, range_str):
    try:
        ip_obj = ipaddress.ip_address(ip)
        network_obj = ipaddress.ip_network(range_str, strict=False)
        return ip_obj in network_obj
    except ValueError:
        return False

# Scan for Tally service (known port 9000)
def detect_tally(services):
    tally_ports = [9000]  # Known Tally port
    for service in services:
        port = int(service['port'].split('/')[0])
        if port in tally_ports:
            return "Tally service detected!"
    return None

# Analyze Services using nmap
def analyze_services(device):
    try:
        # Use nmap to scan services on the device
        process = Popen(['nmap', '-sV', device], stdout=PIPE, stderr=PIPE)
        stdout, stderr = process.communicate()

        if process.returncode != 0:
            return {"device": device, "error": stderr.decode('utf-8')}

        # Parse nmap output and check for services
        services = []
        for line in stdout.decode('utf-8').splitlines():
            if '/tcp' in line or '/udp' in line:
                parts = line.split()
                port = parts[0]
                state = parts[1]
                service = " ".join(parts[2:])
                services.append({
                    "port": port,
                    "state": state,
                    "service": service
                })

        # Check for Tally service
        tally_detection = detect_tally(services)

        # Detect cloud platform (AWS, Azure, Google Cloud)
        cloud_platform = check_cloud_platform(device)

        return {"device": device, "services": services, "cloud_platform": cloud_platform, "tally_detection": tally_detection}
    except Exception as e:
        return {"device": device, "error": str(e)}

# Main analysis of multiple devices
def analyze_packets(devices):
    results = []
    for device in devices:
        result = analyze_services(device)
        results.append(result)
    return results

# Main function to handle input and output
if __name__ == "__main__":
    try:
        # Using the hardcoded input for testing
        devices = json.loads(input_data).get("devices", [])
        
        if not devices:
            raise ValueError("No devices provided.")
        
        # Perform analysis
        analysis_results = analyze_packets(devices)
        
        # Output results as JSON
        print(json.dumps({"results": analysis_results}, indent=4))
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e} | Input data: {input_data}")
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
