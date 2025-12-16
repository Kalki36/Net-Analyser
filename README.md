#NETANALYZR Pro

Advanced Network Packet Analyzer and Visualization Dashboard

NETANALYZR Pro is a web-based real-time network packet analysis tool built using Python, Flask, Scapy, and Chart.js.
It functions as a browser-based packet analyzer, providing live traffic capture, protocol analytics, GeoIP enrichment, and export capabilities.

Features
Packet Capture and Analysis

Live packet sniffing using Scapy

Supports TCP, UDP, ICMP, ARP, and IP protocols

Layer-wise parsing (Ethernet, IP, Transport)

Displays source and destination IP addresses

Displays source and destination ports

Displays protocol and packet length

Captures MAC addresses

Real-Time Dashboard

Protocol distribution visualization (doughnut chart)

Packets-per-second (PPS) monitoring

Live-updating packet table

Filtering by protocol, IP address, and port

GeoIP Intelligence

IP geolocation using MaxMind GeoLite2 City database

Displays source and destination city and country (when available)

Automatically disables GeoIP if database is not present

Export Capabilities

CSV export for analysis and reporting

PCAP export compatible with Wireshark

Platform Support

Designed primarily for Windows using Npcap

Compatible with Linux and macOS with minor interface changes

Browser-based interface (no client installation required)

Technology Stack
Layer	Technology
Backend	Python, Flask
Packet Capture	Scapy
Frontend	HTML, CSS, JavaScript
Visualization	Chart.js
GeoIP	MaxMind GeoLite2
Export	CSV, PCAP
OS Support	Windows (Npcap), Linux
