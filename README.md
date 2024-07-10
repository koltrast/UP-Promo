# Union Pragmatique Promo

This project is a part of Union Pragmatique's artwork for Œuvrir exhibition. The user interface is composed with a thermal printer and a barcode scanner.

The program has been tested to work with a raspberry Pi (Raspberry Pi OS Lite 64bits - 2022-09) and an EPSON TM-T20III printer.

## Add and configure the printer

The printer's driver _tmx-cups-src-ThermalReceipt-3.0.0.0_ included in ressources folder need to be built.

After a fresh install, update the system :

```
$ sudo apt update && sudo apt upgrade
```

Install the printer's dependencies :

```
 $ sudo apt install cups cups-bsd cmake libcupsimage2-dev
```

Build the driver

```
$ tar -xzvf tmx-cups-src-ThermalReceipt-3.0.0.0.tar.gz
$ cd Thermal\ Receipt
$ sudo build.sh
$ sudo install.sh
```

Add user to the lpadmin group :

```
$ sudo usermod -a -G lpadmin <username>
```

Because the system running is headless, the cups admin page has to be accessible from another machine (within the same network).

It's possible to either replace the cupsd.conf with the one provided in ressources folder,

```
$ sudo cp ressources/cupsd.conf /etc/cups/cupsd.conf
```

or do it manually editing cupsd.conf :

```
$ sudo nano /etc/cups/cupsd.conf
```

Inside the file, look for this section:

```
# Only listen for connections from the local machine
Listen localhost:631
```

Comment out the “Listen localhost:631” line and replace it with the following:

```
# Only listen for connections from the local machine
# Listen localhost:631
Port 631
```

This instructs CUPS to listen for any contact on any networking interface as long as it is directed at port 631.

Scroll further down in the config file until you see the “location” sections. In the block below, we’ve bolded the lines you need to add to the config:

```
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

The addition of the “allow @local” line allows access to CUPS from any computer on your local network. Anytime you make changes to the CUPS configuration file, you’ll need to restart the CUPS server. Do so with the following command:

```
$ sudo /etc/init.d/cups restart
```

After restarting CUPS, you should be able to access the administration panel via any computer on your local network by pointing its web browser at http://[the Pi’s IP or hostname]:631.

## Run

Install python and pip

```
$ sudo apt install python3 python3-pip
```

install pandas

```
$ pip install pandas
```

run the script

```
$ python3 main.py
```

### set auto login with raspi-config

```
sudo raspi-config
```

Choose option: 1 System Options
Choose option: S5 Boot / Auto Login Choose option: B2 Console Autologin
Select Finish, and reboot the Raspberry Pi.

## make the script running on start

create a script

```
cat > blue.sh << EOF
#!/bin/sh
python3 main.py
EOF
```

Make the script executable

```
chmod +x syncscript.sh
```

Append blue script to .bashrc

```
echo "./blue.sh" | cat .bashrc
```

## source

https://www.howtogeek.com/169679/how-to-add-a-printer-to-your-raspberry-pi-or-other-linux-computer/
https://www.raspberry-pi-geek.com/Archive/2016/20/Print-with-shell-commands-courtesy-of-CUPS
