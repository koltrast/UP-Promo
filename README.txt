# devCodeBlue
More about this quickly.

The user interface is composed with a thermic ticket printer, and a barcode scanner.


### Python Dependencies
- pandas


### Requirement (linux)
```
cups-bsd cmake libcupsimage2-dev
```

### Configuration

The program has been tested to work with a raspberry Pi 3 (ubuntu server 21.10 64bits) and an EPSON TM-T20III printer.

You need to build and install tmx-cups-src-ThermalReceipt-3.0.0.0, in the ressources folder to get the printer working on linux.

```
$ sudo apt install cups-bsd cmake libcupsimage2-dev
```

```
$ cd ressources
$ tar -xzvf tmx-cups-src-ThermalReceipt-3.0.0.0.tar.gz
$ cd Thermal\ Receipt
$ sudo build.sh
$ sudo install.sh
```
