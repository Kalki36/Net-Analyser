# NETANALYZR Pro (Web-Based Network Packet Analyzer)

## Overview
NETANALYZR Pro is a web-based network packet analyzer built using Python and Flask that enables real-time inspection and analysis of network traffic. The application captures live packets from a selected network interface and presents protocol-level information through an interactive browser dashboard.

The project demonstrates both the theoretical foundations of computer networks (Ethernet, IP, TCP/UDP, ICMP, ARP) and their practical implementation using real packet capture. It provides visualization, filtering, and export capabilities similar to a lightweight Wireshark, but accessible entirely through a web interface.

---

## Objectives
- To understand and demonstrate real-time packet sniffing
- To analyze network traffic across multiple layers of the OSI model
- To visualize protocol distribution and traffic rate
- To provide structured inspection of packets via a web dashboard
- To support export of captured traffic for offline analysis
- To build a deployable and extensible network monitoring tool

---

## What is Packet Analysis?
Packet analysis is the process of capturing, inspecting, and interpreting data packets traveling across a network.

Each packet may contain:
- Ethernet frame information (source and destination MAC addresses)
- Network-layer data (source and destination IP addresses)
- Transport-layer data (TCP/UDP ports, ICMP messages)

Packet analysis is commonly used to:
- Troubleshoot network connectivity issues
- Monitor network performance
- Detect suspicious or malicious activity
- Understand application-level communication behavior

NETANALYZR Pro captures live packets using Scapy and decodes them into a structured, human-readable format.

---

## Project Architecture

### Frontend
The frontend is built using HTML, CSS, and JavaScript, and provides an interactive dashboard for packet inspection.

Features include:
- Network interface selection
- Start and stop packet capture controls
- Live packet display table
- Protocol, IP address, and port-based filtering
- CSV and PCAP export options
- Real-time charts and statistics using Chart.js

### Backend
The backend is built using Python and Flask and is responsible for packet capture and processing.

It handles:
- Network interface management
- Live packet sniffing using Scapy
- Packet parsing and protocol classification
- Protocol statistics calculation
- Optional GeoIP enrichment
- CSV and PCAP export generation

The backend communicates with the frontend using JSON-based APIs.

---

## Supported Protocols

| Protocol | Description |
|--------|-------------|
| Ethernet | Data link layer framing |
| IP | Network-layer addressing |
| TCP | Reliable, connection-oriented transport protocol |
| UDP | Connectionless transport protocol |
| ICMP | Network control and diagnostic messages |
| ARP | IP-to-MAC address resolution |

---

## Key Features
- Live packet capture from selected network interfaces
- Layer-wise packet decoding (L2, L3, L4)
- Real-time protocol distribution visualization
- Packets-per-second (PPS) monitoring
- Dynamic packet filtering
- Optional GeoIP lookup using MaxMind GeoLite2
- Export parsed packet metadata as CSV
- Export raw packets as PCAP (Wireshark compatible)

---

## Example Packet Output

**Source IP:** 192.168.1.5  
**Destination IP:** 8.8.8.8  
**Protocol:** ICMP  

**Details:**
- ICMP Echo Request (Ping)
- Packet Length: 74 bytes
- Indicates active connectivity to Google DNS

This confirms that ICMP traffic is being correctly captured and analyzed.

---

## Why Some Packets May Not Appear
Packet visibility depends on real-world network conditions, including:
- VPNs encrypting or tunneling traffic
- Firewalls blocking certain protocols such as ICMP or ARP
- Some protocols generating traffic only under specific conditions
- Administrator privileges being required for raw packet capture

These behaviors reflect actual network restrictions and do not indicate application errors.

---

## Installation and Setup

### Prerequisites
- Python 3.9 or higher
- Administrator privileges
- Npcap installed (Windows)

---

### Install Npcap (Windows)
Download Npcap from:
