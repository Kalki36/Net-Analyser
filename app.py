from flask import Flask, render_template, request, jsonify, send_file
import scapy.all as scapy
import threading
import csv
import io

app = Flask(__name__)

captured_packets = []
sniff_thread = None
stop_sniffing = False


def process_packet(packet):
    global captured_packets
    info = {}

    # Layer 2 (Ethernet)
    if packet.haslayer(scapy.Ether):
        info["src_mac"] = packet[scapy.Ether].src
        info["dst_mac"] = packet[scapy.Ether].dst
        info["protocol"] = "Ethernet"

    # Layer 3 (Network)
    if packet.haslayer(scapy.IP):
        info["src"] = packet[scapy.IP].src
        info["dst"] = packet[scapy.IP].dst
        info["protocol"] = "IP"

    elif packet.haslayer(scapy.ARP):
        info["src"] = packet[scapy.ARP].psrc
        info["dst"] = packet[scapy.ARP].pdst
        info["protocol"] = "ARP"

    elif packet.haslayer(scapy.ICMP):
        info["protocol"] = "ICMP"

    # Layer 4 (Transport)
    if packet.haslayer(scapy.TCP):
        info["protocol"] = "TCP"
        info["sport"] = packet[scapy.TCP].sport
        info["dport"] = packet[scapy.TCP].dport

    elif packet.haslayer(scapy.UDP):
        info["protocol"] = "UDP"
        info["sport"] = packet[scapy.UDP].sport
        info["dport"] = packet[scapy.UDP].dport

    captured_packets.append(info)


def start_sniff(interface):
    global stop_sniffing
    stop_sniffing = False

    # Capture IP, ARP, TCP, UDP, and ICMP traffic
    scapy.sniff(
        iface=interface,
        store=False,
        prn=process_packet,
        filter="ip or arp or tcp or udp or icmp",
        stop_filter=lambda _: stop_sniffing
    )



@app.route('/')
def index():
    interfaces = scapy.get_if_list()
    return render_template('index.html', interfaces=interfaces)


@app.route('/start', methods=['POST'])
def start():
    global sniff_thread
    interface = "Wi-Fi"
    if sniff_thread and sniff_thread.is_alive():
        return jsonify({"status": "error", "message": "Sniffer already running"})
    sniff_thread = threading.Thread(target=start_sniff, args=(interface,))
    sniff_thread.start()
    return jsonify({"status": "success", "message": f"Started sniffing on {interface}"})


@app.route('/stop', methods=['POST'])
def stop():
    global stop_sniffing
    stop_sniffing = True
    return jsonify({"status": "success", "message": "Sniffer stopped"})


@app.route('/packets')
def packets():
    protocol_filter = request.args.get("protocol")
    ip_filter = request.args.get("ip")

    filtered = captured_packets
    if protocol_filter:
        filtered = [p for p in filtered if p.get("protocol") == protocol_filter.upper()]
    if ip_filter:
        filtered = [p for p in filtered if ip_filter in (p.get("src", "") + p.get("dst", ""))]

    return jsonify(filtered[-50:])


@app.route('/stats')
def stats():
    protocol_counts = {"TCP": 0, "UDP": 0, "ICMP": 0, "IP": 0}
    for p in captured_packets:
        proto = p.get("protocol", "IP")
        if proto in protocol_counts:
            protocol_counts[proto] += 1
    return jsonify(protocol_counts)


@app.route('/export/csv')
def export_csv():
    if not captured_packets:
        return "No data to export", 400

    filename = "packets.csv"
    keys = set()
    # Collect all unique keys across all packets dynamically
    for pkt in captured_packets:
        keys.update(pkt.keys())

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(keys))
        writer.writeheader()
        writer.writerows(captured_packets)

    return send_file(filename, as_attachment=True)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
