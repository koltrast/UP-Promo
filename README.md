# Union Pragmatique Promo

**Union Pragmatique Promo** is a project dedicated to the creation and sale of reclaimed workwear, adorned with the Union Pragmatique logo. These garments, once functional, are transformed into artistic products and sold with prices adjusted based on the buyer's self-declared net monthly income.

The proceeds from these sales help fund the **Comité des Choses Concrètes**, an association co-founded by Union Pragmatique, aimed at acquiring and sharing creative tools with artists.

## Project Overview

This project is part of Union Pragmatique's artwork for the Œuvrir exhibition. Initially, the project featured a user interface with a thermal printer and a barcode scanner. The project has since been rewritten, with the old Python code moved to the `feature/cli` branch.

It has been tested on a Raspberry Pi (Raspberry Pi OS Lite 64-bit, 2022-09) with an EPSON TM-T20III printer.

## Printer Setup and Configuration

The printer driver, **tmx-cups-src-ThermalReceipt-3.0.0.0**, located in the `resources` folder, must be built manually.

### Step 1: Update System

After a fresh install, update your system by running:

```bash
sudo apt update && sudo apt upgrade
```

### Step 2: Install Printer Dependencies

Install the required dependencies for the printer:

```bash
sudo apt install cups cups-bsd cmake libcupsimage2-dev
```

### Step 3: Build the Printer Driver

To build the driver:

```bash
tar -xzvf tmx-cups-src-ThermalReceipt-3.0.0.0.tar.gz
cd Thermal\ Receipt
sudo ./build.sh
sudo ./install.sh
```

### Step 4: Add User to lpadmin Group

Add your user to the `lpadmin` group:

```bash
sudo usermod -a -G lpadmin <username>
```

### Step 5: Configure CUPS for Remote Access

Since the Raspberry Pi is headless, you need to enable remote access to the CUPS admin page from another machine within the same network.

You can either replace the default `cupsd.conf` file with the one provided in the `resources` folder:

```bash
sudo cp resources/cupsd.conf /etc/cups/cupsd.conf
```

Or, manually edit `/etc/cups/cupsd.conf`:

```bash
sudo nano /etc/cups/cupsd.conf
```

Replace the following line:

```bash
# Only listen for connections from the local machine
Listen localhost:631
```

With:

```bash
# Only listen for connections from the local machine
# Listen localhost:631
Port 631
```

Scroll down to the “location” sections and add the lines shown below:

```bash
# Restrict access to the server...
< Location / >
Order allow,deny
Allow @local
< /Location >

# Restrict access to the admin pages...
< Location /admin >
Order allow,deny
Allow @local
< /Location >

< Location /admin/conf >
AuthType Default
Require user @SYSTEM

# Restrict access to the configuration files...
Order allow,deny
Allow @local
< /Location >
```

This will allow access to CUPS from any computer on your local network. After making these changes, restart the CUPS service:

```bash
sudo /etc/init.d/cups restart
```

You should now be able to access the CUPS admin panel via a web browser at `http://[Pi-IP-or-hostname]:631`.

## Running the Program

### Install Node.js Dependencies

To install the necessary Node.js dependencies:

```bash
npm install
```

### Start the Server

To run the Node.js server:

```bash
node server.js
```

### Running the Python Version (`feature/cli`)

Install Python and `pip`:

```bash
sudo apt install python3 python3-pip
```

Install the required Python packages:

```bash
pip install pandas
```

Run the Python script:

```bash
python3 main.py
```

## Set Up Auto Login with raspi-config

To enable auto-login:

```bash
sudo raspi-config
```

Choose the following options:

1. **System Options**
2. **S5 Boot / Auto Login**
3. **B2 Console Autologin**

Then select **Finish** and reboot the Raspberry Pi.

## Make the Script Run on Startup

Create a script named `blue.sh`:

```bash
cat > blue.sh << EOF
#!/bin/sh
python3 main.py
EOF
```

Make the script executable:

```bash
chmod +x blue.sh
```

Append the script to `.bashrc` so that it runs on startup:

```bash
echo "./blue.sh" >> ~/.bashrc
```

## Sources

- [How to Add a Printer to Your Raspberry Pi or Other Linux Computer](https://www.howtogeek.com/169679/how-to-add-a-printer-to-your-raspberry-pi-or-other-linux-computer/)
- [Print with Shell Commands Courtesy of CUPS](https://www.raspberry-pi-geek.com/Archive/2016/20/Print-with-shell-commands-courtesy-of-CUPS)
